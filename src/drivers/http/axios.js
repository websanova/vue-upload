export default {
    call: function(data) {
        var url = data.url,
            body = data.body,
            cancelTokenSource = this.plugins.http.CancelToken.source();

        delete data.url;
        delete data.body;
        
        this.plugins
            .http[data.method || 'post'](url, body, Object.assign({
                onUploadProgress: data.progress,
                cancelToken: cancelTokenSource.token,
            }, data))
            .then(data.success, data.error);

        return {
            abort: function () {
                cancelTokenSource.cancel();
            }
        };
    }
}