export default {
    post: function(data) {
        var request = {};

        this.ctx
            .http
            .post(data.url, data.body, {
                progress: data.progress,
                before: function(req) {
                    request = req;
                }
            })
            .then(data.success, data.error);

        return request;
    }
}