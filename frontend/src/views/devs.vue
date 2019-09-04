<template>
    <HeaderMenu>
        <Form ref="formInline" label-position="right" :model="search" inline :label-width="70" class="search-bar">
            <FormItem label="设备SN码" :label-width="80">
                <Input type="text" v-model="search.deviceSNCode"></Input>
            </FormItem>
            <FormItem label="安装人员">
                <Input type="text" v-model="search.operator"></Input>
            </FormItem>
            <FormItem label="安装地址">
                <Input type="text" v-model="search.elv_Address"></Input>
            </FormItem>
            <FormItem label="电梯注册码" :label-width="80">
                <Input type="text" v-model="search.registerCode"></Input>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="search.onlineStatus" style="width:200px">
                    <Option value="" key="">全部</Option>
                    <Option value="1" key="1">在线</Option>
                    <Option value="0" key="0">离线</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="isSearching" @click="goPage(1)">查询</Button>
                <!-- <Button type="ghost" @click="resetSearch()">重置</Button> -->
            </FormItem>
        </Form>

        <div class="main-content">
            <Button style="margin-bottom: 20px;" @click="openAttachModal" v-if="!isQualityOfficer">新增设备</Button>
            <Table stripe :columns="columns" :data="data"></Table>
            <Page :current="page" :total="total" @on-change="goPage" 
            @on-page-size-change="changePageSize"
            show-sizer show-total/>
        </div>

        <Modal
            v-model="attachModal"
            title="新增设备">
            <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                <FormItem label="设备SN码" prop="deviceSNCode">
                    <Input size="large" v-model="formItem.deviceSNCode" placeholder="请输入设备SN码" style="width: 300px" />
                </FormItem>
                <FormItem label="电梯注册码" prop="registerCode">
                    <Input size="large" v-model="formItem.registerCode" placeholder="请输入电梯注册码" style="width: 300px" />
                </FormItem>
                <FormItem label="电梯站数">
                    <Input size="large" v-model="fromStation" placeholder="请输入电梯注册码" style="width: 100px" />
                    层-
                    <Input size="large" v-model="toStation" placeholder="请输入电梯注册码" style="width: 100px" />
                    层
                    <Checkbox
                    class="check-all"
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
                </FormItem>

                <FormItem label="">
                    <CheckboxGroup :class="station-group" v-model="checkAllGroup" @on-change="checkAllGroupChange">
                        <Input class="station-item" :value="station" v-for="(station, index) in stations" :key="index" @on-change="changeStation($event, index)">
                            <Checkbox slot="prepend" class="station-item-checkbox" :label="index">
                                <span class="text"></span>
                            </Checkbox>
                            <span slot="append">层</span>
                        </Input>
                    </CheckboxGroup>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="text" size="large" @click="cancel('modifyModal')">取消</Button>
                <Button type="primary" size="large" @click="attach">确定</Button>
            </div>
        </Modal>

        <Modal
            v-model="removeModal"
            title="删除"
            okText="删除"
            @on-ok="remove"
            @on-cancel="cancel">
            <p>确定删除该设备吗？</p>
        </Modal>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    export default {
        data () {
            const columns = [
                {
                    title: '设备SN码',
                    key: 'deviceSNCode'
                },
                {
                    title: '电梯注册码',
                    key: 'registerCode'
                },
                {
                    title: '状态',
                    key: 'onlineStatus',
                    render (h, params) {
                        return h('span', 
                            params.row.onlineStatus == 1? '在线': '离线'
                        );
                    }
                },
                {
                    title: '安装地址',
                    key: 'elv_Address'
                },
                {
                    title: '安装人员',
                    key: 'operator'
                },
                {
                    title: '安装人员电话',
                    key: 'operatorPhone'
                },
                
            ];
            if (!this.isQualityOfficer) {
                columns.push({
                    title: '操作',
                    render: (h, params) => {
                        if (this.isQualityOfficer) {
                            return h('div', '--');
                        }
                        return h('div', {
                            class: {
                                opr: true,
                            }
                        }, [
                            h('a', {
                                href: 'javascript:void(0)',
                                on: {
                                    click: () => {
                                        this.openRemoveModal(params.row)
                                    }
                                }
                            }, '删除')
                        ]);

                    },
                },);
            }
            return {
                search: {},
                isSearching: false,
                current: {},
                attachModal: false,
                removeModal: false,
                formItem: {
                    deviceSNCode: '',
                    registerCode: '',
                },
                fromStation: 0,
                toStation: 1,
                stations: {1: '1'},
                indeterminate: true,
                checkAll: false,
                checkAllGroup: [],
                ruleValidate: {
                    deviceSNCode: [
                        { required: true, message: '请输入设备SN码', trigger: 'blur' }
                    ],
                    registerCode: [
                        { required: true, message: '请输入电梯注册码', trigger: 'blur' }
                    ],
                },
                total: 0,
                page: 1,
                pageSize: 10,
                columns: columns,
                data: []
            };
        },
        mounted () {//页面渲染初始化事件
            this.goPage(1);
        },
        computed: {
            isQualityOfficer() {
                return this.$store.state.role === 'quality_officer';
            }
        },
        watch: {
            toStation() {
                this.setStations();
            },
            fromStation() {
                this.setStations();
            }
        },
        methods: {
            setStations () {
                this.stations = {};
                const toStation = this.toStation || 1;
                for(let i=this.fromStation, ii=0;i<=toStation;i++) {
                    if (i === 0) {continue;}
                    this.stations[ii++] = String(i);
                }
            },
            changeStation(e, index) {
                this.stations[index] = e.target.value;
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = Object.keys(this.stations);
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === this.stations.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.goPage(1);
            },
            goPage (page) { 
                this.page = page || this.page;
                this.getDevs();
            },
            getDevs () {
                this.$http.post(this.$url.DEVLIST, {
                    registerCode: this.search.registerCode,
                    deviceSNCode: this.search.deviceSNCode,
                    onlineStatus: this.search.onlineStatus,
                    elv_Address: this.search.elv_Address,
                    operator: this.search.operator,
                    userId: this.$store.state.user.id,
                    pageSize: this.pageSize,
                    pageNo: this.page,

                }).then((response) => {
                    const data = response.data.data;
                    this.data = data.deviceList || [];
                    //TODO 分页
                    this.total = data.total || 0;
                }).catch((err) => {
                });
            },
            openAttachModal() {
                this.attachModal = true;
                this.current = null;
                this.$refs.formItem.resetFields();
            },
            openRemoveModal(data) {
                this.current = data;
                this.removeModal = true;
            },
            attach () {
                const arr = this.checkAllGroup.sort((a, b) => {
                    return a - b;
                }).map(a => {
                    return this.stations[a];
                });

                this.$http.post(this.$url.DEV_BIND, Object.assign({
                    userId: this.$store.state.user.id,
                    stations: arr,
                }, this.formItem)).then((data) => {
                    this.$Message.success('绑定成功');
                    this.goPage(1);
                    this.cancel();
                });
            },
            remove () {
                this.$http.post(this.$url.DEV_UNBIND, {
                    registerCode: this.current.registerCode
                }).then((data) => {
                    this.$Message.success('删除成功');
                    this.goPage(1);
                });
            },
            cancel() {
                this.attachModal = false;
            },
            resetSearch() {console.log(11);
                this.$refs.formInline.resetFields();
            }
        },
        components: {
            HeaderMenu,
        }
    }
</script>

<style scoped>
.station-group{
    /* width: 70px; */
}
.station-item{
    float: left;
    width: 88px;
    margin: 5px;
}
.station-item-checkbox{
    width: 4px;
}
.station-item-checkbox+span{
    display: none;
}
.check-all{
    margin-left: 20px;
}
</style>
