import {reactive} from 'vue';
import Upload     from './upload.js';

Upload.prototype.install = function (app) {
    app.upload = this;

    app.config.globalProperties.$upload = this;
}

function Vue (data) {
    this.instances = reactive({});
}

Vue.set = function (obj, name, val) {
    obj[name] = reactive(val);
}

export function createPlugin(options) {
    return new Upload(Vue, options);
}