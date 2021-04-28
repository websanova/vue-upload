/*!
 * @websanova/vue-upload v2.1.4
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueUpload = factory());
}(this, (function () { 'use strict';

    var axios = {
      call: function (data) {
        var url = data.url,
            body = data.body,
            cancelTokenSource = this.plugins.http.CancelToken.source();
        delete data.url;
        delete data.body;
        this.plugins.http[data.method || 'post'](url, body, Object.assign({
          onUploadProgress: data.progress,
          cancelToken: cancelTokenSource.token
        }, data)).then(data.success, data.error);
        return {
          abort: function () {
            cancelTokenSource.cancel();
          }
        };
      }
    };

    return axios;

})));
