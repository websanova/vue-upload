var Upload = require('./upload.js')();

export default function install(Vue, options) {
    var upload = new Upload(Vue, options);

    var _on = upload.on;
    var _bind = upload.bind;

    Object.defineProperties(Vue.prototype, {
        $upload: {
            get: function () {
                upload.on = _on.bind(this);
                upload.bind = _bind.bind(this);

                return upload;
            }
        }
    });
};