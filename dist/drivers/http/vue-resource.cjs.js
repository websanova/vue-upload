/*!
 * @websanova/vue-upload v1.8.0
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

'use strict';

var vueResource = {
  post: function (data) {
    var request = {};
    this.ctx.http.post(data.url, data.body, {
      progress: data.progress,
      before: function (req) {
        request = req;
      }
    }).then(data.success, data.error);
    return request;
  }
};

module.exports = vueResource;
