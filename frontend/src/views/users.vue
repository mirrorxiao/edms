<template>
    <HeaderMenu>
        <Form ref="formInline" label-position="right" :model="search" inline :label-width="70" class="search-bar">
            <FormItem label="用户名" :label-width="80">
                <Input type="text" v-model="search.userName"></Input>
            </FormItem>
            <FormItem label="联系方式">
                <Input type="text" v-model="search.telephone"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="isSearching" @click="goPage(1)">查询</Button>
            </FormItem>
        </Form>

        <div class="main-content">
            <Button style="margin-bottom:20px;" type="primary" @click="openModifyModal({})">新增用户</Button>
            <Table stripe :columns="columns" :data="data" style="margin-bottom:20px;"></Table>
            <Page :total="total" :page-size="pageSize"
            :current="pageNo"
            @on-page-size-change="changePageSize"
            @on-change="goPage"
            show-sizer show-total/>
        </div>

        <Modal
            v-model="resetModal"
            title="重置密码"
            okText="重置"
            @on-ok="resetPasswd"
            @on-cancel="cancel">
            <p>确定重置该用户密码吗？</p>
        </Modal>

        <Modal
            v-model="deleteModal"
            title="删除用户"
            okText="删除"
            @on-ok="deleteUser"
            @on-cancel="cancel">
            <p>确定删除该用户吗</p>
        </Modal>

        <Modal
            v-model="modifyModal"
            :title="formItem.userId? '修改用户': '新增用户'"
            >
            <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                <FormItem label="用户名" prop="USERNAME">
                    <Input size="large" v-model="formItem.USERNAME" placeholder="请输入用户名" style="width: 300px" />
                </FormItem>
                <FormItem label="真实姓名" prop="REALNAME">
                    <Input size="large" v-model="formItem.REALNAME" placeholder="请输入真实姓名" style="width: 300px" />
                </FormItem>
                <FormItem label="角色" prop="roleId">
                    <Select v-model="formItem.roleId" style="width:300px" @on-change="changeRoleId">
                        <Option value="2" key="2">管理员</Option>
                        <Option value="3" key="3">质监局</Option>
                        <Option value="4" key="4">坐席</Option>
                        <Option value="5" key="5">安装人员</Option>
                        <Option value="6" key="6">安保人员</Option>
                    </Select>
                </FormItem>
                <FormItem label="地区" prop="zone" v-show="roleId == 2">
                    <Cascader @on-change="onAreaChange" :data="provinceData" v-model="formItem.zone" change-on-select style="width: 300px;"></Cascader>
                </FormItem>
                <FormItem label="性别" prop="GENDER">
                    <Select v-model="formItem.GENDER" style="width:300px">
                        <Option value="男" key="男">男</Option>
                        <Option value="女" key="女">女</Option>
                    </Select>
                </FormItem>
                <FormItem label="联系方式" prop="TELEPHONE">
                    <Input size="large" v-model="formItem.TELEPHONE" placeholder="联系方式" style="width: 300px" />
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="text" size="large" @click="cancel('modifyModal')">取消</Button>
                <Button type="primary" size="large" @click="modifyUser()">确定</Button>
            </div>
        </Modal>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    import permission from '../config/permission';

    export default {
        data () {
            const province = this.$store.state.user.province;
            const city = this.$store.state.user.city;
            const area = this.$store.state.user.area;
            return {
                isSearching: false,
                modifyModal: false,
                deleteModal: false,
                resetModal: false,
                current: null,
                pageSize: 10,
                pageNo: 1,
                total: 0,
                search: {
                    userName: '',
                    telephone: '',
                },
                roleId: '',
                formItem: {
                    USERNAME: '',
                    REALNAME: '',
                    TELEPHONE: '',
                    zone: [],
                    GENDER: '',
                    roleId: '',
                },
                ruleValidate: {
                    USERNAME: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    REALNAME: [
                        { required: true, message: '请输入真实姓名', trigger: 'blur' }
                    ],
                    TELEPHONE: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ],
                    zone: [
                        { required: true, type: 'array', min: 1, message: '请输入区域', trigger: 'blur' },
                    ],
                    GENDER: [
                        { required: true, message: '请选择性别', trigger: 'blur' }
                    ],
                    roleId: [
                        { required: true, message: '请输入角色', trigger: 'blur' },
                    ],
                },
                columns: [
                    {
                        title: '用户名',
                        key: 'USERNAME'
                    },
                    {
                        title: '真实姓名',
                        key: 'REALNAME'
                    },
                    {
                        title: '角色',
                        key: 'roleName',
                        render (h, params) {
                            return h('span', permission.roles[params.row.roleName]);
                        },
                    },
                    {
                        title: '管理区域',
                        key: 'managerScope'
                    },
                    {
                        title: '联系方式',
                        key: 'TELEPHONE'
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    opr: true,
                                }
                            }, [
                                h('a', {
                                    href: 'javascript:void(0)',
                                    on: {
                                        click: () => {
                                            this.openResetModal(params.row)
                                        }
                                    }
                                }, '重置密码'),
                                h('a', {
                                    href: 'javascript:void(0)',
                                    on: {
                                        click: () => {
                                            this.openModifyModal(params.row)
                                        }
                                    }
                                }, '修改'),
                                h('a', {
                                    href: 'javascript:void(0)',
                                    on: {
                                        click: () => {
                                            this.openDeleteModal(params.row)
                                        }
                                    }
                                }, '删除'),
                            ]);

                        },
                    },
                ],
                data: []
            };
        },
        mounted () {
            this.goPage(1);
        },
        watch: {
        },
        computed: {
            provinceData() {
                const data = this.$store.getters.userProvinceData;
                return data;
            },
            userLevel() {
                const province = this.$store.state.user.province;
                const city = this.$store.state.user.city;
                const area = this.$store.state.user.area;
                if (area) {
                    return 3;
                } else if (city) {
                    return 2;
                } else if (province && province !== '中国') {
                    return 1;
                }
                return 0;
            },
            levelOptions() {
                const province = this.$store.state.user.province;
                const city = this.$store.state.user.city;
                const area = this.$store.state.user.area;
                if (area) {
                    return [{
                        key: 3,
                        value: '区县级',
                    }];
                } else if (city) {
                    return [{
                        key: 3,
                        value: '区县级',
                    }];
                } else if (province && province !== '中国') {
                    return [{
                        key: 2,
                        value: '市级',
                    },{
                        key: 3,
                        value: '区县级',
                    }];
                } else {
                    return [{
                        key: 1,
                        value: '省级',
                    }, {
                        key: 2,
                        value: '市级',
                    },{
                        key: 3,
                        value: '区县级',
                    }];
                }
            }
        },
        methods: {
            changeRoleId(val) {
                this.roleId = val;console.log(val, '====');
                this.$set(this.formItem, 'roleId', val);

                if (val != 2) {
                    const province = this.$store.state.user.province;
                    const city = this.$store.state.user.city;
                    const area = this.$store.state.user.area;
                    this.$set(this.formItem, 'zone', [province, city, area]);
                }
            },
            onAreaChange(value, selectedData) {return;
                const l = this.levelOptions.length;
                if ( l === 3 ) {
                    return;
                } else if (l ===2 ) {
                    if ((value || []).length <= 1) {
                        return this.$set(this.formItem, 'zone', []);
                    }
                } else if (l === 1) {
                    if ((value || []).length <= 2) {
                        return this.$set(this.formItem, 'zone', []);
                    }
                }
            },
            changePageSize (size) {
                this.pageSize = size;
                this.goPage(1);
            },
            goPage (pageNo) {
                this.pageNo = pageNo || this.pageNo;
                this.$http.post(this.$url.USERLIST, {
                    userName: this.search.userName,
                    telephone: this.search.telephone,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                }).then(((response) => {
                    const data = response.data.data;
                    this.data =  data.userList || [];
                    this.total = data.total || 0;
                }).bind(this));
            },
            openResetModal (data) {
                this.current  = data;
                this.resetModal = true;
            },
            openModifyModal (data) {
                this.current = data;
                this.formItem = Object.assign({}, data);
                this.formItem.roleId = String(this.formItem.roleId);
                this.formItem.zone = this.formItem.zone = [];
                data.province = data.province || data.PROVINCE;
                data.city = data.city || data.CITY;
                data.area = data.area || data.AREA;

                data.province && this.formItem.zone.push(data.province);
                data.city && this.formItem.zone.push(data.city);
                data.area && this.formItem.zone.push(data.area);
                this.modifyModal = true;
            },
            openDeleteModal (data) {
                this.current = data;
                this.deleteModal = true;
            },
            resetPasswd () {
                this.$http.post(this.$url.RESET_USER_PASSWD, {
                    userName: this.current.USERNAME
                }).then(((data) => {
                    this.$Message.success('重置密码成功');
                }).bind(this));
            },
            deleteUser () {
                this.$http.post(this.$url.DELETE_USER, {
                    userName: this.current.USERNAME,
                    userId: this.current.userId,                    
                }).then((() => {
                    this.$Message.success('删除成功');
                    this.goPage(1);
                }).bind(this));
            },
            modifyUser () {
                this.$refs['formItem'].validate((valid) => {
                    if (valid) {
                        if (this.formItem.userId) {
                            this._modifyUser();
                        } else {
                            this._addUser();
                        }
                        
                    }
                });
                
            },
            checkZone() {
                let zone = this.formItem.zone;
                const province = this.$store.state.user.province;
                const city = this.$store.state.user.city;
                const area = this.$store.state.user.area;

                if (this.formItem.roleId != 2) {
                    return [province, city, area];
                }

                if (area) {
                    zone.splice(0, 0, province, city);
                } else if (this.$store.state.user.city) {
                    zone.splice(0, 0, province, city);                    
                } else if (province && province != '中国') {
                    zone.splice(0, 0, province);
                }
                return zone;
            },
            _modifyUser () {
                const zone = this.checkZone();
                this.$http.post(this.$url.MODIFY_USER, {
                    id: this.formItem.userId || '',
                    userName: this.formItem.USERNAME,
                    realName: this.formItem.REALNAME,
                    province: zone[0],
                    city: zone[1],
                    area: zone[2],
                    gender: this.formItem.GENDER,
                    telephone: this.formItem.TELEPHONE,
                    level: this.userLevel,
                    roleId: +this.formItem.roleId,
                }).then((() => {
                    this.modifyModal = false;
                    this.goPage(1);
                    this.$Message.success('修改用户成功');
                }).bind(this));
            },
            _addUser () {
                const zone = this.checkZone();
                this.$http.post(this.$url.CREATE_USER, {
                    userName: this.formItem.USERNAME,
                    realName: this.formItem.REALNAME,
                    province: zone[0],
                    city: zone[1],
                    area: zone[2],
                    gender: this.formItem.GENDER,
                    telephone: this.formItem.TELEPHONE,
                    level: this.userLevel,
                    roleId: +this.formItem.roleId,
                }).then((() => {
                    this.modifyModal = false;
                    this.goPage(1);
                    this.$Message.success('新增用户成功');
                }).bind(this));
            },
            cancel (name) {
                if (name) {
                    this[name] = false;
                }
            },
        },
        components: {
            HeaderMenu,
        }
    }
</script>
<style scoped>
</style>
