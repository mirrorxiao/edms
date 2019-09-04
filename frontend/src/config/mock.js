import urls from './urls';
import data from './data';

export default [
    {
        method: 'Get',
        url: urls.INCIDENTLIST,
        response: {
            code: 0,
            total: 100,
            data: data.eventlist
        },
    },
    {
        method: 'Post',
        url: urls.LOGIN,
        response: {
            code: 0,
            msg: '',
            sys_role_name: '管理员',
            pdstatus: 1,
            userName: '冬瓜',
            province: '全国',
            city: null,
            area: null,
        }
    },
    {
        method: 'Get',
        url: urls.ELEVATORLIST,
        response: {
            code: 0,
            total: 100,
            data: data.elevatorlist,
        }
    },
    {
        method: 'Get',
        url: urls.DEVLIST,
        response: {
            code: 0,
            total: 100,
            data: data.devlist,
        }
    },
    {
        method: 'Get',
        url: urls.GET_USERS,
        response: {
            code: 0,
            total: 100,
            data: data.userlist,
        }
    },
    {
        method: 'Any',
        response: {code: 0, message: 'xx'},
    },
];