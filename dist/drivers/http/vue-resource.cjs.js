/*!
 * @websanova/vue-upload v2.4.0
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

'use strict';

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

module.exports = vueResource;
