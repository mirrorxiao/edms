<template>
    <HeaderMenu>
        <div class="main-content">
        <Breadcrumb>
            <BreadcrumbItem to="/">个人信息</BreadcrumbItem>
        </Breadcrumb>

        <div style="width: 400px;margin-top: 20px;">
            <div>
                <p>
                    <div class="info-lable">用户名：</div>
                    <span>{{username}}</span>
                </p>
                <p>
                    <div class="info-lable">角色：</div>
                    <span>{{role}}</span>
                </p>
            </div>
        </div>
        </div>
        
    </HeaderMenu>
</template>
<script>
    import HeaderMenu from '../components/common/headerMenu.vue';

    export default {
        components: {
            HeaderMenu,
        },
        computed: {
            username () {
                return this.$store.state.user.username;
            },
            role () {
                return this.$store.state.role;
            },
            mobile () {
                return this.$store.state.mobile;
            },
        }
    }
</script>
<style scoped>
.info-lable{
    width: 70px;
    float: left;
}
</style>
