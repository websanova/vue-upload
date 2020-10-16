<template>
    <div>
        <ul class="spacer mb-2">
            <li>
                <button
                    @click="$upload.select('demo-multi')"
                >
                    Select Files
                </button>
            </li>

            <li>
                <button
                    v-show="$upload.meta('demo-multi').state === 'complete'"
                    @click="$upload.reset('demo-multi')"
                >
                    Reset
                </button>
            </li>
        </ul>

        <ul class="spacer">
            <li v-for="file in files">
                <div class="thumbnail thumbnail-sm">
                    <img :src="file.image" />
                </div>
            </li>
        </ul>

        <hr/>

        <div class="media py-0">
            <div class="media-middle text-bold">
                Files
            </div>

            <div class="media-tight media-middle media-right">
                <span
                    v-show="$upload.meta('demo-multi').state === 'uploading'"
                    class="spinner"
                />
                
                <span class="text-muted text-sm mx-1">
                    ({{ $upload.meta('demo-multi').percentComplete }}%)
                </span>
                
                {{ $upload.meta('demo-multi').state }}
            </div>
        </div>

        <div
            v-for="error in errors"
            class="text-danger"
        >
            {{ error.msg }}
        </div>

        <div
            v-for="file in _files.all"
            class="media py-0"
        >
            <div class="media-middle">
                {{ file.name }}

                <div
                    v-if="file.error"
                    class="w-100 text-danger text-sm"
                >
                    {{ file.error.msg }}
                </div>

                <div class="w-100">
                    <button
                        v-show="file.state === 'queue' || file.state === 'progress' || file.state === 'upload'"
                        @click="file.clear()"
                        class="btn-sm"
                    >
                        cancel
                    </button>

                    <button
                        v-show="file.state === 'success' || file.state === 'error'"
                        @click="file.clear()"
                        class="btn-sm"
                    >
                        clear
                    </button>
                </div>
            </div>

            <div class="media-tight media-middle media-right">
                <span
                    v-show="file.sending"
                    class="spinner"
                />

                <span class="text-muted text-sm mx-1">
                    ({{ file.percentComplete }}%)
                </span>
                
                {{ file.state }}
            </div>
        </div>

        <hr/>

        <div id="dropzone">
            (drop files here to upload)
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                files: [],
                errors: [],
            }
        },

        computed: {
            _files() {
                return this.$upload.files('demo-multi');
            }
        },

        mounted() {
            // NOTE: Important to do dropzoneId on mounted
            //       otherwise it won't find the element.

            this.$upload.on('demo-multi', {
                url: 'demos/image',
                accept: 'image/*',
                multiple: true,
                dropzoneId: 'dropzone',
                startOnSelect: true,
                maxFilesInProgress: 2,
                maxSizePerFile: 1024 * 1024 * 3,
                extensions: ['gif', 'png', 'jpg', 'jpeg'],
                onSelect: (files, res) => {
                    console.log('onSelect');
                    console.log(files);
                    console.log(res);

                    this.errors = [];

                    if (res) {
                        this.errors.push(res);
                    }

                    // Add some additional data to the request.
                    this.$upload.option('demo-multi', 'body', {
                        some_id: 1
                    });

                    console.log(this.$upload.meta('demo-multi'))
                    console.log(this.$upload.errors('demo-multi'))
                },
                onProgress(file, res) {
                    console.log('onProgress');
                    console.log(file);
                    console.log(res);
                },
                onSuccess: (file, res) => {
                    console.log('onSuccess');
                    console.log(file);
                    console.log(res);

                    // On success we can update whatever we need
                    // to locally, for instance the user avatar.
                    this.files.push(res.data.data);
                },
                onError: (file, res) => {
                    console.log('onError');
                    console.log(file);
                    console.log(res);
                },
                onEnd(files, res) {
                    console.log('onEnd');
                }
            });
        },

        beforeUnmount() {
            this.$upload.off('demo-multi');
        }
    }
</script>

<style scoped>
    #dropzone {
        height: 200px;
        line-height: 200px;
        border: dashed 2px;
        background-color: #fafafa;
        text-align:center;
    }
</style>