var Upload = require('./upload.js')();

function plugin(Vue, options) {
    var upload = new Upload(Vue, options);

    var _on = upload.on;
    var _bind = upload.bind;
    var _option = upload.option;

    Vue.upload = upload;

    Object.defineProperties(Vue.prototype, {
        $upload: {
            get: function () {
                upload.on = _on.bind(this);
                upload.bind = _bind.bind(this);
                upload.option = _option.bind(this);

                return upload;
            }
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin;