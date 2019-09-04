import axios from '../config/http';
import urls from '@/config/urls';
import provinceData from '@/libs/provinceData';
import Cookies from 'js-cookie';

let loginUser = Cookies.get('loginUser');
try {
    loginUser = JSON.parse(loginUser) || {};
} catch(e) {
    loginUser = {};
}


const state = {
    user: loginUser,
    role: loginUser.role || '',
    passwdResetted: !!loginUser.passwdResetted,
    elevators: [],
    isFullScreen: false,//是否全屏
};

const getters = {
    provinceData: state => {
        const province = state.user.province;
        const city = state.user.city;
        const area = state.user.area;

        let data = provinceData.children.filter(d => {
            if (!province || province === '中国') {
                return true;
            }
            return province.includes(d.label);
        }).map(d => {
            const cities = (d.children || []).filter(c => {
                if (!city) {
                    return true;
                }
                return city.includes(c.label);
            }).map(c => {
                const areas = (c.children || []).filter(a => {
                    if (!area) {
                        return true;
                    }
                    return area.includes(a.label);
                }).map(a => {
                    return {
                        selectable: !area,
                        value: a.label,
                        label: a.label,
                        parent_code: a.parent_code,
                    }
                });
                return {
                    selectable: !area && !city,
                    value: c.label,
                    label: c.label,
                    parent_code: c.parent_code,
                    children: areas,
                }
            });

            return {
                selectable: (!province || province === '中国') && !city,
                value: d.label,
                label: d.label,
                parent_code: d.parent_code,
                children: cities,
            }
        });
        return data;
    }, 
    userProvinceData: state => {
        const province = state.user.province;
        const city = state.user.city;
        const area = state.user.area;

        let _provinceData;
        let _cityData;
        let _areaData;

        let data = _provinceData = provinceData.children.filter(d => {
            if (!province || province === '中国') {
                return true;
            }
            return province.includes(d.label);
        }).map(d => {
            const cities = _cityData = (d.children || []).filter(c => {
                if (!city) {
                    return true;
                }
                return city.includes(c.label);
            }).map(c => {
                const areas = _areaData = (c.children || []).filter(a => {
                    if (!area) {
                        return true;
                    }
                    return area.includes(a.label);
                }).map(a => {
                    return {
                        selectable: !area,
                        value: a.label,
                        label: a.label,
                        parent_code: a.parent_code,
                    }
                });
                return {
                    selectable: !area && !city,
                    value: c.label,
                    label: c.label,
                    parent_code: c.parent_code,
                    children: areas,
                }
            });

            return {
                selectable: (!province || province === '中国') && !city,
                value: d.label,
                label: d.label,
                parent_code: d.parent_code,
                children: cities,
            }
        });
        
        if (area || city) {
            return _areaData;
        } else if (province && province !== '中国') {
            return _cityData;
        } else {
            return data;
        }
        return data;
    }
};

const mutations = {
    setUser (state, user) {
        state.user = user;
        state.passwdResetted = user.passwdResetted;
        state.role = user.role;
    },
    resetPasswd (state, flag) {
        (state.user || []).passwdResetted = flag;
        state.passwdResetted = flag;
        Cookies.set('loginUser', JSON.stringify(state.user));
    },
    setScreenSize (state, flag) {
        state.isFullScreen = flag;
    },
    fullScreen (state) {
        state.isFullScreen = true;        
    },
    shrink (state) {
        state.isFullScreen = false;
    }
};

const actions = {
    resetPasswd ({commit, state}, {username, password}) {
        return axios.post(urls.RESET_PASSWORD, {
            userName: username,
            passWord: password,
        }).then((response) => {
            commit('resetPasswd', true);
            return response.data;
        });
    },
    initWebsocket ({commit, state}, {}) {
        const wsuri = '';
        let websock = state.websock = new WebSocket(wsuri);
        ws.onopen = function () {
        // 使用 send() 方法发送数据
        ws.send("发送数据");
            alert("数据发送中...");
        };
        
        // 接收服务端数据时触发事件
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            alert("数据已接收...");
        };
        
        // 断开 web socket 连接成功触发事件
        ws.onclose = function () {
            alert("连接已关闭...");
        };
    },
};


export default {
    state,
    getters,
    mutations,
    actions,
};