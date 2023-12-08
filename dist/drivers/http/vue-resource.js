/*!
 * @websanova/vue-upload v2.2.1
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueUpload = factory());
}(this, (function () { 'use strict';

    var vueResource = {
      call: function (data) {
        var request = {};
        this.plugins.http(Object.assign({
          url: data.url,
          method: data.method || 'post',
          body: data.body,
          params: data.method === 'get' ? data.body : null,
          progress: data.progress,
          before: function (req) {
            request = req;
          }
        }, data)).then(data.success, data.error);
        return request;
      }
    };

    return vueResource;

})));
