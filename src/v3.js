import {reactive} from 'vue';
import Upload     from './upload.js';

// NOTE: Create pseudo Vue object for Vue 2 backwards compatibility.

function Vue (obj) {
    var i,
        data = obj.data();

    for (i in data) {
        this[i] = reactive(Object.assign({}, data[i]));
    }
}

Vue.set = function (obj, name, val) {
    obj[name] = reactive(val);
}

Upload.prototype.install = function (app) {
    this.Vue = Vue;
    this.ctx = app;

    app.upload = this;

    app.config.globalProperties.$upload = this;
}

//

export function createPlugin(options) {
    return new Upload(Vue, options);
}