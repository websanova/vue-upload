import {createApp} from 'vue';
import Upload      from './upload.js';

// Install for Vue 3
Upload.prototype.install = function (app) {
    app.plugin = this;

    app.config.globalProperties.$plugin = this;
}

// Install for Vue 2
function install(Vue, options) {
    var upload = new Upload(options, Vue);

    Vue.upload = upload;
    Vue.$upload = upload;

    // var _on = upload.on;
    // var _bind = upload.bind;
    // var _option = upload.option;

    // Vue.upload = upload;

    // Object.defineProperties(Vue.prototype, {
    //     $upload: {
    //         get: function () {
    //             upload.on = _on.bind(this);
    //             upload.bind = _bind.bind(this);
    //             upload.option = _option.bind(this);

    //             return upload;
    //         }
    //     }
    // });
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

export function createPlugin(options) {
    console.log(options);

    var Vue = function (data) {

        // TODO: Reactive instance here...


        var instance = createApp(data);

        console.log(instance.instances);

        // this.instances = ref(//reactive instances here).

    }


    // this.$vm = new Vue({
    //     data: function() {
    //         return {
    //             instances: {}
    //         };
    //     }
    // });

    return new Upload(Vue, options);
}

export default install;