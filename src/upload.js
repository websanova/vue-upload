module.exports = function () {

    var __upload = null;

    var __defaultOptions = {
        url: null,
        name: 'file',
        accept: null,
        body: {},
        dropzoneId: null,
        onSelect: null,
        onStart: null,
        onQueue: null,
        onProgress: null,
        onUpload: null,
        onError: null,
        onSuccess: null,
        onComplete: null,
        onEnd: null,
        startOnSelect: true,
        extensions: ['jpeg', 'jpg', 'png', 'gif'],
        multiple: false,
        maxFilesSelect: 4,
        maxFilesInProgress: 2,
        maxSizePerFile: 1024 * 1024 * 2, // MB
        maxFilesSelectMsg: 'Max of {max} files can be selected at a time.',
        maxFileSizeMsg: 'Max of {max} mb per file.',
        invalidExtensionMsg: 'File must be one of {extensions}.',
        // currentFiles: null,
        parseErrors: __parseErrors,
        http: __http
    };

    function __stop(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function __randomId() {
        return Math.random().toString(32).substring(2);
    }

    function __parseErrors(res) {
        if (res.data.errors) {
            return res.data.errors[0] || {};
        }

        if (res.data.msg) {
            return {code: res.data.code, msg: res.data.msg};
        }

        return {};
    }

    function __http(data) {
        __upload.Vue
            .http
            .post(data.url, data.body, {progress: data.progress})
            .then(data.success, data.error);
    }

    function _create(name) {
        if (__upload.instances[name]) {
            return;
        }

        __upload.Vue.set(__upload.$vm.instances, name, {
            files: {
                all: [],
                queue: [],
                progress: [],
                upload: [],
                success: [],
                error: []
            },

            errors: [],

            meta: {
                state: 'ready',

                percentComplete: 0
            },

            dropzone: {
                active: false
            }
        });

        __upload.instances[name] = {
            key: name,

            $vm: __upload.$vm.instances[name]
        };
    }

    function _reset() {
        var i, ii, vm,
            _this = this;

        for (i = 0, ii = this.$vm.files.all.length; i < ii; i++) {
            (function (i) {
                _clearFile.call(_this, _this.$vm.files.all[i]);
            })(i);
        }

        this.$vm.files = {
            all: [],
            queue: [],
            progress: [],
            upload: [],
            success: [],
            error: []
        };

        this.$vm.errors = [];

        this.$vm.meta.state = 'ready';

        this.$vm.meta.percentComplete = 0;

        this.$vm.dropzone.active = false;
    }

    function _init(name, $ctx, options) {
        var instance = __upload.instances[name];

        instance.options = Object.assign({}, __upload.options, options);

        instance.input = _initInput.call(instance);
        
        instance.dropzone = _initDropzone.call(instance);

        _bind.call(instance, $ctx);
    }

    function _bind($ctx) {
        this.onSelect = this.options.onSelect ? this.options.onSelect.bind($ctx) : function () {};
        this.onStart = this.options.onStart ? this.options.onStart.bind($ctx) : function () {};
        this.onQueue = this.options.onQueue ? this.options.onQueue.bind($ctx) : function () {};
        this.onProgress = this.options.onProgress ? this.options.onProgress.bind($ctx) : function () {};
        this.onUpload = this.options.onUpload ? this.options.onUpload.bind($ctx) : function () {};
        this.onError = this.options.onError ? this.options.onError.bind($ctx) : function () {};
        this.onSuccess = this.options.onSuccess ? this.options.onSuccess.bind($ctx) : function () {};
        this.onComplete = this.options.onComplete ? this.options.onComplete.bind($ctx) : function () {};
        this.onEnd = this.options.onEnd ? this.options.onEnd.bind($ctx) : function () {};
    }

    function _option(key, val) {
        this.options[key] = val;
        
        if (key === 'dropzone') {
            _destroyDropzone.call(this);

            this.dropzone = _initDropzone.call(this);

            return;
        }
    }

    function _destroy(name) {
        var instance = __upload.instances[name];

        _destroyInput.call(instance);

        _destroyDropzone.call(instance);

        delete instance.$vm;

        delete __upload.instances[name];
    }

    function _initInput() {
        var input,
            _this = this;

        input = document.createElement('input');

        input.type = 'file';

        input.multiple = this.options.multiple === true ? true : false;

        input.accept = this.options.accept ? this.options.accept : "*/*";

        input.style.display = 'none';
        
        input.onchange = function () {
            _select.call(_this, input.files);

            input.value = null;
        };

        document.body.appendChild(input);

        return {
            $el: input
        };
    }

    function _destroyInput() {
        this.input.$el.parentNode.removeChild(this.input.$el);

        this.input.$el = null;
    }

    function _initDropzone() {
        var dropzone,
            _this = this;
            
        dropzone = {
            $el: document.getElementById(this.options.dropzoneId),
            counter: 0,
            dragenter: null,
            drageover: null,
            dragleave: null,
            drop: null
        };

        if (dropzone.$el) {
            dropzone.dragenter = function(e) {
                __stop(e);
                
                _this.dropzone.counter++;
                
                _this.$vm.dropzone.active = true;
            };

            dropzone.dragover = function(e) {
                __stop(e);
                
                e.dataTransfer.dropEffect = 'copy'; 
                
                _this.$vm.dropzone.active = true;
            };

            dropzone.dragleave = function(e) {
                __stop(e);

                _this.dropzone.counter--;

                if (_this.dropzone.counter === 0) {
                    _this.$vm.dropzone.active = false;
                }
            };

            dropzone.drop = function(e) {
                __stop(e);

                _this.$vm.dropzone.active = false;

                _select.call(_this, e.dataTransfer.files);
            };

            dropzone.$el.addEventListener('dragenter', dropzone.dragenter, false);
            dropzone.$el.addEventListener('dragover', dropzone.dragover, false);
            dropzone.$el.addEventListener('dragleave', dropzone.dragleave, false);
            dropzone.$el.addEventListener('drop', dropzone.drop, false);
        }

        return dropzone;
    }

    function _destroyDropzone() {
        if (!this.dropzone.$el) {
            return;
        }

        this.dropzone.$el.removeEventListener('dragenter', this.dropzone.dragenter, false);
        this.dropzone.$el.removeEventListener('dragover', this.dropzone.dragover, false);
        this.dropzone.$el.removeEventListener('dragleave', this.dropzone.dragleave, false);
        this.dropzone.$el.removeEventListener('drop', this.dropzone.drop, false);

        this.dropzone.dragenter = null;
        this.dropzone.dragover = null;
        this.dropzone.dragleave = null;
        this.dropzone.drop = null;
        this.dropzone.$el = null;
    }

    function _addError(error) {
        var i, ii;

        error = error || {};

        if (error.unique) {
            for (i = 0, ii = this.$vm.errors.length; i < ii; i++) {
                if (this.$vm.errors[i].code === error.code) {
                    return;
                }
            }
        }

        error.$id = __randomId();
        error.file = error.file || null;
        error.clear = _clearError.bind(this, error);

        if (error.file) {
            error.file.errors.push(error);
            error.file.error = error;
        }

        this.$vm.errors.push(error);
    }

    function _clearError(error) {
        var i, ii;

        if (!error) {
            return;
        }

        for (i = 0, ii = this.$vm.errors.length; i < ii; i++) {
            if (this.$vm.errors[i].$id === error.$id) {
                this.$vm.errors.splice(i, 1);

                break;
            }
        }

    }

    function _clearFile(file) {
        var i, ii,
            index;

        if (!file) {
            return;
        }

        if (file.$request) {
            file.$request.abort();
        }

        // Clear errors from global stack.
        for (i = 0, ii = this.$vm.errors.length; i < ii; i++) {
            if (this.$vm.errors[i].file && this.$vm.errors[i].file.$id === file.$id) {
                this.$vm.errors.splice(i, 1);

                break;
            }
        }

        // Remove from current queue.
        index = _index.call(this, file);
        this.$vm.files[file.state].splice(index, 1);

        // Remove from all queue.
        index = _index.call(this, file, 'all');
        this.$vm.files.all.splice(index, 1);
    }

    function _getFilePreview(file, cb) {
        var reader  = new FileReader();

        reader.addEventListener('load', function () {
            file.$raw = reader.result;

            if (cb) { cb(file); }
        }, false);

        if (file.$file) {
            reader.readAsDataURL(file.$file);
        }
    }

    function _select(files) {
        var i, ii,
            error,
            _this = this;

        if (files.length > this.options.maxFilesSelect) {
            _addError.call(this, {
                unique: true,
                code: 'file-max-select',
                msg: this.options.maxFilesSelectMsg.replace('{max}', this.options.maxFilesSelect)
            });

            // NOTE: Not sure to trigger any hooks here.
            //       I think not since also depends on
            //       existing state if selecting more files.

            this.onSelect(files);

            // this.onStart();

            // this.onEnd();

            return;
        }

        for (i = 0, ii = files.length; i < ii; i++) {
            (function (i) {
                _queue.call(_this, files[i]);
            })(i);
        }

        this.onSelect(files);

        if (this.options.startOnSelect) {
            _process.call(this);
        }
    }

    function _queue(file) {
        var _this = this,
            type,
            name,
            extension;

        name = (file.name || '').split('.');
        type = (file.type || '').split('/');

        extension = name.length > 1 ? name[name.length - 1] : null;
        extension = extension ? extension : (type[1] || null);
        extension = (extension || '').toLowerCase();

        type = type[0] || null;

        file = {
            $id: __randomId(),
            $file: file,
            $request: null,
            $raw: null,
            $instance: this,
            name: file.name,
            size: file.size,
            type: type,
            extension: extension,
            state: 'queue',
            active: true, // to keep track of which files are in active download set which gets reset onEnd / complete.
            sending: false,
            errors: [],
            error: {},
            percentComplete: 0,
            preview: function (cb) { _getFilePreview(file, cb); }
        };

        file.clear = function () {
            _clearFile.call(_this, file);

            if (_this.$vm.meta.state === 'uploading') {
                _process.call(_this);
            }
        };

        this.$vm.files.all.push(file);
        this.$vm.files.queue.push(file);

        // Pre error check but don't update any sets yet.
        // Sometimes just need to know if queued item has an error.
        if (!_valid.call(this, file)) {
            this.onError(file);
        }

        this.onQueue(file);
    }

    function _index(file, queue) {
        var i, ii,
            index,
            files;

        files = this.$vm.files[queue || file.state];

        for (i = 0, ii = files.length; i < ii; i++) {
            if (file.$id === files[i].$id) {
                return i;
            }
        }

        return -1;
    }

    function _move(file, queue) {
        var index;

        index = _index.call(this, file);

        this.$vm.files[file.state].splice(index, 1);

        this.$vm.files[queue].push(file);

        file.state = queue;
    }

    function _valid(file) {
        var error;

        if (this.options.extensions && this.options.extensions.indexOf(file.extension) < 0) {
            error = {
                file: file,
                code: 'file-extension',
                msg: this.options.invalidExtensionMsg.replace('{extensions}', this.options.extensions.join(', '))
            };
        }

        else if (this.options.maxSizePerFile > 0 && file.size > this.options.maxSizePerFile) {
            error = {
                file: file,
                code: 'file-max-size',
                msg: this.options.maxFileSizeMsg.replace('{max}', Math.floor(this.options.maxSizePerFile / 1024 / 1024))
            };
        }

        if (error) {
            _addError.call(this, error);

            return false;
        }

        return true;
    }

    function _process() {
        var i, ii,
            file,
            valid;

        if (this.$vm.files.progress.length >= this.options.maxFilesInProgress) {
            return;
        }

        if (!this.$vm.files.queue.length) {
            if (!this.$vm.files.progress.length && this.$vm.meta.state === 'uploading') {
                this.$vm.meta.state = 'complete';

                // Reset all active to false.
                for (i = 0, ii = this.$vm.files.all.length; i < ii; i++) {
                    this.$vm.files.all[i].active = false;
                }
                
                this.onEnd();
            }

            return;
        }

        if (this.$vm.files.queue.length && (this.$vm.meta.state === 'ready' || this.$vm.meta.state === 'complete')) {
            this.onStart();
        }

        file = this.$vm.files.queue[0];

        // We will check error here again on process
        // to officially deal with an error file.
        if (!_valid.call(this, file)) {
            _move.call(this, file, 'error');
            
            this.onError(file);

            _process.call(this);

            return;
        }

        this.$vm.meta.state = 'uploading';
        
        _upload.call(this, file);

        _process.call(this);
    }

    function _upload(file) {
        var key,
            formData,
            request,
            _this = this;

        file.sending = true;

        _move.call(this, file, 'progress');

        formData = new FormData();
                
        formData.append(this.options.name, file.$file);
        
        for (key in file.$instance.options.body) {
            formData.append(key, file.$instance.options.body[key]);
        }

        request = this.options.http({
            url: file.$instance.options.url,
            body: formData,
            progress: function (e) {
                file.percentComplete = e.lengthComputable ? Math.ceil(e.loaded / e.total * 100) : 0;

                _this.onProgress(file, e);

                if (file.percentComplete >= 100) {
                    _move.call(_this, file, 'upload');

                    _this.onUpload(file, e);
                }

                _percent.call(_this);
            },

            success: function (res) {
                file.sending = false;
                
                _move.call(_this, file, 'success');

                _this.onSuccess(file, res);
                _this.onComplete(file, res);

                _process.call(_this);
            },

            error: function (res) {
                var error;

                file.sending = false;

                error = _this.options.parseErrors(res);
                error.file = file;

                _addError.call(_this, error);
                
                _move.call(_this, file, 'error');

                _this.onError(file, res);
                _this.onComplete(file, res);

                _process.call(_this);
            }
        });

        file.$request = request;
    }

    function _percent() {
        var i, ii,
            percentComplete,
            totalFilesActive;

        totalFilesActive = 0;
        
        for (i = 0, ii = this.$vm.files.all.length; i < ii; i++) {
            if (this.$vm.files.all[i].active) {
                totalFilesActive++;
            }
        }

        percentComplete = (totalFilesActive - this.$vm.files.queue.length - this.$vm.files.progress.length) * 100;
        
        for (i = 0, ii = this.$vm.files.progress.length; i < ii; i++) {
            percentComplete += this.$vm.files.progress[i].percentComplete;
        }

        this.$vm.meta.percentComplete = Math.ceil(percentComplete / (totalFilesActive * 100) * 100);
    }

    function Upload(Vue, options) {
        this.options = Object.assign({}, __defaultOptions, options);

        this.Vue = Vue;

        this.$vm = new Vue({
            data: function() {
                return {
                    instances: {}
                };
            }
        });

        this.instances = {};

        __upload = this;
    }

    Upload.prototype.on = function (name, options) {
        _create(name);

        _init(name, this, options);
    };

    Upload.prototype.off = function (name) {
        _destroy(name);
    };

    Upload.prototype.bind = function (name) {
        _bind.call(__upload.instances[name], this);
    };

    Upload.prototype.reset = function (name) {
        _create(name);

        _reset.call(__upload.instances[name]);
    };

    Upload.prototype.select = function (name) {
        __upload.instances[name].input.$el.click();
    };

    Upload.prototype.start = function (name) {
        _create(name);

        _process.call(__upload.instances[name]);
    }; 

    Upload.prototype.files = function (name) {
        _create(name);

        return __upload.instances[name].$vm.files;
    };

    Upload.prototype.file = function (name) {
        var vm;

        _create(name);

        vm = __upload.instances[name].$vm;

        return vm.files.all[vm.files.all.length - 1] || {error: {}};
    };

    Upload.prototype.exists = function (name) {
        return __upload.instances[name] ? true : false;
    }

    Upload.prototype.meta = function (name) {
        _create(name);

        return __upload.instances[name].$vm.meta;
    }

    Upload.prototype.percent = function (name) {
        _create(name);

        return __upload.instances[name].$vm.meta.percentComplete;
    }

    Upload.prototype.state = function (name) {
        _create(name);

        return __upload.instances[name].$vm.meta.state;
    }

    Upload.prototype.dropzone = function (name) {
        _create(name);

        return __upload.instances[name].$vm.dropzone;
    };

    Upload.prototype.option = function (name, key, val) {
        _create(name);

        _option.call(__upload.instances[name], key, val);

        _bind.call(__upload.instances[name], this);
    };

    Upload.prototype.errors = function (name) {
        _create(name);

        return __upload.instances[name].$vm.errors;
    };

    return Upload;
}
