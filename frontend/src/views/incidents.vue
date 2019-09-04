<template>
    <HeaderMenu>
        <Form ref="formInline" :model="search" inline label-position="left" :label-width="70" class="search-bar">
            <FormItem label="时间范围">
                <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetimerange" v-model="search.time" split-panels placeholder="选择时间" style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem label="事件名称">
                <Input type="text" v-model="search.eventName" style="width: 200px;"></Input>
            </FormItem>
            <FormItem label="事件级别">
                <Select v-model="search.eventLevel" style="width:200px">
                    <Option value="" key="">全部</Option>
                    <Option value="1" key="1">一般</Option>
                    <Option value="2" key="2">异常</Option>
                    <Option value="3" key="3">故障</Option>
                </Select>
            </FormItem>
            <FormItem label="电梯注册码" :label-width="80">
                <Input type="text" v-model="search.registerCode" style="width: 200px;"></Input>                
            </FormItem>
            <FormItem label="区域">
                <Cascader :data="provinceData" trigger="hover" change-on-select v-model="search.zone" style="width: 300px;"></Cascader>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="goPage(1)">查询</Button>
            </FormItem>
        </Form>
        <div class="main-content">
            <Table stripe :columns="columns" :data="data"></Table>
            <Page :current="page" :total="total" 
            :page-size="pageSize"
            @on-change="goPage" 
            @on-page-size-change="changePageSize" 
            show-sizer show-total/>
        </div>

         <Modal
            width="600"
            v-model="modal"
            title="关闭事件">

            <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                <FormItem label="电梯注册码" prop="closeReason">
                    <span>{{current.registerCode}}</span>
                </FormItem>
                <FormItem label="事件名称" prop="closeReason">
                    <span>{{current.eventName}}</span>                    
                </FormItem>
                <FormItem label="电梯地址" prop="closeReason">
                    <span>{{current.elvAddress}}</span>                    
                </FormItem>
                <FormItem label="关闭原因" prop="closeReason">
                    <Input type="textarea" size="large" v-model="formItem.closeReason" placeholder="关闭原因" style="width: 300px" />
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="close">确定</Button>
            </div>
        </Modal>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
   
    export default {
        computed: {
            provinceData() {
                return this.$store.getters.provinceData;
            }
        },
        data () {
            const levelMap = ['', '一般', '异常', '故障']
            return {
                page: 1,
                pageSize: 10,
                total: 0,
                modal: false,
                search: {
                    time: [],
                    eventLevel: '',
                    registerCode: '',
                    zone: [],
                },
                formItem: {
                    registerCode: '',
                    closeReason: '',
                },
                ruleValidate: {
                    closeReason: [
                        { required: true, message: '请输入关闭原因', trigger: 'blur' }
                    ]
                },
                current: {},
                columns: [
                    {
                        title: '时间',
                        key: 'eventTime'
                    },
                    {
                        title: '事件名称',
                        key: 'eventName'
                    },
                    {
                        title: '事件级别',
                        key: 'eventLevel',
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
                    {
                        title: '电梯注册码',
                        key: 'registerCode'
                    },
                    {
                        title: '电梯地址',
                        key: 'elvAddress'
                    },
                    {
                        title: '维保人员',
                        key: 'elvMpersonnel'
                    },
                    {
                        title: '维保人员电话',
                        key: 'elvMpersonnelTel'
                    },
                    {
                        title: '是否关闭',
                        key: 'eventStatus',
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    'close-info' : true, 
                                    'closed': params.row.eventStatus,
                                }
                            }, params.row.eventStatus == 1? '否': '是');
                        }
                    },
                    {
                        title: '关闭人',
                        key: 'closer'
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    opr: true,
                                    disabled: params.row.eventStatus != 1 
                                }
                            }, (this.$store.state.user.role === 'quality_officer' || params.row.eventLevel == 1)? '--' : [
                                h('a', {
                                    href: 'javascript:void(0)',
                                    class: {
                                        'disabled': params.row.eventStatus,
                                    },
                                    on: {
                                        click: () => {
                                            this.openCloseModal(params.row)
                                        }
                                    }
                                }, '关闭事件')
                            ]);

                        },
                    },
                ],
                data: []
            }
        },
        mounted () {
            this.goPage(1);
        },
        methods: {
            changePageSize(pageSize) {
                this.pageSize = pageSize;
                this.goPage(1);
            },
            goPage (page) { 
                this.page = page;
                const postData = {
                    registerCode: this.search.registerCode || '',
                    eventName: this.search.eventName || '',
                    eventLevel: this.search.eventLevel || '',
                    elvProvince: this.search.zone[0] || '',
                    elvCity: this.search.zone[1] || '',
                    elvArea: this.search.zone[2] || '',
                    pageSize: this.pageSize,
                    pageNo: page,
                    userId: this.$store.state.user.id,
                }
                if (this.search.time[0]) {
                    postData.startTime = this.search.time[0];
                }
                if (this.search.time[1]) {
                    postData.endTime = this.search.time[1];
                }

                this.$http.post(this.$url.INCIDENTLIST, postData).then((response) => {
                    const data = response.data.data;
                    this.data =  data.eventInfoList || [];
                    //TODO 分页
                    this.total = data.total || 0;
                }).catch((err) => {
                    console.log(err);
                    this.$Message.error('服务异常，请稍后尝试');
                });
            },
            openCloseModal(data) {
                if (data.eventStatus != 1) {
                    return this.$Message.warning('事件已关闭');
                }
                this.modal = true;
                this.current = data;
                this.$refs.formItem.resetFields();
            },
            close () {
                this.$refs.formItem.validate(valid => {
                    if (!valid) {
                        return;
                    }

                    this.$http.post(this.$url.CLOSE_INCIDENT, Object.assign({
                        eventIds: [this.current.eventId],
                        closer: this.$store.state.user.id,
                        userId: this.$store.state.user.id,
                    }, this.formItem)).then((data) => {
                        this.modal = false;
                        this.$Message.success('关闭成功');
                        this.goPage(this.page);//刷新当前页
                    });
                });
                
            },
            cancel() {
                this.modal = false;
            }
        },
        components: {
            HeaderMenu,
        },
        
    }
</script>
<style scoped>
.modal-table{
    text-align: center;
    width: 440px;
    margin: auto;
}
.modal-table div{
    padding: 10px 0;
}
.header{
    background: #eee;
}
.header div{
    border: 1px solid #fff;
}
.table-body{
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
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
