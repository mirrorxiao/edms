<template>
     <div class="tab-frame">
        <Tabs :value="activeTab" style="margin-left: 500px;"  @on-click="handleTabsClick" >
            <TabPane :label="item.name" :name="key" v-for="(item, key) in tabs" :key="key"></TabPane>
        </Tabs>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tabs: {
                real: {
                    name: '实时监控',
                    link: '/elevators/',
                }, 
                history: {
                    name: '历史记录',
                    link: '/history/',
                }, }
        }
    },
    computed: {
        activeTab () {
            const tabs = Object.keys(this.tabs).filter(tab => this.$route.path.indexOf(this.tabs[tab].link) >= 0);
            return tabs[0];
        }
    },
    methods: {
        handleTabsClick (name) {
            this.$router.push({
                path: `${this.tabs[name].link}${this.$route.params.id}`,
            });
        }
    }
}
</script>


<style scoped>
.tab-frame{
    position: relative;
}
.tab-frame:after{
    position: absolute;
    width: 100%;
    content: '';
    top: 35px;
    border-bottom: 1px solid #dcdee2;
}
</style>