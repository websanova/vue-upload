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
            <button>
                Upload
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                file: {}
            }
        },

        computed: {
            _image() {
                return this.file.image || '//www.gravatar.com/avatar/?d=robohash&s=320';
            }
        },

        mounted() {

        },

        methods: {
            
        }
    }
</script>