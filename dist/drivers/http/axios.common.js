/*!
 * @websanova/vue-upload v1.7.1
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

'use strict';

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

module.exports = axios;
