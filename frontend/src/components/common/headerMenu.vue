<template>
    <div class="layout">
        <Layout>
            <Header v-show="!isFullScreen">
                <Menu mode="horizontal" theme="dark" :active-name="activeMenu"  @on-select="handleItemSelected">
                    <div class="layout-logo">
                        <img src="../../images/u96.png" alt="" width="40px" height="40px">
                        <span>电梯动态监测系统</span>

                        <span class="location">（{{location || '全国'}}）</span>
                    </div>
                    <div class="layout-nav">
                        <MenuItem 
                        :name="item.link" 
                        :key="index"
                        v-for="(item, index) in menus">
                            {{item.name}}
                        </MenuItem>
                    </div>

                    <div style="float:right;">
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-contact" :size="28"/>
                                {{this.user.username}}
                            </template>
                            <MenuItem name="userInfo">
                                用户信息
                            </MenuItem>
                        </Submenu>
                        <div style="float:left;">|</div>
                        <MenuItem name="logout">
                            <Icon type="md-power" :size="22"></Icon>
                            退出
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Content>
                <slot></slot>
            </Content>
        </Layout>
    </div>
</template>
<script>
    import permission from '../../config/permission';
    import Cookies from 'js-cookie';

    export default {
        data () {
            return {
                user: {
                    username: '',
                },
            }
        },
        mounted () {
            this.user = this.$store.state.user;
        },
        computed: {
            activeMenu() {
                return this.$route.path;
            },
            location () {
                const location = [];
                const city = this.$store.state.user.city;
                const area = this.$store.state.user.area;
                const province = this.$store.state.user.province;
                if (province) {
                    location.push(province);
                }
                if (city) {
                    location.push(city);
                }
                if (area) {
                    location.push(area);
                }

                if (location.length === 3) {
                    location.splice(0, 1);
                }
                return location.join('');
            },
            menus () {
                const role = this.$store.state.role; 
                const pages = permission.pages.filter(page => {
                    if (!!page.r.find(r => r === role) ) {
                        page.permission = 'r';
                        return page.ismenu;
                    } else if (!!page.w.find(r => r === role) ) {
                        page.permission = 'w';
                        return page.ismenu;
                    } else {
                        page.permission = null;
                        return false;
                    }
                    return false;
                });
                return pages;
            },
            isFullScreen () {
                return this.$store.state.isFullScreen;
            }
        },
        methods: {
            handleItemSelected(name) {
                if (name === 'logout') {
                    return this.logout();
                } else if (name === 'userInfo') {
                    return this.$router.push({
                        path: '/info'
                    });
                }
                this.$router.push({
                    path: name,
                });
            },
            logout () {
                this.user = {};
                this.$store.commit('setUser', {});
                // localStorage.removeItem('loginUser');
                Cookies.remove('loginUser');
                this.$router.push({
                    path: '/',
                });
            }
        },
    }
</script>
<style scoped>
.layout{
    height: 100%;
    border: 1px solid #d7dde4;
    background: #fff;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    min-width: 1200px;
}
.layout-logo{
    float: left;
    position: relative;
    left: 20px;
}
.layout-logo img{
    top:12px;
    position: absolute;
}
.layout-logo span{
    margin-left: 60px;
    font-family: '微软雅黑 Regular', '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    color: white;
}

.layout-logo .location{
    margin-left: 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 60px;
    margin-right: 40px;
}
.layout-nav{
    width: 1000px; 
    margin: 0 auto;
    margin-left: 300px;
}
.layout-footer-center{
    text-align: center;
}
</style>
