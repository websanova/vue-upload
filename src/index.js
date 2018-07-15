var Upload = require('./upload.js')();

module.exports = (function () {
    return function install(Vue, options) {
        var upload, _on, _off;

        upload = new Upload(Vue, options),

        _on = upload.on;
        _bind = upload.bind;

        Object.defineProperties(Vue.prototype, {
            $upload: {
                get: function () {
                    upload.on = _on.bind(this);
                    upload.bind = _bind.bind(this);

                    return upload;
                }
            }
        });
    }
})();