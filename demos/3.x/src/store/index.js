// import Vue  from 'vue';
import {createStore} from 'vuex';

import upload from './upload.js';

// Vue.use(Vuex);

const debug = true; //process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        upload
    },
  
    strict: debug
});

export default store;