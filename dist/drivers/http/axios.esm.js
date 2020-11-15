/*!
 * @websanova/vue-upload v2.0.1
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

var axios = {
  post: function (data) {
    var cancelTokenSource = this.plugins.http.CancelToken.source();
    this.plugins.http.post(data.url, data.body, {
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

export default axios;
