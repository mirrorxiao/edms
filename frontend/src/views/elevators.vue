<template>
    <HeaderMenu>
        <div>
        <Form ref="formInline" label-position="right" :model="search" inline :label-width="70" class="search-bar">
            <FormItem label="电梯注册码" :label-width="80">
                <Input type="text" v-model="search.regCode"></Input>
            </FormItem>
            <FormItem label="安装人员">
                <Input type="text" v-model="search.installer"></Input>
            </FormItem>
            <FormItem label="安装地址">
                <Input type="text" v-model="search.address"></Input>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="search.status" style="width:200px">
                    <Option value="all" key="all">全部</Option>
                    <Option value="online" key="online">在线</Option>
                    <Option value="offline" key="offline">离线</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="goPage(1)">查询</Button>
                <Button type="ghost" @click="import()">导入</Button>
            </FormItem>
        </Form>

        <div class="main-content">
            <Table stripe :columns="columns" :data="data" style="margin-bottom:20px;"></Table>
            <Page :current="page" :total="total" :page-size="pageSize"
             @on-page-size-change="changePageSize"
             @on-change="goPage" show-sizer show-total/>
        </div>
        </div>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    export default {
        data () {
            return {
                isSearching: false,
                search: {
                    regCode: '',
                    installer: '',
                    address: '',
                    status: 'all',
                },
                total: 0,
                page: 1,
                pageSize: 20,//default
                columns: [
                    {
                        title: '电梯注册码',
                        key: 'registerCode'
                    },
                    {
                        title: '电梯地址',
                        key: 'elevatorAddress'
                    },
                    {
                        title: '状态',
                        key: 'runningState',
                        render: (h, params) => {
                            const images = ( params.row.runningState || []).map(state => {
                                return h('img', {
                                    src: `../images/${state.name}${state.value}.svg`
                                });
                            });
                            return h('div', {
                                class: 'state'
                            }, images)
                        },
                    },
                    {
                        title: '楼层',
                        key: 'currentFloor'
                    },
                    {
                        title: '故障状况',
                        key: 'faultState',
                        render: (h, params) => {
                            const cls = {};
                            cls[`level-${params.row.level}`] = true;
                            return h('div', {
                                class: cls,
                            }, params.row.level)

                        },
                    },
                    {
                        title: '维保单位',
                        key: 'maintenanCompany',
                    }
                ],
                data: [
                ]
            };
        },
        mounted() {
            //this.reset
            this.goPage(1);
        },
        methods: {
            goPage (page) {
                this.$http.get(this.$url.ELEVATORLIST, {params: Object.assign({page: page, pageSize: this.pageSize}, this.search)}).then(((response) => {
                    if (response.data.code === 0) {
                        this.data = response.data.data;
                        this.total = response.data.total || 0;
                    } else {
                        this.$Message.error('系统错误，请稍后尝试');
                    }
                }).bind(this));
            },
            changePageSize (pageSize) {
                this.pageSize = pageSize;
                this.goPage(1);
            }
        },
        components: {
            HeaderMenu,
        }
    }
</script>
<style scoped>
</style>
