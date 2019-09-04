import axios from 'axios';
import Vue from 'vue';
import iView from 'iview';
import mockData from '@/config/mock';
import urls from '@/config/urls';

if (false) {//use mock data
    const MockAdapter = require('axios-mock-adapter');
    var mock = new MockAdapter(axios);

    mockData.forEach((data) => {
        mock[`on${data.method}`](data.url).reply(200, data.response);
    });
}

axios.defaults.baseURL = '/auth-web';
axios.defaults.withCredentials=true;
Vue.axios = axios;

//axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.code != 0) {
        if (response.data.msg) {
            iView.Message.error(response.data.msg);
        } else {
            iView.Message.error('服务不可用');
        }
        return  Promise.reject('error');
    }
    return response;
  }, function (error) {
    // Do something with response error
    iView.Message.error('服务异常，请稍后尝试');
    console.log(error);
    return Promise.reject(error);
  });

Object.defineProperties(Vue.prototype, {

    axios: {
        get() {
            return axios
        }
    },

    $http: {
        get() {
            return axios
        }
    },
    $url: {
        get() {
            return urls;
        }
    }

});
export default axios;