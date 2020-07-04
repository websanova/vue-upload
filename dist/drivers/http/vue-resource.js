/*!
 * @websanova/vue-upload v1.6.0-beta
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueUpload = factory());
}(this, (function () { 'use strict';

    var vueResource = {
      post: function (data) {
        var request = {};
        this.Vue.http.post(data.url, data.body, {
          progress: data.progress,
          before: function (req) {
            request = req;
          }
        }).then(data.success, data.error);
        return request;
      }
    };

    return vueResource;

})));
