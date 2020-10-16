/*!
 * @websanova/vue-upload v1.8.0
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

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

export default axios;
