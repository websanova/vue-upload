/*!
 * @websanova/vue-upload v1.7.3
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

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

export default axios;
