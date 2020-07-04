/*!
 * @websanova/vue-upload v1.5.0-beta
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
        var request = {}; // NOTE: Not a fan of axios, anyone who wants to contribute a
        //       solution that supports the following can be my guest.
        //
        //       - progress
        //       - success
        //       - error
        //       - abort
        //
        //       The request object should return an "abort()" method.

        return request;
      }
    };

    return axios;

})));
