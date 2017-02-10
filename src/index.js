var Upload = require('./upload.js')();

module.exports = (function () {

    return function install(Vue, options) {
        var upload = new Upload(Vue, options),
            _new = upload.new,
            _reset = upload.reset;

        Object.defineProperties(Vue.prototype, {
            $upload: {
                get: function () {
                    upload.new = _new.bind(this);
                    upload.reset = _reset.bind(this);

                    return upload;
                }
            }
        });
    }
})();