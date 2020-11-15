<template>
    <div
        class="text-center"
    >
        <div class="mb-2 thumbnail">
            <img
                :src="state._image"
            />
        </div>

        <div class="mb-2">
            <button
                v-show="!state._file.state || state._file.state === 'success' || state._file.state === 'error'"
                @click="select"
            >
                Upload
            </button>

            <button
                v-show="state._file.state === 'queue'"
                @click="start"
            >
                Start
            </button>

            <button
                v-show="state._file.state === 'progress' || state._file.state === 'upload'"
                disabled
            >
                <span
                    v-show="state._file.sending"
                    class="spinner"
                />

                {{ state._file.percentComplete }}%
            </button>
        </div>

        <div
            v-show="state._file.state"
        >
            {{ state._file.name }} - {{ state._file.state }}
        </div>
    </div>
</template>

<script>
    import {reactive       } from 'vue';
    import {computed       } from 'vue';
    import {onMounted      } from 'vue';
    import {onBeforeUnmount} from 'vue';
    import {useUpload      } from '@websanova/vue-upload/src/v3.js';

    export default {
        setup() {
            const upload = useUpload();

            const state = reactive({
                file: {
                    image: null
                },
                _file: computed(() => {
                    return upload.file('demo-single');
                }),
                _image: computed(() => {
                    return state.file.image || '//www.gravatar.com/avatar/?d=robohash&s=320';
                })
            });

            function select() {
                upload.select('demo-single');
            }

            function start() {
                upload.start('demo-single');
            }

            onMounted(() => {
                upload.on('demo-single', {
                    url: 'demos/image',
                    accept: 'image/*',
                    startOnSelect: false,
                    maxSizePerFile: 1024 * 1024 * 3,
                    extensions: ['gif', 'png', 'jpg', 'jpeg'],
                    onSelect: (files, res) => {
                        console.log('onSelect');
                        console.log(files);

                        // Add some additional data to the request.
                        upload.option('demo-single', 'body', {
                            some_id: 1
                        });

                        // Load a preview first.
                        upload.file('demo-single').preview((file) => {
                            state.file.image = file.$raw;
                        });
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
                        state.file = res.data.data;
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
                upload.off('demo-single');
            });

            return {
                state,
                start,
                select,
            };
        }
    }
</script>