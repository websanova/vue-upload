# Vue Upload

A simple, light weight and intuitive upload control for Vue.js.

**Features:**

* Drag and drop file zone.
* Progress indicators
* Synchronous or asynchronous modes.
* Validation



## Install

```bash
$ sudo npm install @websanova/vue-upload
``` 

Require in the project.

```vue
import vueUpload from '@websanova/vue-upload';

Vue.use(vueUpload);
```

OR

```
Vue.use(require('@websanova/vue-upload').default);
```



## Usage

At a minimum you will need to at least provide a `url` when creating a new `$upload` instance.

```javascript
this.$upload.on('profile-avatar', {
    url: 'users/1/avatar'
});
```

It's likely things like the `id` would not be static so use the `option` method to update any options.

```javascript
created() {
    this.$upload.on('profile-avatar', {
        onSuccess(res) {
            // Update user
        }
    });
},

mounted() {
    this.$upload.option('profile-avatar', {
        url: 'users/' + this.user.id + '/avatar'
    });
},
```

Check the [Examples](#examples) section below for more use case scenarios.



## Files

All files will be in an array even if `multiple` is set to `false`.

You can fetch the full list of files with the `files` method.

```vue
<div v-for="file in $upload.files('product-gallery').all">
    {{ file.name }} <br/>
    {{ file.size }} <br/>
    {{ file.type }} <br/>
    {{ file.state }} <br/>
    {{ file.percentComplete }} <br/>
    {{ file.errors | json }}<br/>
</div>
```

This will return a variety of queues to use for processing, such as `all`, `queue`, `progress`. Just console it out for the full list.

There is also a shortcut to fetch the last file added.

```javascript
$upload.file('profile-avatar');
```

All files contain the following meta data:

**$id**

For reference and to `key` in loops.

**$file**

Reference to raw file object from browser.

**name**

The name of the file.

**size**

The size of the file.

**type**

The mime type of the file.

**extension**

Extension of the file from filename then mimetype based on what is available.

**state**

Current state of the file which will be either `queue`, `progress`, `upload`, `error` or `success`.

**percentComplete**

Percent progress indicator for the file as an integer (0 to 100);

**errors**

Errors from file.

Note that errors can come internally from the module itself or externally from an error on the server end.

Use `parseErrors` option when installing the plugin to format errors from the server.

The internal default format is: `[{code: 'somecode', msg: 'There was an error.''}]`



## Errors

The plugin also includes an `errors` object that includes a full stack of local and file errors.

For instance checking valid extensions or size is done locally in the browser and will add an internal error.

Some cases like total files selected exceeded the count set can also throw an error without a file. In this the `file` object in the error will be `null`.



## Methods

### `on`

This is used to create a new "upload" instance.

* An upload instance is tracked in a global state.
* Existing states will not be overwritten so you can call `on` multiple times without worry (use `option` for updating options).
* It will always contain the current components instance when using `this`.

Typically a combination of `on` and `off` will be used. It's mostly semantic but it's nice to keep the separation.

The `bind` option can also be used to re-bind the instance to the current context.

```javascript
created() {
    this.$upload.on('profile-avatar', {
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
    this.$upload.option('profile-avatar', {
        url: 'users/' + this.$auth.user().id + '/avatar'
    });
},
```


### `off`

Destroy the upload instance. It's good to not leave these lingering around.

Note it should be fine to just use `on` without problems, but this is here as a safety and for performance issues.


### `reset`

This will completely reset the instance.

Also check the `on` option for more details.

* An instance using `on` must be created first.

```javascript
mounted() {
    this.$upload.reset('profile-avatar');
},
```

It's also useful to call `reset()` for clearing an upload when using `multiple`.

For instance a "clear" button.

```vue
<button v-on:click="$upload.reset('product-gallery')">
    Clear
</button>
```


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

```vue
<img :src="brandLogo" />

<button v-on:click="$upload.select('brand-logo')">
    Select Photo
</button>

<button v-on:click="$upload.start('brand-logo')">
    Upload Photo
</button>
```


### files

Contains arrays of files currently being processed.

* It contains multiple queues that can be used to display file data for viewing.
* The queues are `all`, `queued`, `progress`, `upload`, `success`, `error`.
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

**state**

It will be either `ready`, `uploading`, `complete`.

**percentComplete**

Keeps track of progress for the currently uploading files.



### percent

Shortcut for meta.percentComplete.

~~~javascript
$upload.percent('demo');
~~~



### state

Shortcut for meta.state.

~~~javascript
$upload.state('demo');
~~~



### dropzone

For use with drag/drop files to upload into a "drop zone".

* Primarily used to be able to trigger an overlay when using a drop container.
* This does NOT use the "dropzone" library.

```vue
<div v-show="$upload.dropzone('product-gallery').active">
    Drop files anywhere here to begin upload.
</div>
```


### errors

This returns the global error state for the upload instance.

* This will not return the individual file errors.

```vue
<div v-if="$upload.errors('product-gallery').length">
    <div v-for="error in $upload.errors('product-gallery')">
        {{ error.code }}: {{ error.msg }}
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


### `onUpload: null`

Triggered once the file is uploaded but still waiting for response from server.


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

It must return an array of objects in the format: `[{code: 'someerror', msg: 'There was an error.'}]`


### `http: _http`

By default the plugin "assumes" `Vue.http` from `vue-resource` is used.

However this can be easily overridden.

It contains five parameters: `url`, `body`, `progress`, `success`, `error`.

```javascript
function _http(data) {
    this.Vue.http.post(data.url, data.body, {progress: data.progress}).then(data.success, data.error);
}
```

Example using Axios:

```javascript
function _http(data) {
    axios.get(data.url)
      .then(data.success)
      .catch(data.error);
}
function _parseErrors(error) {
    // in this example, the backend is returning JSON with a 'detail' field
    if (error.response.data.detail) {
        return [{code: 'fileError', msg: error.response.data.detail}];
    }

    return [];
}
```


### `multiple: false`

For multiple file uploads this must be set to `true`.


### `maxFilesInProgress: 2`

Set the maximum number of uploads that can run in parallel when `async` is set to `true`.


### `startOnSelect: true`

To disable the upload from beginning automatically set this to `false`.


### `extensions: ['jpeg', 'jpg', 'png', 'gif']`

The set of valid extensions allowed for upload.

Set to `false` to ingore this check.


### `maxFilesSelect: 4`

The maximum number of files allowed for upload. 

Note that this works in conjunction with `currentFiles` for a set maximum.


### `maxSizePerFile: 1024 * 1024 * 2`

Set the maximum size per file in bytes


### `dropzoneId: null`

You can set this to a DOM element ID to automatically assign the necessary drag and drop events to the element.

Important to note that (to be safe) the dropzone should always be unloaded when leaving the component it is called in.

```javascript
created() {
    this.$upload.on('product-gallery', {
        multiple: true,
        dropzoneId: 'product-gallery-dropzone',
    });
},

mounted() {
    this.$upload.option('product-gallery', {
        url: `products/${this.product.id}/gallery`,
    });
},

beforeDestroy() {
    this.$upload.off('product-gallery');
},
```



## Examples

Some common scenarios likely to be encountered when doing an upload and how `$upload` can handle them.


### Single File (Profile Avatar)

A simple profile avatar upload with button, state and errors.

```vue
<img :src="$auth.user().avatar || '//www.gravatar.com/avatar/?d=mysteryman&s=200'" />

<div>
    <button v-on:click="$upload.select('profile-avatar')" :disabled="$upload.meta('profile-avatar').state === 'sending'">
        <span v-show="$upload.meta('profile-avatar').state === 'sending'">Updating...</span>
        <span v-show="!$upload.meta('profile-avatar').state === 'sending'">Update Photo</span>
    </button>
</div>

<div v-if="$upload.files('profile-avatar').error.length">
    {{ $upload.files('profile-avatar').error[0].errors[0].msg }}
</div>
```

```javascript
created() {
    this.$upload.on('profile-avatar', {
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
    this.$upload.option('profile-avatar', {
        url: `users/${this.$auth.user().id}/avatar`
    });
},
```


### Multiple File (With Dropzone)

Multiple file upload with async, dropzone and file list.

```vue
<div>
    <button id="product-gallery-dropzone" v-on:click="$upload.select('product-gallery')" :disabled="$upload.meta('product-gallery').state === 'sending'">
        <span v-show="$upload.meta('product-gallery').state === 'sending'">Uploading...</span>
        <span v-show="!$upload.meta('product-gallery').state === 'sending'">Select Photos</span>
    </button>

    <button v-on:click="$upload.reset('product-gallery')" :disabled="$upload.meta('product-gallery').state === 'sending'">
        Clear
    </button>
</div>

<div class="progress">
    <div class="progress-bar" :style="'width: ' + $upload.meta('product-gallery').percentComplete + '%;'">
        {{ $upload.meta('product-gallery').percentComplete }}% Complete
    </div>
</div>

<div v-if="$upload.errors('product-gallery').length" class="text-danger">
    {{ $upload.errors('product-gallery')[0].msg }}
</div>

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

    <div v-for="file in $upload.files('product-gallery').queue">
        <div>
            {{ file.name }}
            <br/>
            Queued for upload
        </div>
    </div>

    <div v-for="file in $upload.files('product-gallery').success">
        {{ file.name }}
        <br/>
        Uploaded successfully.
    </div>

    <div v-for="file in $upload.files('product-gallery').error">
        {{ file.name }}
        <br/>
        {{ file.errors[0].msg }}
    </div>
</div>
```

```javascript
created() {
    this.$upload.on('product-gallery', {
        maxFilesSelect: 20,
        dropzoneId: 'product-gallery-dropzone',
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
    this.$upload.option('product-gallery', {
        url: 'products/' + this.product.id + '/gallery'
    });
},

beforeDestroy() {
    this.$upload.off('product-gallery');
},
```

## Change Log

### v1.0.x-beta

* Update version to `1.0.x`.
* The `new` method has been changed to `on`.
* The `reset` method just resets all variables and queues/sets now.
* A new `bind` method is now available rebind any context.
* A new `off` method is available to unbind and delete all references (dropzone, inputs, etct).
* All `status` properties have been changed to `state` at file and global level.
* Added `state` and `percent` methods (just shortcuts for meta.percentComplete and meta.state).
* Global state values are now `ready`, `uploading`, `complete`. This is the value provided by `meta.state`. 
* File `state` values are now `queue`, `progress`, `upload`, `error`, `success` witch align directly with the `files()` sets.
* The `files()` method now contains `all`, `queue`, `progress`, `upload`, `error`, `success` sets. The `complete` set has been dropped.
* Max file size check has been changed from Kilobytes to bytes.
* Event order is now `onSelect`, `onStart`, `onQueue`, `onProgress`, `onUpload`, `onError`, `onSuccess`, `onComplete`, `onEnd`.
* Pressing cancel in the file select dialog now does not fire any events.
* The `parseErrors` format is now a single object not an array of objects. Reason being that an error is likely to be either file size or extension or system error. So really no reason to stack errors here.
* The error format has changed to `{code: 'someCode', msg: 'someMsg'}`. The `message` param has been changed to `msg`.
* The callbacks have been update to always return the `file` first instead of a `response` then file. So `onSuccess(file, res)` instead of `onSuccess(res, file)`. This is just for more consistency since most of the function do not have a response.