import 'babel-polyfill'
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import store from './config/store'
import Util from './libs/util';
import App from './app.vue';
import filters from './config/filters';
import 'iview/dist/styles/iview.css';
import './styles/common.css';
import './config/http';

Vue.use(VueRouter);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    store.commit('setScreenSize', false);//取消全屏
    //TODO 判断是否第一次登陆
    //no permission
    if (!store.state.user.username && to.path !== '/') {
        return next({path: '/'});
    }
    else if (!store.state.passwdResetted && to.path !== '/resetPasswd' && to.path !== '/') {
        return next({path: '/resetPasswd'});
    }
    iView.LoadingBar.start();
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});