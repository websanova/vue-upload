import Vue from 'vue'

import upload          from '@websanova/vue-upload/src/index.js';
// import httpAxios       from '@websanova/vue-upload/drivers/http/axios.js';
import httpVueResource from '@websanova/vue-upload/drivers/http/vue-resource.js';

Vue.use(upload, {
    // http: httpAxios,
    http: httpVueResource
});