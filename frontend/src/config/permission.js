const admin = 'admin';
const region_admin = 'region_admin';
const quality_officer = 'quality_officer';
const monitor_seat = 'monitor_seat';
const installer = 'installer';
const operator = 'operator';

const roles = {
    //角色
    admin : '超级管理员',
    region_admin : '管理员',
    quality_officer : '质监局',
    monitor_seat : '坐席',
    installer : '安装人员',
    operator : '安保人员',
}

const pages = [{
    name: '电梯总览',
    link: '/overview',
    ismenu: true,
    w: [admin, region_admin, monitor_seat,],
    r: [quality_officer]
}, {
    name: '电梯管理',
    link: '/elevators',
    ismenu: true,
    w: [admin, region_admin, monitor_seat,],
    r: [quality_officer]
}, {
    name: '事件管理',
    link: '/incidents',
    ismenu: true,
    w: [admin, region_admin, monitor_seat,],
    r: [quality_officer]
}, {
    name: '设备管理',
    link: '/devs',
    ismenu: true,
    w: [admin, region_admin,],
    r: [quality_officer]
},{
    name: '用户管理',
    link: '/users',
    ismenu: true,
    w: [admin, region_admin,],
    r: []
},{
    name: '报表',
    link: '/report',
    ismenu: true,
    w: [admin, region_admin, monitor_seat,],
    r: [quality_officer]
}, ];

export default {
    roles: roles,
    pages: pages,
};