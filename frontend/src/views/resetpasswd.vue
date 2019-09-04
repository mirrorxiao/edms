<template>
    <HeaderMenu>
        <div class="main-content">
            <h2>修改初始密码</h2>
            <p class="tips">为了您的账号安全，首次登陆请修改初始密码。</p>
            <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
                <FormItem label="新密码" prop="password">
                    <Input size="large" v-model="formItem.password" type="password" placeholder="新密码" style="width: 400px" />
                </FormItem>
                <FormItem label="确认密码" prop="passwordConfirm">
                    <Input size="large" v-model="formItem.passwordConfirm" type="password" placeholder="确认密码" style="width: 400px" />
                </FormItem>
                <FormItem>
                     <Button @click="changePasswd('formItem')" type="info" style="width: 400px;">确定</Button>
                </FormItem>
            </Form>

        </div>
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';
    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.formItem.passwordConfirm !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formItem.validateField('passwordConfirm');
                    }
                    callback();
                }
            };
            const validatePasswordConfirm = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入确认密码'));
                } else if (value !== this.formItem.password) {
                    callback(new Error('两次输入的密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                formItem: {
                    password: '',
                    passwordConfirm: '',
                },
                ruleValidate: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwordConfirm: [
                        { validator: validatePasswordConfirm, trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            changePasswd (name) {
                //TODO
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('resetPasswd', {
                            username: this.$store.state.user.username,
                            password: this.formItem.password
                        }).then((data) => {
                            if (data.code == 0) {
                                this.$router.push({
                                    path: '/overview',
                                });
                            } else {
                                this.$Message.error('修改失败，请稍后尝试');
                            }
                            
                        }, () => {
                            this.$Message.error('修改失败，请稍后尝试');
                        });
                    } else {
                        this.$Message.error('两次密码输入不合法，请重新输入');
                    }
                });
            },
        },
        components: {
            HeaderMenu,
        }
    }
</script>
<style scoped>
.main-content{
    width: 800px;
    margin: auto;
}
.tips{
    margin-bottom: 20px;
    border-bottom: 1px solid #333;
}
</style>
