import {inject  } from 'vue';
import {reactive} from 'vue';
import Upload     from './upload.js';

const uploadKey = 'upload';

// NOTE: Create pseudo Vue object for Vue 2 backwards compatibility.

function Vue (obj) {
    var data = obj.data();

    this.state = reactive(data.state);
}

Vue.set = function (obj, name, val) {
    obj[name] = reactive(val);
}

Upload.prototype.install = function (app, key) {
    this.Vue = Vue;

    app.provide(key || uploadKey, this);

    app.config.globalProperties.$upload = this;
}

//

export function createUpload(options) {
    return new Upload(Vue, options);
}

export function useUpload(key) {
    return inject(key ? key : uploadKey);
}