<template>
    <div
        class="text-center"
    >
        <div class="mb-2 thumbnail">
            <img
                :src="_image"
            />
        </div>

        <div class="mb-2">
            <button
                v-show="!_file.state || _file.state === 'success' || _file.state === 'error'"
                @click="$upload.select('demo-single')"
            >
                Upload
            </button>

            <button
                v-show="_file.state === 'queue'"
                @click="$upload.start('demo-single')"
            >
                Start
            </button>

            <button
                v-show="_file.state === 'progress' || _file.state === 'upload'"
                disabled
            >
                <span
                    v-show="_file.sending"
                    class="spinner"
                />

                {{ _file.percentComplete }}%
            </button>
        </div>

        <div
            v-show="_file.state"
        >
            {{ _file.name }}

            - 
            
            {{ _file.state }}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                file: {
                    image: null
                },
            }
        },

        computed: {
            _file() {
                return this.$upload.file('demo-single');
            },

            _image() {
                return this.file.image || '//www.gravatar.com/avatar/?d=robohash&s=320';
            }
        },

        mounted() {
            this.$upload.on('demo-single', {
                url: 'demos/image',
                accept: 'image/*',
                startOnSelect: false,
                maxSizePerFile: 1024 * 1024 * 3,
                extensions: ['gif', 'png', 'jpg', 'jpeg'],
                onSelect: (files, res) => {
                    console.log('onSelect');
                    console.log(files);

                    // Add some additional data to the request.
                    this.$upload.option('demo-single', 'body', {
                        some_id: 1
                    });

                    // Load a preview first.
                    this.$upload.file('demo-single').preview((file) => {
                        this.file.image = file.$raw;
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
                    this.file = res.data.data;
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
            this.$upload.off('demo-single');
        }
    }
</script>