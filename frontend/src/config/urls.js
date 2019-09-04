export default {
    CODE: '/setuser/validate',
    LOGIN: '/setuser/login',
    LOGOUT: '/logout',
    RESET_PASSWORD: '/setuser/changePD',
    USERLIST: '/setuser/selectUser',
    RESET_USER_PASSWD: '/setuser/reSetPD',
    MODIFY_USER: '/setuser/updateUser',
    CREATE_USER: '/setuser/createUser',
    DELETE_USER: '/setuser/delete',

    //overview
    ONLINE_NUM: '/device/queryElvOnlineStateNum',
    STATUS_NUM: '/device/queryElvNormalStateNum',
    
    //devs
    DEVLIST: '/device/deviceList',
    DEV_BIND: '/device/bind',
    DEV_UNBIND: '/device/unbind',

    //elevators
    ELEVATOR_DETAIL: '/elevatorInfo/queryElevatorInfo',
    ELEVATORLIST: '/elevatorInfo/queryElevatorList',
    ELEVATORHISTORY: '/history',

    //incidents
    INCIDENTLIST: '/eventInfo/queryEventList',
    CLOSE_INCIDENT: '/eventInfo/closeEvent',

    //report
    REPORT_BRAND_DATA: '/report/brandRatio',
    REPORT_STATUS_DATA: '/report/elvStatusRatioByArea',
    REPORT_BAD_DATA: 'report/elvFaultRatioByMonth',

    ws_base: 'wss://edms.gd95009.com/auth-web',

    ws_elevator_detail: '/event',
    ws_elevator_map: '/info',

    IMPORT_DATA: '/elevatorInfo/addelevatorbycode',

};