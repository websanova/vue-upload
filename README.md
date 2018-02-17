# Vue Upload

A simple, light weight and intuitive upload control for Vue.js.

**Features:**

* Drag and drop file zone.
* Progress bars
* Synchronous or asynchronous modes.
* File validation
* Max files check (with current).

**NOTE** This plugin has only been tested with Vue 2.x.





## Install

```bash
$ sudo npm install @websanova/vue-upload
``` 

Require in the project.

```vue
Vue.use(require('@websanova/vue-upload'));
```




## Usage

At a minimum you will need to at least provide a `url` when creating a new `$upload` instance.

```javascript
this.$upload.new('profile-avatar', {
    url: 'users/1/avatar'
});
```

It's likely things like the `id` would not be static so use the `reset` function to update any options.

```javascript
created() {
    this.$upload.new('profile-avatar', {
        onSuccess(res) {
            // Update user
        }
    });
},

mounted() {
    this.$upload.reset('profile-avatar', {
        url: 'users/' + this.$user.id + '/avatar'
    });
},
```

Check the [Examples](#examples) section below for more use case scenarios.





## Files

All files will be in an array even if `multiple` is set to `false`.

For single items the first file in the object can be taken directly.

```javascript
$upload.files('profile-avatar')[0];
```

For a large set they can be looped through.

```vue
<div v-for="file in $upload.files('product-gallery').all">
    {{ file.name }} <br/>
    {{ file.size }} <br/>
    {{ file.type }} <br/>
    {{ file.status }} <br/>
    {{ file.percentComplete }} <br/>
    {{ file.errors | json }}<br/>
</div>
```

All files contain the following meta data:

**name**

The name of the file.

**size**

The size of the file.

**type**

The mime type of the file.

**status**

Current status of the file which will be either `ready`, `sending`, `error` or `success`.

**percentComplete**

Percent progress indicator for the file as an integer (0 to 100);

**errors**

Errors from file.

Note that errors can come internally from the module itself or externally from an error on the server end.

Use `parseErrors` option when installing the plugin to format errors from the server.

The internal default format is: `[{rule: 'somerule', message: 'There was an error.''}]`

**preview**

The `preview` options is a function that can be set with a callback that will locally load the file (not uploaded).

```javascript
this.$upload.new('brand-logo', {
    onSelect(files) {
        files[0].preview((file) => {
            // Do something with `file.raw`.
        });
    }
});
```




## Errors

The plugin comes with two tiers of errors. It's important to know the difference between them.

### Top Level

The top level error is designed to prevent the upload from even beginning.

This is primarily for cases where for instance a max amount of files has been reached or too many files have been selected.

Some important things to note:

* If there any errors in single files it will log ONE error here saying so.
* If it's global conditions are met it will still fire off individual uploads.
* It has statuses: `ready`, `sending`, `error`, `complete` which can be found in the `meta` object.
* The `error` status will only get triggered if the global condition fails.
* The `complete` status will still trigger for individual file errors. An global error will be logged (more as a warning) but the state will NOT be in `error`.

### File Level

This one is pretty much self explanatory. If an error is caught it will be tracked and status updated accordingly.

Notes:

* The status for single file uploads can be `ready`, `sending`, `error`, `success`.
* Errors are tracked in an array `[{rule: 'somerule', message: 'There is an error.'}]`.
* Use the `parseError` option to change the way errors are parsed from the server.
* If an error is caught the file will be moved into the `files.error` array (local or server).

Different ways to deal with errors are covered in the [Examples](#examples) section below.




### Methods

### `new`

This is used to create a new "upload" instance.

* An upload instance is tracked in a global state.
* Existing states will not be overwritten so you can call `new` multiple times without worry (use `reset` for updating options).
* It will always contain the current components instance when using `this`.

Typically a combination of `new` and `reset` will be used. It's mostly semantic but it's nice to keep the separation. 

```javascript
created() {
    this.$upload.new('profile-avatar', {
        onSuccess(res) {
            this.$msgbag.success('Avatar uploaded successfully.');
            this.$auth.user(res.data.data);
        },
        onError() {
            this.$msgbag.error('Error uploading avatar.');
        }
    });
},

mounted() {
    this.$upload.reset('profile-avatar', {
        url: 'users/' + this.$auth.user().id + '/avatar'
    });
},
```


### `reset`

This will completely reset the instance.

Also check the `new` option for more details.

* An instance using `new` must be created first.
* Additional options can be passed in to override any existing ones (useful for updating the url).

```javascript
mounted() {
    this.$upload.reset('profile-avatar', {
        url: 'users/' + this.$auth.user().id + '/avatar'
    });
},
```

It's also useful to call `reset()` for clearing an upload when using `multiple`.

For instance a "clear" button.

```vue
<button v-on:click="$upload.reset('product-gallery')">
    Clear
</button>
```

This would not affect any existing options, but only clear out the `files` arrays and reset some `meta` values.


### select

This is used to trigger the browsers file select popup/dialog.

* It's important to note that by default the uploads will start once files are selected.
* Set `startOnSelect` option to `false` to prevent uploads from beginning after selection.

```vue
<button v-on:click="$upload.select('brand-logo')">
    Update Photo
</button>
```


### start

This option is to be used in conjunction with the `startOnSelect` option when it's set to `false`.

* It allows manual triggering of the upload.
* Good to use with previews.

```vue
<img :src="brandLogo" />

<button v-on:click="$upload.select('brand-logo')">
    Select Photo
</button>

<button v-on:click="$upload.start('brand-logo')">
    Upload Photo
</button>
```

```javascript
this.$upload.new('brand-logo', {
    onSelect(files) {
        files[0].preview((file) => {
            this.brandLogo = file.raw;
        });
    }
});
```


### files

Contains arrays of files currently being processed.

* It contains multiple queues that can be used to display file data for viewing.
* The queues are `all`, `queued`, `progress`, `success`, `error`, `complete`.
* Note in some cases there is overlap like in `success`, `error`, `complete`.
* The array will not reset after completing (use `reset` and `onEnd` for that).

```vue
<div v-for="file in $upload.files('product-gallery').progress">
    {{ file.name }}: {{ file.percentComplete }}%
</div>

<div v-for="file in $upload.files('product-gallery').queued">
    {{ file.name }}: Queued for upload
</div>
```


### meta

Fetches some meta info about the current uploads.

The meta info is fully reactive an can be used directly in the templates.

```javascript
{{ $upload.meta('product-gallery').percentComplete }}%
```

It contains the following properties:

**status**

It will be either `ready`, `sending`, `error`, `complete`. Check the [Errors](#errors) section above for more info.

**totalFiles**

For keeping track of the total files in the current upload set.

* It's important to note that once all uploads complete it will be reset to 0.
* This primarily used to keep track of current upload progress percentage.
* If there are still items in queue or in progress and more files are added this will increment.

**percentComplete**

Keeps track of progress for the currently uploading files.

**dropzoneActive**

For use with drag/drop files to upload into a "drop zone".

* Primarily used to be able to trigger an overlay when using a drop container.
* This does NOT use the "dropzone" library.

```vue
<el-overlay v-show="$upload.meta('product-gallery').dropzoneActive">
    Drop files anywhere here to begin upload.
</el-overlay>
```


### errors

This returns the global error state for the upload instance.

* This will not return the individual file errors.

```vue
<div v-if="$upload.errors('product-gallery').length">
    <div v-for="error in $upload.errors('product-gallery')">
        {{ error.rule }}: {{ error.message }}
    </div>
</div>
```


### remove

Used for removing a single file from the `files` arrays.

* This will remove the file from all files arrays where it exists.

```javascript
$upload.remove('product-gallery', file);
```


### `option`

Update an option without resetting the uploads.

* Useful if a url or body param needs to be changed.

```javascript
$upload.option('product-gallery', 'key', 'val');
```


### `dropzone`

Reset the dropzone without resetting the uploads.

* Useful if there is a global upload but only triggers via a dropzone on a specific page.

```javascript
$upload.dropzone('product-gallery', 'id');
```



## Options

### `url: null`

This is required and sets the end point for the upload.


### `name: 'file'`

The "name" to use for the upload file.


### `body: {}`

Any additional form data to be sent with the upload.


### `onSelect: null`

Triggered when files are selected.


### `onStart: null`

Triggered once upload begins.


### `onQueue: null`

Triggered once a file is moved into queue.


### `onProgress: null`

Triggered once a file begins to upload.


### `onError: null`

Triggered if file has an error (front or back end).


### `onSuccess: null`

Triggered when server sends back a success.


### `onComplete: null`

Triggered after either `error` or `success`.


### `onEnd: null`

Triggered when currently uploading files all complete.


### `parseErrors: _parseErrors`

Used to parse errors from server end.

It must return an array of objects in the format: `[{rule: 'someerror', message: 'There was an error.'}]`


### `http: _http`

By default the plugin "assumes" `Vue.http` from `vue-resource` is used.

However this can be easily overridden.

It contains five parameters: `url`, `body`, `progress`, `success`, `error`.

```javascript
function _http(data) {
    this.Vue.http.post(data.url, data.body, {progress: data.progress}).then(data.success, data.error);
}
```


### `multiple: false`

For multiple file uploads this must be set to `true`.


### `async: false`

For asynchronous uploads set this to `true`.

Can also be used in conjunction with `maxFilesInProgress`.


### `maxFilesInProgress: 2`

Set the maximum number of uploads that can run in parallel when `async` is set to `true`.


### `startOnSelect: true`

To disable the upload from beginning automatically set this to `false`.


### `extensions: ['jpeg', 'jpg', 'png', 'gif']`

The set of valid extensions allowed for upload.

Set to `false` to ingore this check.


### `maxFiles: 4`

The maximum number of files allowed for upload. 

Note that this works in conjunction with `currentFiles` for a set maximum.


### `currentFiles: null`

If this value is set to an integer it will subtract from `maxFiles` to create a set maximum of uploads.

Note that if it's set to an integer (not null) the value will automatically increment on each upload `success`.


### `maxSizePerFile: 1024`

Set the maximum size per file.


### `dropzoneId: null`

Set the dropzone container which will automatically create the dropzone.

Important to note that (to be safe) the dropzone should always be unloaded when leaving the component it is called in.

```javascript
created() {
    this.$upload.new('product-gallery', {
        async: true,
        multiple: true
    });
},

mounted() {
    this.$upload.reset('product-gallery', {
        url: `products/${this.product.id}/gallery`,
        dropzoneId: 'product-gallery-dropzone',
    });
},

beforeDestroy() {
    this.$upload.reset('product-gallery', {
        dropzoneId: null
    });
},
```





## Examples

Some common scenarios likely to be encountered when doing an upload and how `$upload` can handle them.


### Single File (Profile Avatar)

A simple profile avatar upload with button, status and errors.

```vue
<img :src="$auth.user().avatar || '//www.gravatar.com/avatar/?d=mysteryman&s=200'" />

<div>
    <button v-on:click="$upload.select('profile-avatar')" :disabled="$upload.meta('profile-avatar').status === 'sending'">
        <span v-show="$upload.meta('profile-avatar').status === 'sending'">Updating...</span>
        <span v-show="!$upload.meta('profile-avatar').status === 'sending'">Update Photo</span>
    </button>
</div>

<div v-if="$upload.files('profile-avatar').error.length">
    {{ $upload.files('profile-avatar').error[0].errors[0].message }}
</div>
```

```javascript
created() {
    this.$upload.new('profile-avatar', {
        onSuccess(res) {
            this.$msgbag.success('Avatar uploaded successfully.');
            this.$auth.user(res.data.data);
        },
        onError() {
            this.$msgbag.error('Error uploading avatar.');
        }
    });
},

mounted() {
    this.$upload.reset('profile-avatar', {
        url: `users/${this.$auth.user().id}/avatar`
    });
},
```


### Preview Before Upload (Logo)

Selecting an image with preview before uploading.

```vue
<img :src="brandImage || '//www.gravatar.com/avatar/?d=mysteryman&s=200'" />

<div>
    <button type="button" v-on:click="$upload.select('brand-logo')" :disabled="$upload.meta('brand-logo').status === 'sending'">
        Select Logo
    </button>

    <button type="button" v-on:click="$upload.start('brand-logo')" :disabled="$upload.meta('brand-logo').status === 'sending'">
        <span v-show="$upload.meta('brand-logo').status === 'sending'">Saving...</span>
        <span v-show="!$upload.meta('brand-logo').status === 'sending'">Save Logo</span>
    </button>
</div>

<div v-if="$upload.files('brand-logo').error.length" class="text-danger">
    {{ $upload.files('brand-logo').error[0].errors[0].message }}
</div>
```

```javascript
data() {
    return {
        brandImage: null
    };
},

created() {
    this.$upload.new('brand-logo', {
        startOnSelect: false,
        onSuccess(res) {
            this.$msgbag.success('Brand logo uploaded successfully.');
            this.brand = res.data.data;
        },
        onError() {
            this.$msgbag.error('Error uploading brand logo.');
        },
        onSelect(files) {
            files[0].preview((file) => {
                this.brandImage = file.raw;
            });
        }
    });
},

mounted() {
    this.$upload.reset('brand-logo', {
        url: 'brands/' + this.brand.id + '/logo'
    });
    
    this.brandImage = this.brand.logo || '//www.gravatar.com/avatar/?d=identicon&s=100';
}
```


### Multiple File (With Dropzone)

Multiple file upload with async, dropzone and file list.

```vue
<div>
    <button v-on:click="$upload.select('product-gallery')" :disabled="$upload.meta('product-gallery').status === 'sending'">
        <span v-show="$upload.meta('product-gallery').status === 'sending'">Uploading...</span>
        <span v-show="!$upload.meta('product-gallery').status === 'sending'">Select Photos</span>
    </button>

    <button v-on:click="$upload.reset('product-gallery')" :disabled="$upload.meta('product-gallery').status === 'sending'">
        Clear
    </button>
</div>

<div class="progress">
    <div class="progress-bar" :style="'width: ' + $upload.meta('product-gallery').percentComplete + '%;'">
        {{ $upload.meta('product-gallery').percentComplete }}% Complete
    </div>
</div>

<div v-if="$upload.errors('product-gallery').length" class="text-danger">
    {{ $upload.errors('product-gallery')[0].message }}
</div>
```

```vue
<div>
    <div v-if="!$upload.files('product-gallery').all.length">
        No uploads here yet.
    </div>

    <div v-for="file in $upload.files('product-gallery').progress">
        <div>
            {{ file.name }}
        </div>

        <div class="progress">
            <div class="progress-bar" :style="'width: ' + file.percentComplete + '%;'">
                {{ file.percentComplete }}%
            </div>
        </div>
    </div>

    <div v-for="file in $upload.files('product-gallery').queued">
        <div>
            {{ file.name }}
            <br/>
            Queued for upload
        </div>
    </div>

    <div v-for="file in $upload.files('product-gallery').complete">
        <div v-if="file.errors.length">
            {{ file.name }}
            <br/>
            {{ file.errors[0].message }}
        </div>
        
        <div v-if="!file.errors.length">
            {{ file.name }}
            <br/>
            Uploaded successfully.
        </div>
    </div>
</div>
```

```javascript
created() {
    this.$upload.new('product-gallery', {
        async: true,
        maxFiles: 20,
        multiple: true,
        onStart() {
             this.$toggle.show('product:media:uploads');
        },
        onSuccess(res) {
            this.product.gallery.push(res.data.data);
        },
        onEnd() {
            this.$msgbag.success('File upload complete.');
        }
    });
},

mounted() {
    this.$upload.reset('product-gallery', {
        url: 'products/' + this.product.id + '/gallery',
        currentFiles: this.product.gallery.length,
        dropzoneId: 'product-gallery-dropzone',
    });
},

beforeDestroy() {
    this.$upload.reset('product-gallery', {
        dropzoneId: null
    });
},
```
