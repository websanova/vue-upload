<template>
    <router-link :to="{name: 'site-single'}">single</router-link>

    |

    <router-link :to="{name: 'site-multi'}">multi</router-link>
    
    <hr/>

    <router-view />
</template>

<script>
    export default {
        mounted() {
            // this.$plugin.func();

            this.$store.dispatch('upload/test');

            this.$http({
                url: 'demos/users/list'
            });
        }
    }
</script>
