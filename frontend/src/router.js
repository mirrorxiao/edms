import store from './config/store';
const home = (resolve) => require(['./views/index.vue'], resolve);
const login = (resolve) => require(['./views/login.vue'], resolve);
const elevators= (resolve) => require(['./views/elevators2.vue'], resolve);
const elevatordetail = (resolve) => require(['./views/elevatordetail.vue'], resolve);
const elevatorhistory = (resolve) => require(['./views/elevatorhistory.vue'], resolve);
const overview = (resolve) => require(['./views/overview.vue'], resolve);
const devs = (resolve) => require(['./views/devs.vue'], resolve);
const users = (resolve) => require(['./views/users.vue'], resolve);
const incidents = (resolve) => require(['./views/incidents.vue'], resolve);
const resetpasswd = (resolve) => require(['./views/resetpasswd.vue'], resolve);
const report = (resolve) => require(['./views/report.vue'], resolve);
const info = (resolve) => require(['./views/info.vue'], resolve);

const routers = [
    { path: '*', redirect: '/' },
    {
        path: '/',
        component: login,
        beforeEnter: (to, from, next) => {
            if (store.state.user.username) {
                next({ path: '/elevators' });
            } else {
                next();
            }
        },
    },
    {
        path: '/overview',
        component: overview,
    }, {
        path: '/elevators',
        component: elevators,
    }, {
      path: '/elevators/:id',
      component: elevatordetail,
    }, {
        path: '/history/:id',
        component: elevatorhistory,
    }, {
        path: '/incidents',
        component: incidents,
    }, {
        path: '/devs',
        component: devs,
    }, {
        path: '/users',
        component: users,
    }, {
        path: '/resetPasswd',
        component: resetpasswd,
    }, {
        path: '/report',
        component: report,
    }, {
        path: '/info',
        component: info,
    },
];
export default routers;