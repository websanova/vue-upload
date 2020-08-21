/*!
 * @websanova/vue-upload v1.7.0
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueUpload = factory());
}(this, (function () { 'use strict';

    var axios = {
      post: function (data) {
        var cancelTokenSource = this.Vue.axios.CancelToken.source();
        this.Vue.axios.post(data.url, data.body, {
          onUploadProgress: data.progress,
          cancelToken: cancelTokenSource.token
        }).then(data.success, data.error);
        return {
          abort: function () {
            cancelTokenSource.cancel();
          }
        };
      }
    };

    return axios;

})));
