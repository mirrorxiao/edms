<style scoped>
    @import 'styles/common.css';
    .main-body{
        height: 100%;
    }
</style>
<template>
    <div class="main-body">

        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        computed: {
            islogin () {
                return true;
            }
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        },
        components: {
        }
    }
</script>
