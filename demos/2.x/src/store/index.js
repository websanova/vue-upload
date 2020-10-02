import Vue  from 'vue';
import Vuex from 'vuex';

import upload from './upload.js';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        upload
    },
  
    strict: debug
});