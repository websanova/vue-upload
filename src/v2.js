import Upload from './upload.js';

function plugin(Vue, options) {
    Vue.upload = new Upload(Vue, options);

    Vue.upload.Vue = Vue;
    Vue.upload.ctx = Vue;

    Object.defineProperties(Vue.prototype, {
        $upload: {
            get: function () {
                return Vue.upload;
            }
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;