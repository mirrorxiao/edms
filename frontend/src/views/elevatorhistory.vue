<template>
    <HeaderMenu>
    <div class="main-content">
        <Breadcrumb>
            <BreadcrumbItem to="/">电梯总览</BreadcrumbItem>
            <BreadcrumbItem>{{elevator.elvAddress}}</BreadcrumbItem>
        </Breadcrumb>
       <EleTabs></EleTabs>

       <div>
           <Form ref="formInline" :model="search" inline label-position="left" :label-width="70">
                <FormItem label="时间范围">
                    <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetimerange" v-model="search.time" split-panels placeholder="选择时间" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="事件级别">
                    <Select v-model="search.eventLevel" style="width:200px">
                        <Option value="" key="">全部</Option>
                        <Option value="1" key="1">一般</Option>
                        <Option value="2" key="2">异常</Option>
                        <Option value="3" key="3">故障</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="goPage(1)">查询</Button>
                </FormItem>
            </Form>

            <Table stripe :columns="columns" :data="data"></Table>
            <Page :current="page" :total="total" 
            :page-size="pageSize"
            @on-change="goPage" 
            @on-page-size-change="changePageSize" 
            show-sizer show-total/>
       </div>
    </div>

    <Modal v-model="signalModal" fullscreen title="关联信号">
        <signalTable :signalList="signalList"></signalTable>

        <div slot="footer">
            <Button type="primary" @click="signalModal=false">关闭</Button>
        </div>
    </Modal>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    import EleTabs from '../components/elevator/tabs.vue';
    import signalTable from '../components/elevator/signalTable.vue';
    export default {
        data () {
            const levelMap = ['', '一般', '异常', '故障'];
            const now = new Date();
            const _30Ago = new Date();
            _30Ago.setTime(now.getTime() - 30 * 24 * 3600 * 1000);
            const self = this;
            return {
                search: {
                    time: [_30Ago, now],
                    eventLevel: '',
                },
                signalModal: false,
                pageSize: 20,
                page: 1,
                total: 0,
                elevator: {},
                columns: [
                    {
                        title: '查看',
                        width: 70,
                        fixed: 'left',
                        render(h, params) {
                            return h('a', {
                                on: {
                                    click() {
                                        self.viewDetail(params.row);
                                    }
                                }
                            }, '查看');
                        },
                    },
                    {
                        title: '时间',
                        key: 'eventTime',
                        width: 110,
                        fixed: 'left',
                    },
                    {
                        title: '事件名称',
                        key: 'eventName',
                        width: 100,
                        fixed: 'left',
                    },
                    {
                        title: '事件级别',
                        key: 'eventLevel',
                        width: 60,
                        fixed: 'left',
                        render (h, params) {
                            const l = params.row.eventLevel;
                            return h('div', {
                                class: {
                                    'level-info' : true, 
                                    ['level-' + l]: true,
                                }
                            }, levelMap[l]);
                        },
                    },
                    // {
                    //     title: '楼层',
                    //     key: 'eventLevel',
                    //     width: 60,
                    //     fixed: 'left',
                    // },

                    //signal begin
                    {
                        title: '上平层',
                        key: 'eventLevel',
                        width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.upperLeve;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下平层',
                        key: 'eventLevel',
                        width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lowerLevel;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '安全回路',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.securityControl;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '厅门锁',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lockDoor;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '运行信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.runningSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '抱闸信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lockSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '消防信息',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.fireSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上限位',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.upperLimitP;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下限位',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lowerLimitP;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上行减速',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.uplinkDeceleration;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下行减速',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.downlinkDeceleration;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '轿门锁',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lockSedandoor;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '上极限',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.upperLimit;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '下极限',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lowerLimit;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '机房检修',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.mInspection;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '光幕信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.lightSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '开门信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.openSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '关门信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.closedSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '开门到位',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.openPlace;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '关门到位',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.closedPlace;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '满载信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.fullySignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '超载信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.overloadSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '报警信号',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.warningSignal;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '轿顶检修',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.elvOverhaul;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '司机运行',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.driverOperation;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },
                    {
                        title: '电梯电源',
                        key: 'eventLevel',
						width: 60,
                        render (h, params) {
                            const l = params.row.signalInfo.elvPower;
                            return h('div', {
                                class: {
                                    'active' : l == 1,
									'signal': true,
                                }
                            }, '');
                        },
                    },

                ],
                data: [],
                signalList: [],
            }
        },
        mounted() {
            this.goPage(1);
            this.getElevatorInfo();
        },
        methods: {
            getElevatorInfo() {
                this.$http.post(this.$url.ELEVATOR_DETAIL, {
                    registerCode: this.$route.params.id,
                    userId: this.$store.state.user.id,
                }).then((response) => {
                    this.elevator = (response.data.data || []).eleInfo || {};
                });
            },
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.goPage(1);
            },
            goPage (page) { 
                this.page = page;
                const postData = {
                    userId: this.$store.state.user.id,
                    registerCode: this.$route.params.id,
                    eventLevel: this.search.eventLevel || '',
                    pageSize: this.pageSize,
                    pageNo: page,
                    needSignal: 1,
                }
                if (this.search.time[0]) {
                    postData.startTime = this.search.time[0];
                }
                if (this.search.time[1]) {
                    postData.endTime = this.search.time[1];
                }

                this.$http.post(this.$url.INCIDENTLIST, postData).then((response) => {
                    const data = response.data.data;
                    this.data =  (data.eventInfoList || []).map(e => {
                        const signalInfo = (e.signalList || [])[0] || {};
                        
                        e.signalInfo = signalInfo;
                        e.signalList = e.signalList || [];
                        //TODO 处理信号
                        return e;
                    });
                    //TODO 分页
                    this.total = data.total || 0;
                }).catch((err) => {
                    console.log(err);
                    this.$Message.error('服务异常，请稍后尝试');
                });
            },
            viewDetail(data) {
                this.signalList = data.signalList;
                this.signalModal = true;
            }
        },
        components: {
            EleTabs,
            signalTable,
            HeaderMenu,
        },
        
    }
</script>
<style scoped>
.main-content{
    padding: 30px;
}
h3{
    font-size: 16px;
    margin-bottom: 20px;
}
.elevator-img{
    float:left;
    width: 300px;
}
.elevator-img img{
    width: 300px;
}
.elevator-info{
    margin-left: 330px;
}
</style>

<style>
.level-1{}
.level-2{
    color: #ffa27b;
}
.level-3{
    color: #ff3442;
}
.signal{
    width: 20px;
    height: 20px;
    background: #cccccc;
    border-radius: 10px;
}
.signal.active{
    background: #00d0a4;
}
</style>

