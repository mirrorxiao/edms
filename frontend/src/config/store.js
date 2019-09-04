import Vue from 'vue';
import Vuex from 'vuex';

import app from '@/stores/app';

Vue.use(Vuex);

export default new Vuex.Store(app);
