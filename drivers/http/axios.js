export default {
    post: function(data) {
        var cancelTokenSource = this.Vue.axios.CancelToken.source();
        
        this.Vue
            .axios
            .post(data.url, data.body, {
                onUploadProgress: data.progress,
                cancelToken: cancelTokenSource.token,
            })
            .then(data.success, data.error);

        return {
            abort: function () {
                cancelTokenSource.cancel();
            }
        };
    }
}