export default {
    post: function(data) {
        var cancelTokenSource = this.plugins.http.CancelToken.source();
        
        this.plugins
            .http
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