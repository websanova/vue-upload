<template>
    <div
        class="text-center"
    >
        <img
            :src="_image"
            width="200"
            height="200"
        />

        <br/><br/>

        <div>
            <button
                @click="$upload.select('demo')"
            >
                Upload
            </button>

            <!-- &nbsp;

            <button>
                Vuex
            </button> -->
        </div>
        
        <br/><br/>

        <div
            v-for="file in $upload.files('demo').all"
        >
            {{ file.name }}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                file: {},
            }
        },

        computed: {
            _image() {
                return this.file.image || '//www.gravatar.com/avatar/?d=robohash&s=320';
            },

            _maxFileSelect() {

            }
        },

        created() {
            this.$upload.on('demo-multi', {
                multiple: true,
                dropzoneId: 'demo-dropzone',
                startOnSelect: false,
                maxFilesSelect: 5,
                maxFilesInProgress: 2,
                accept: 'image/*',
                maxSizePerFile: 1024 * 1024 * 3,
                extensions: ['gif', 'png', 'jpg', 'jpeg'],
                onSelect: (files) => {
                    console.log('onSelect');
                    console.log(files);
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
                },
                onError: (file, res) => {
                    console.log('onError');
                    console.log(file);
                    console.log(res);
                },
                onEnd(files) {
                    console.log('onEnd');
                    console.log(file);
                    console.log(res);
                }
            });
        },

        beforeDestroy() {
            this.$upload.off('demo-multi');
        },

        mounted() {

        },

        methods: {
            
        }
    }
</script>