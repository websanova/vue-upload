function Plugin(data) {
    console.log('plugin instance...')
    console.log(data);
}

Plugin.prototype.func = function () {
    console.log('func call');
}

Plugin.prototype.install = function (app) {
    app.plugin = this;

    app.config.globalProperties.$plugin = this;
}

export function createPlugin(data) {
    return new Plugin(data);
}