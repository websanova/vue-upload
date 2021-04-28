/*!
 * @websanova/vue-upload v2.1.4
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

'use strict';

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

module.exports = axios;
