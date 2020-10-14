<template>
    <router-link :to="{name: 'site-single'}">single</router-link>

    |

    <router-link :to="{name: 'site-multi'}">multi</router-link>
    
    <hr/>

    <router-view />
</template>

<script>
    export default {

    }
</script>
