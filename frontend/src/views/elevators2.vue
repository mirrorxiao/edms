<template>
    <HeaderMenu>
        <div>
        <Form ref="formInline" label-position="right" :model="search" inline :label-width="70" class="search-bar">
            <FormItem label="区域">
                <Cascader :data="provinceData" change-on-select v-model="search.zone" style="width: 300px;"></Cascader>
            </FormItem>
            <FormItem label="电梯注册码" :label-width="80">
                <Input type="text" v-model="search.registerCode"></Input>
            </FormItem>
            <FormItem label="安装地址">
                <Input type="text" v-model="search.elvAddress"></Input>
            </FormItem>
            <FormItem label="状态">
                <RadioGroup v-model="search.online" type="button" @on-change="goPage(1)">
                    <Radio label="">全部</Radio>
                    <Radio label="1">在线</Radio>
                    <Radio label="0">离线</Radio>
                    <Radio label="3">故障</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="goPage(1)">查询</Button>
                <Button type="primary" @click="openImportModal(1)" v-if="isAdmin">导入数据</Button>
            </FormItem>
        </Form>

        <div class="main-content">
            <div class="view-frame" :style="viewFrameStyle">
                <div class="view"
                @click="viewDetail(item)"
                :class="{
                    'up': item.runningState.running == 1,
                    'stop': item.runningState.running == 0,
                    'down': item.runningState.running == 2,
                    'open': item.runningState.door == 1,
                    'close': item.runningState.door == 0,
                    'online': item.runningState.online == 1,
                    'offline': item.runningState.online == 0,
                    'alarm': item.runningState.alarm == 1,
                    'non-alarm': item.runningState.alarm == 0,
                    'overload': item.runningState.overload == 1,
                    'en-overload': item.runningState.overload == 2,
                    'non-overload': item.runningState.overload == 0,
                    'bad': item.runningState.eventLevel == 3,
                }"
                 :style="viewStyle" :key="item.id" v-for="item in elevators">
                    <div class="bg">
                        <div class="inner-body">
                        <div class="floor">
                            <!-- <Led :class="ledCls(item.floor01)"></Led><Led :class="ledCls(item.floor02)"></Led>
                             -->
                             {{item.floor || 0}}
                        </div>

                        <div class="state">
                            <div class="icon running-status"></div>
                            <div class="icon open-status"></div>
                            <div class="icon alarm-status"></div>
                            <div class="icon overload-status"></div>
                        </div>
                        <div class="address">
                            {{item.elvAddress}}
                        </div>
                        </div>
                    </div>
                </div>
            </div>


            <Page :current="page" :total="total" :page-size="pageSize"
             @on-page-size-change="changePageSize"
             @on-change="goPage" show-sizer show-total/>
        </div>
        </div>

        <Modal
            v-model="importModal"
            title="导入数据">
            <Form ref="importForm" :model="importForm" :label-width="100" :rules="ruleValidate">
                <FormItem label="Area Code" prop="areacode">
                    <Input size="large" v-model="importForm.areacode" placeholder="请输入Area Code" style="width: 300px" />
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="text" size="large" @click="importModal=false">取消</Button>
                <Button type="primary" size="large" @click="importData">确定</Button>
            </div>
        </Modal>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    import Led from '../components/common/led.vue';
    
    export default {
        data () {
            return {
                isSearching: false,
                search: {
                    registerCode: '',
                    installPerson: '',
                    elvAddress: '',
                    online: '',
                    zone: [],
                },
                total: 0,
                page: 1,
                pageSize: 10,//default
                elevators: [],
                ws: null,
                splitWidth: 0,
                num: 0,
                importModal: false,
                importForm: {
                    areacode: '',
                },
                ruleValidate: {
                    areacode: [
                        { required: true, message: '请输入Area Code', trigger: 'blur' }
                    ],
                },
            };
        },
        mounted() {
            this.initWs();
            this.goPage(1);
            this.setBlockSize();
            window.onresize = () => {
                this.setBlockSize();
            }
            // const self = this;

            // let flag1 = 0;
            // let flag2 = 0;
            // let flag3 = 0;
            // let flag4 = 0;
            // let flag5 = 0;
            // let flag6 = 0;
            // setInterval(() => {
            //     self.updateStatus({
            //         running: flag1++%2,
            //         door: flag2++%2,
            //         online: flag3++%2,
            //         alarm: flag4++%2,
            //         overload: flag5++%2,
            //         floor: flag6++%20,
            //         deviceSnCode: 114,
            //     });
            // }, 1000);
        },
        destroyed() {
            window.onresize = null;
            this.ws && this.ws.close();
        },
        computed: {
            provinceData() {
                return this.$store.getters.provinceData;
            },
            viewFrameStyle() {
                const width = (this.splitWidth + 240) * this.num;
                return {
                    width: `${width}px`,
                    margin: 'auto',
                };
            },
            viewStyle() {
                return {
                    width: `${this.splitWidth + 220}px`
                }
            },
            isAdmin() {
                const role = this.$store.state.role; 

                return role === 'admin' || role === 'region_admin'; 
            },
        },
        methods: {
            viewDetail(item) {
                this.$router.push({
                    path: '/elevators/' + item.registerCode
                });
            },
            ledCls(floor) {
                const arr = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
                const cls = {};
                cls[arr[floor || 0]] = true;
                return cls;
            },
            setBlockSize () {
                const totalWidth = window.document.body.scrollWidth - 40;
                const num = this.num = Math.floor(totalWidth/240);
                this.splitWidth = (totalWidth - 240 * num)/num;
                console.log(num);
            },
            initWs() {
                const self = this;
                //websocket更新
                let ws = this.ws = new WebSocket('wss://edms.gd95009.com/auth-web' + this.$url.ws_elevator_detail);
                ws.onopen = function () {}
                // 使用 send() 方法发送数据
                
                // 接收服务端数据时触发事件
                ws.onmessage = function (evt) {
                    let msg;
                    try {
                        msg = JSON.parse(evt.data);
                    } catch(e) {
                        console.log('parse data to json obj error');
                    }
                    console.log(evt);
                    if (msg) {
                        self.updateStatus(msg.data);
                    }
                };
                
                // 断开 web socket 连接成功触发事件
                ws.onclose = function () {
                    console.log("连接已关闭...");

                };
            },
            updateStatus(data) {
                const one = this.elevators.find(e => e.runningState.deviceSnCode == data.deviceSnCode);
                if (!one) {
                    return ;
                } 
                this.$set(one.runningState, 'running', data.running);
                this.$set(one.runningState, 'door', data.door);
                this.$set(one.runningState, 'online', data.online);
                this.$set(one.runningState, 'alarm', data.alarm);
                this.$set(one.runningState, 'overload', data.overload);
                this.$set(one.runningState, 'eventLevel', data.eventLevel);
                this.$set(one, 'floor', data.floor);
            },
            goPage (page) {
                this.pageNo = page || this.pageNo || 1;
                const data = Object.assign({
                    pageNo: page, 
                    pageSize: this.pageSize,
                    userId: this.$store.state.user.id,
                    elvProvince: this.search.zone[0] || '',
                    elvCity: this.search.zone[1] || '',
                    elvArea: this.search.zone[2] || '',
                    registerCode: this.search.registerCode || '',
                    installPerson: this.search.installPerson || '',
                    elvAddress: this.search.elvAddress || '',
                    online: this.search.online == 3? '': this.search.online,
                    eventLevel: this.search.online == 3? 3: '',
                }, {});
                

                if (data.online === '') {
                    delete data.online;
                }
                this.$http.post(this.$url.ELEVATORLIST, data).then((response) => {
                    const data = response.data.data;
                    let i = 0;
                    const sncodes = [];
                    this.elevators = (data.elevatorInfoList || []).map(e => {
                        e.runningState = e.runningState? e.runningState : {
                            running: 0,
                            door: "0",
                            online: "0",
                            alarm: "0",
                            overload: "0",
                        };
                        e.floor = e.floor || 1;
                        e.runningState.deviceSnCode && sncodes.push(e.runningState.deviceSnCode);

                        this.ws && this.ws.send(JSON.stringify({
                            type: 'init',
                            version: 1,
                            data: sncodes,
                        }));
                        return e;
                    });
                    
                    this.total = data.total || 0;
                });
            },
            changePageSize (pageSize) {
                this.pageSize = pageSize;
                this.goPage(1);
            },
            openImportModal () {
                this.importModal = true;
                this.$refs.importForm.resetFields();
            },
            importData() {
                this.$http.post(this.$url.IMPORT_DATA, {
                    areacode: this.importForm.areacode,
                    userId: this.$store.state.user.id,
                }).then((response) => {
                    if (response.data.code == 0) {
                        this.$Message.success('数据导入成功');
                    } else {
                        this.$Message.error(response.data.message || '数据导入失败');
                    }
                    this.importModal = false;
                });
            },
        },
        components: {
            HeaderMenu,
            Led,
        }
    }
</script>
<style scoped>
    .view-frame{

    }
    .view-frame::after{
        content: '';
        display: block;
        clear: both;
    }
    .view{
        float: left;
        width: 280px;
        height: 310px;
        margin: 10px;
        box-shadow: 0px 0px 3px 0px rgba(54, 204, 173, 1) inset;
        border-radius: 4px;
        padding: 20px 0;
        cursor: pointer;
    }
    .view .bg{
        position: relative;
        margin: auto;
        width: 218px;
        height: 100%;
        background: url('../images/u6744.jpg') no-repeat;
        background-size:220px 270px;
    }
    .inner-body{
        height: 100%;
    }
    .offline .inner-body{
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        font-size: 40px;
    
        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: rgba(153, 153, 153, 0.8);
    }
    .offline .inner-body:after{
        content: "\e906";        
        position: absolute;
        left: 89px;
        top: 114px;
    }
    .floor{
        position: absolute;
        width: 100%;
        text-align: center;
        color: #FF0000;
        font-weight: bold;
        font-size: 14px;
        line-height: 38px;
    }
    .state{
        position: absolute;
        display: flex;
        justify-content: center;
        bottom: 45px;
        padding: 10px 42px;
        width: 100%;
        background: rgba(255, 255, 255, 0.8);
    }
    .view .icon{
         /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'icomoon' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        font-size: 30px;
        margin: auto 10px;
    
        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .up .running-status::before{
        content: "\e90b";
        color: #36ccad;
    }
    .down .running-status::before{
        content: "\e902";
        color: #36ccad;
    }
    .stop .running-status::before{
        content: "\e90a";
        color: #777;
    }
    .overload .overload-status::before{
        content: "\e909";
        color: #f96;
    }
    .state .open-status{
        font-size: 26px;
    }
    .state .overload-status{ 
        font-size: 24px;
    }
    .non-overload .overload-status::before{    
        content: "\e905";
        color: #36ccad;
    }
    .en-overload .overload-status::before{
        content: "\e903";
        color: #ff4c4c;
    }
    .non-alarm .alarm-status::before{
        content: "\E904";
        color: #777;
    }
    .alarm .alarm-status::before{
        content: "\E900";
        color: #ff4c4c;
    }
    .open .open-status::before{
        content: "\e908";
        color: #3dcca6;
    }
    .close .open-status::before{
        content: "\e901";
        color: #777;
    }

    .address{
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        color: #000;
    }
    .offline .address {
        color: #fff;
    }

    .offline .state{
        display: none;
    }
    
    .bad.view{
        box-shadow: 0px 0px 3px 0px rgb(204, 77, 54) inset;
    }
    .offline.view{
        box-shadow: 0px 0px 3px 0px rgb(194, 193, 193) inset;
    }
    
</style>
