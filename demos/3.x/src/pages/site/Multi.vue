<template>
    <div>
        <ul class="spacer mb-2">
            <li>
                <button
                    @click="select"
                >
                    Select Files
                </button>
            </li>

            <li>
                <button
                    v-show="state._meta.state === 'complete'"
                    @click="reset"
                >
                    Reset
                </button>
            </li>
        </ul>

        <ul class="spacer">
            <li v-for="file in state.files">
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
                    v-show="state._meta.state === 'uploading'"
                    class="spinner"
                />
                
                <span class="text-muted text-sm mx-1">
                    ({{ state._meta.percentComplete }}%)
                </span>
                
                {{ state._meta.state }}
            </div>
        </div>

        <div
            v-for="error in state.errors"
            class="text-danger"
        >
            {{ error.msg }}
        </div>

        <div
            v-for="file in state._files.all"
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
    import {reactive          } from 'vue';
    import {computed          } from 'vue';
    import {onMounted         } from 'vue';
    import {onBeforeUnmount   } from 'vue';
    import {getCurrentInstance} from 'vue';

    export default {
        setup() {
            const ctx = getCurrentInstance().ctx;

            const state = reactive({
                files: [],
                errors: [],
                _files: computed(() => {
                    return ctx.$upload.files('demo-multi');
                }),
                _meta: computed(() => {
                    return ctx.$upload.meta('demo-multi');
                })
            });

            function select() {
                ctx.$upload.select('demo-multi');
            }

            function reset() {
                ctx.$upload.reset('demo-multi')
            }

            onMounted(() => {
                // NOTE: Important to do dropzoneId on mounted
                //       otherwise it won't find the element.

                ctx.$upload.on('demo-multi', {
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

                        state.errors = [];

                        if (res) {
                            state.errors.push(res);
                        }

                        // Add some additional data to the request.
                        ctx.$upload.option('demo-multi', 'body', {
                            some_id: 1
                        });

                        console.log(ctx.$upload.meta('demo-multi'))
                        console.log(ctx.$upload.errors('demo-multi'))
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
                        state.files.push(res.data.data);
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
            });

            onBeforeUnmount(() => {
                ctx.$upload.off('demo-multi');
            });

            return {
                state,
                select,
                reset,
            };
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