<template>
    <el-layout
        title="Vue Upload 3.x Demo"
        package="vue-upload"
        :links="[{
            to: {name: 'site-single'},
            text: 'single'
        }, {
            to: {name: 'site-multi'},
            text: 'multi'
        }]"
    >
        <router-view />
    </el-layout>
</template>

<script>
    import elLayout from '../elements/Layout.vue';

    export default {
        components: {
            elLayout,
        }
    }
</script>
