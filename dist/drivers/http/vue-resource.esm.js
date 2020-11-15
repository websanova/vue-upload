/*!
 * @websanova/vue-upload v2.0.1
 * https://websanova.com/docs/vue-upload
 * Released under the MIT License.
 */

var vueResource = {
  post: function (data) {
    var request = {};
    this.plugins.http.post(data.url, data.body, {
      progress: data.progress,
      before: function (req) {
        request = req;
      }
    }).then(data.success, data.error);
    return request;
  }
};

export default vueResource;
