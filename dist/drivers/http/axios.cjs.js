/*!
 * @websanova/vue-upload v1.8.0
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

'use strict';

var axios = {
  post: function (data) {
    var cancelTokenSource = this.ctx.axios.CancelToken.source();
    this.ctx.axios.post(data.url, data.body, {
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

module.exports = axios;
