<template>
    <div
        style="max-width: 400px; margin: 0 auto;"
    >
        <div>
            <button
                @click="$upload.select('demo-multi')"
            >
                Select Files
            </button>

            &nbsp;

            <button
                v-show="$upload.meta('demo-multi').state === 'complete'"
                @click="$upload.reset('demo-multi')"
            >
                Reset
            </button>
        </div>
        
        <br/>

        <div>
            <b>Complete</b>
        </div>

        <div
            class="gallery"
        >
            <img
                v-for="file in files"
                :src="file.image"
            />
        </div>

        <div style="clear:both;"></div>

        <hr/>

        <div>
            <b>Uploading</b>

            -

            {{ $upload.meta('demo-multi').state }}

            -

            <span
                v-show="$upload.meta('demo-multi').state === 'uploading'"
                class="spin"
            >+</span>

            {{ $upload.meta('demo-multi').percentComplete }}
        </div>

        <div
            v-for="error in errors"
            style="color:red;"
        >
            {{ error.msg }}
        </div>

        <div
            v-for="file in _files.all"
        >
            {{ file.name }}

            - 
            
            {{ file.state }}

            - 

            <span
                v-show="file.sending"
            >
                <span
                    class="spin"
                >+</span>

                {{ file.percentComplete }}%
            </span>

            <button
                v-show="file.state === 'queue' || file.state === 'progress'"
                @click="file.clear()"
            >
                cancel
            </button>

            <button
                v-show="file.state === 'success' || file.state === 'error'"
                @click="file.clear()"
            >
                clear
            </button>
        </div>

        <br/>

        <div
            id="dropzone"
            style="height: 200px; border: dashed 2px; background-color: #fafafa; text-align:center; line-height: 200px;"
        >
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

        beforeDestroy() {
            this.$upload.off('demo-multi');
        }
    }
</script>