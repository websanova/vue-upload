module.exports = function () {
    
    function _toCamelCase(val) {
        return val.replace(/^([A-Z])|[\s-_\:](\w)/g, function(match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            
            return p1.toLowerCase();
        });
    }

    function _parseErrors(res) {
        if (res.data.errors) {
            return res.data.errors;
        }

        if (res.data.msg) {
            return [{rule: 'fileError', message: res.data.msg}];
        }

        return [];
    }

    function _http(data) {
        this.Vue.http.post(data.url, data.body, {progress: data.progress}).then(data.success, data.error);
    }

    function _calculatePercentComplete(name) {
        var i, ii,
            uploader = this.watch.uploaders[name],
            totalFiles = uploader.meta.totalFiles,
            percentComplete = (totalFiles - uploader.files.queued.length - uploader.files.progress.length) * 100;

        // NOTE: totalFiles represents the current running batch.
        //       So if more files are added while files are still in progress
        //       it will ++. Otherwise it will be a a fresh count.
        //       
        //       Assume any files not in progress or queue are already complete.
        
        for (i = 0, ii = uploader.files.progress.length; i < ii; i++) {
            percentComplete += uploader.files.progress[i].percentComplete;
        }

        uploader.meta.percentComplete = Math.ceil(percentComplete / (totalFiles * 100) * 100);
    }

    function _onFileInputChange(name) {
        var files = document.getElementById('websanova-upload-' + name).files;
        
        _processFiles.call(this, name, files);
        
        document.getElementById('websanova-upload-' + name).value = null;
    }

    function _processFiles(name, files) {
        var i, ii,
            _this = this,
            file,
            _files = [],
            uploader = this.watch.uploaders[name],
            queueFiles = [];

        if ( ! files.length) {
            return; 
        }

        // First let's generate the files.
        for (i = 0, ii = files.length; i < ii; i++) {
            _files.push({
                $file: files[i],
                url: uploader.options.url,
                body: Object.assign({}, uploader.options.body),
                name: files[i].name,
                size: files[i].size,
                type: files[i].type,
                status: 'ready',
                errors: [],
                percentComplete: 0,
                preview: null
            });
        }

        // Run top level validation.
        if (uploader.options.multiple && ! _validateMultipleFiles.call(this, name, _files)) {

            // If error, still fire off the onSelect.
            if (uploader.options.onSelect) {
                uploader.options.onSelect.call(uploader.ctx);
            }

            // If error, still fire off the onEnd.
            if (uploader.options.onEnd) {
                uploader.options.onEnd.call(uploader.ctx);
            }

            return;
        }

        // Prep file queue.
        for (i = 0, ii = _files.length; i < ii; i++) {
            (function (i) {
                if (uploader.options.multiple) {
                    uploader.files.all.push(_files[i]);
                }
                else {
                    uploader.files.all = [_files[i]];
                    uploader.files.success = [];
                    uploader.files.uploaded = [];
                    uploader.files.error = [];
                    uploader.files.complete = [];
                }

                uploader.meta.totalFiles++;
                
                // Make sure we are pushing the watched file.
                file = uploader.files.all[uploader.files.all.length - 1];

                file.preview = (function (file) { return function (cb) { _getFilePreview(file, cb); }; })(file);

                queueFiles.push(file);
            })(i);
        }

        // Reset percentComplete if fresh batch.
        if (uploader.meta.status === 'complete') {
            uploader.meta.percentComplete = 0;
        }

        // Fire off files to queue.
        for (i = 0, ii = queueFiles.length; i < ii; i++) {
            (function (file) { _queueFile.call(_this, name, file); })(queueFiles[i]);
        }

        // If not errors fire off onSelect all the way here.
        if (uploader.options.onSelect) {
            uploader.options.onSelect.call(uploader.ctx, queueFiles);
        }

        // If on select fire off right away.
        if (uploader.options.startOnSelect) {
            _processQueue.call(this, name);
        }
    }

    function _validateMultipleFiles(name, files) {
        var errors = [],
            options = this.watch.uploaders[name].options,
            maxFilesAllowed = options.maxFiles - (options.currentFiles || 0);

        // Check for max files selected
        if (options.currentFiles !== null && options.currentFiles >= options.maxFiles) {
            errors.push({
                rule: 'maxfilesreached',
                message: 'Maximum of ' + options.maxFiles + ' files reached.'
            });
        }
        else if (files.length > maxFilesAllowed) {
            errors.push({
                rule: 'maxfilesexceeded',
                message: 'Maximum of ' + maxFilesAllowed + ' files exceeded.'
            });
        }

        if (errors.length) {
            this.watch.uploaders[name].meta.status = 'error';
        }

        this.watch.uploaders[name].errors = errors;

        return !errors.length;
    }

    function _validateFile(name, file) {
        var options = this.watch.uploaders[name].options,
            errors = [];

        // Check extensions.
        if (options.extensions && options.extensions.indexOf( file.name.split('.').pop().toLowerCase() ) < 0) {
            errors.push({
                rule: 'extension',
                message: 'File must be of type: ' + options.extensions.join(', ') + '.'
            });
        }

        // Check max size.
        if ( (file.size / 1024) > options.maxSizePerFile) {
            errors.push({
                rule: 'size',
                message: 'File is over the ' + options.maxSizePerFile + 'kb limit.'
            });
        }

        // Send error.
        if (errors.length) {
            file.status = 'error';
            file.errors = errors;

            if (this.watch.uploaders[name].options.onError) {
                this.watch.uploaders[name].options.onError.call(this.watch.uploaders[name].ctx, null, file);
            }
        }

        if (errors.length) {
            this.watch.uploaders[name].errors.push({
                rule: 'fileError',
                message: 'Some of the files could not be uploaded due to errors.'
            });
        }

        return !file.errors.length;
    }

    function _getFilePreview(file, cb) {
        var reader  = new FileReader();

        reader.addEventListener('load', function () {
            file.raw = reader.result;

            if (cb) { cb(file); }
        }, false);

        if (file.$file) {
            reader.readAsDataURL(file.$file);
        }
    }

    function _queueFile(name, file) {
        var uploader = this.watch.uploaders[name];

        _validateFile.call(this, name, file);

        if (file.status === 'error') {
            uploader.files.error.push(file);
            uploader.files.complete.push(file);
            
            return;
        }

        uploader.files.queued.push(file);

        if (uploader.options.onQueue) {
            uploader.options.onQueue.call(uploader.ctx, file);
        }
    }

    function _processQueue(name) {
        var uploader = this.watch.uploaders[name],
            maxFilesInProgress = uploader.options.async ? uploader.options.maxFilesInProgress : 1;

        if (uploader.meta.status !== 'sending' && uploader.options.onStart) {
            uploader.options.onStart.call(uploader.ctx);
        }

        while (uploader.files.queued.length && uploader.files.progress.length < maxFilesInProgress) {
            _startFileUpload.call(this, name, uploader.files.queued[0]);

            uploader.files.progress.push(uploader.files.queued[0]);
            uploader.files.queued.splice(0, 1);

            if (uploader.options.onProgress) {
                uploader.options.onProgress.call(uploader.ctx, uploader.files.progress[uploader.files.progress.length - 1]);
            }
        }
    }

    function _startFileUpload(name, file) {
        var i,
            key,
            _this = this,
            uploader = this.watch.uploaders[name],
            fileUploadFormData;

        fileUploadFormData = new FormData();
                
        fileUploadFormData.append(uploader.options.name, file.$file);
        
        for (key in file.body) {
            fileUploadFormData.append(key, file.body[key]);
        }

        file.status = 'sending';
        uploader.meta.status = 'sending';

        uploader.options.http.call(this, {
            url: file.url,
            body: fileUploadFormData,
            progress: function (e) {
                if (e.lengthComputable) {
                    file.percentComplete = Math.ceil(e.loaded / e.total * 100);
                }

                if (file.percentComplete >= 100) {
                    if (uploader.options.multiple) {
                        uploader.files.uploaded.push(file);
                    }
                    else {
                        uploader.files.uploaded = [file];
                    }

                    if (uploader.options.onUpload) {
                        uploader.options.onUpload.call(uploader.ctx, file);
                    }
                }

                _calculatePercentComplete.call(_this, name);
            },
            success: function (res) {
                file.status = 'success';
            
                if (uploader.options.multiple) {
                    uploader.files.success.push(file);

                    if (uploader.options.currentFiles !== null) {
                        uploader.options.currentFiles++;
                    }
                }
                else {
                    uploader.files.success = [file];
                }
                
                _completeFileUpload.call(_this, name, file);
                    
                if (uploader.options.onSuccess) {
                    uploader.options.onSuccess.call(uploader.ctx, res, file);
                }
            },
            error: function (res) {
                file.status = 'error';

                if (uploader.options.multiple) {
                    uploader.files.error.push(file);
                }
                else {
                    uploader.files.error = [file];
                }
                
                _completeFileUpload.call(_this, name, file);

                file.errors = uploader.options.parseErrors(res);

                if (uploader.options.onError) {
                    uploader.errors.push({
                        rule: 'fileError',
                        message: 'Some of the files could not be upload due to errors.'
                    });

                    uploader.options.onError.call(uploader.ctx, res, file);
                }
            }
        });
    }

    function _completeFileUpload(name, file) {
        var uploader = this.watch.uploaders[name],
            index = uploader.files.progress.indexOf(file);

        file.percentComplete = 100;

        if (uploader.options.multiple) {
            uploader.files.complete.push(file);
        }
        else {
            uploader.files.complete = [file];
        }

        // Need to find the index each time in case of async.
        uploader.files.progress.splice(index, 1);

        if (uploader.options.onComplete) {
            uploader.options.onComplete.call(uploader.ctx, file);
        }

        _calculatePercentComplete.call(this, name);

        if (!uploader.files.queued.length && !uploader.files.progress.length) {
            uploader.meta.status = 'complete';
            uploader.meta.totalFiles = 0;

            if (uploader.options.onEnd) {
                uploader.options.onEnd.call(uploader.ctx);
            }
        }

        _processQueue.call(this, name);
    }

    function _initDropzone(name) {
        var _this = this,
            uploader = this.watch.uploaders[name],
            dz = document.getElementById(uploader.options.dropzoneId);

        if (uploader.dropzone) {

            // Means we should remove the dropzone events.
            if (uploader.options.dropzoneId === null) {
                uploader.dropzone.removeEventListener('dragenter', uploader._dropzoneDragenter, false);
                uploader.dropzone.removeEventListener('dragover', uploader._dropzoneDragover, false);
                uploader.dropzone.removeEventListener('dragleave', uploader._dropzoneDragleave, false);
                uploader.dropzone.removeEventListener('drop', uploader._dropzoneDrop, false);

                uploader._dropzoneDragenter = null;
                uploader._dropzoneDragover = null;
                uploader._dropzoneDragleave = null;
                uploader._dropzoneDrop = null;
                uploader.dropzone = null;
            }

            return;
        }
        
        // TODO: Can also check for dropzone browser support here.
        if ( ! dz) {
            return;
        }

        uploader._dropzoneDragoverCounter = 0;

        // Need to keep reference here.
        uploader._dropzoneDragenter = function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            uploader._dropzoneDragoverCounter++;
            uploader.meta.dropzoneActive = true;
        };

        uploader._dropzoneDragover = function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            uploader.meta.dropzoneActive = true;
            e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        };

        uploader._dropzoneDragleave = function(e) {
            e.stopPropagation();
            e.preventDefault();

            uploader._dropzoneDragoverCounter--;

            if (uploader._dropzoneDragoverCounter === 0) {
                uploader.meta.dropzoneActive = false;
            }
        };

        uploader._dropzoneDrop = function(e) {
            e.stopPropagation();
            e.preventDefault();

            uploader.meta.dropzoneActive = false;

            _processFiles.call(_this, name, e.dataTransfer.files);
        };

        dz.addEventListener('dragenter', uploader._dropzoneDragenter, false);
        dz.addEventListener('dragover', uploader._dropzoneDragover, false);
        dz.addEventListener('dragleave', uploader._dropzoneDragleave, false);
        dz.addEventListener('drop', uploader._dropzoneDrop, false);
        
        uploader.dropzone = dz;
    }

    var defaultOptions = {
        url: null,
        name: 'file',
        body: {},
        onSelect: null,
        onStart: null,
        onQueue: null,
        onProgress: null,
        onUpload: null,
        onError: null,
        onSuccess: null,
        onComplete: null,
        onEnd: null,
        parseErrors: _parseErrors,
        http: _http,
        multiple: false,
        async: false,
        startOnSelect: true,
        extensions: ['jpeg', 'jpg', 'png', 'gif'],
        maxFiles: 4,
        maxFilesInProgress: 2,
        currentFiles: null,
        maxSizePerFile: 1024,
        dropzoneId: null 
    };

    function Upload(Vue, options) {
        this.options = Object.assign(defaultOptions, options);
        this.Vue = Vue;

        this.watch = new this.Vue({
            data: function () {
                return {
                    uploaders: {}
                };
            }
        });
    }

    Upload.prototype.new = function (name, options) {
        var _this = this.$upload;

        name = _toCamelCase(name);

        if (_this.watch.uploaders[name]) {
            _this.watch.uploaders[name].ctx = this; // Update context always.

            return;
        }

        _this.Vue.set(_this.watch.uploaders, name, {
            dropzone: null,
            options: Object.assign({}, _this.options, options || {}),
            ctx: this
        });

        var input = document.createElement('input');
        
        input.type = 'file';
        input.id = 'websanova-upload-' + name;
        input.style.display = 'none';
        input.onchange = function () { _onFileInputChange.call(_this, name); }

        if (_this.watch.uploaders[name].options.multiple) {
            input.multiple = true;
        }

        document.body.appendChild(input);
        
        _this.reset(name); // Init the values.
    };

    Upload.prototype.reset = function (name, options) {
        var _this = this.$upload,
            uploader;

        name = _toCamelCase(name);
        options = options || {};
        uploader = _this.watch.uploaders[name];

        uploader.ctx = this; // Make sure to update the context here.

        _this.Vue.set(uploader, 'options', Object.assign({}, uploader.options, options));
        _this.Vue.set(uploader, 'files', {all: [], queued: [], progress: [], uploaded: [], error: [], success: [], complete: []});
        _this.Vue.set(uploader, 'meta', {status: 'ready', totalFiles: 0, percentComplete: 0, dropzoneActive: false});
        _this.Vue.set(uploader, 'errors', []);

        _initDropzone.call(_this, name);

        document.getElementById('websanova-upload-' + name).value = null;
    };

    Upload.prototype.select = function (name) {
        name = _toCamelCase(name);

        document.getElementById('websanova-upload-' + name).click();
    };

    Upload.prototype.start = function (name) {
        name = _toCamelCase(name);

        _processQueue.call(this, name);
    }; 

    Upload.prototype.files = function (name) {
        name = _toCamelCase(name);
        
        return (this.watch.uploaders[name] || {}).files || {all: [], queued: [], progress: [], uploaded: [], error: [], success: [], complete: []};
    };

    Upload.prototype.meta = function (name) {
        name = _toCamelCase(name);
        
        return (this.watch.uploaders[name] || {}).meta || {};
    };

    Upload.prototype.errors = function (name) {
        name = _toCamelCase(name);
        
        return (this.watch.uploaders[name] || {}).errors || [];
    };

    Upload.prototype.remove = function (name, file) {
        var i,
            index,
            files,
            uploader;

        if ( ! file) {
            return;
        }

        name = _toCamelCase(name);
        uploader = this.watch.uploaders[name];
        files = uploader.files || {};

        for (i in files) {
            index = files[i].indexOf(file);

            if (index > -1) {
                files[i].splice(index, 1);
            }
        }
    };

    Upload.prototype.option = function (name, key, val) {
        var options,
            uploader;

        name = _toCamelCase(name);
        uploader = this.watch.uploaders[name];
        options = (uploader || {}).options || {};
        
        if (uploader && key && val) {
            uploader.options[key] = val;
        }
        else if (key) {
            return options[key];
        }

        return options;
    };

    Upload.prototype.dropzone = function (name, id) {
        if (id) {
            this.option(name, 'dropzoneId', id)
        }

        _initDropzone.call(this, name);
    };

    return Upload;
};
