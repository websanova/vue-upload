<template>
    <div>
        <h1 class="text-center">
            <a href="https://websanova.com">
                <img src="/img/logo-dark-text.png" height="30" />
            </a>
        </h1>

        <h1
            class="text-center"
        >
            Vue Upload Plugin Demo
        </h1>

        <div
            class="text-center"
        >
            <router-link
                :to="{name: 'site-single'}"
            >
                single
            </router-link>

            |

            <router-link
                :to="{name: 'site-multi'}"
            >
                multi
            </router-link>
        </div>

        <br/>

        <router-view />
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },

        computed: {
            
        },

        mounted() {
            
        },

        methods: {
            
        }
    }
</script>

<style>
    .text-center {
        text-align: center;
    }

    div > img {
        border: solid #eaeaea 1px;
        border-radius: 5px;
        padding: 2px;
        width: 150px;
        height: 150px;
    }

    .gallery > img {
        width: 50px;
        height: 50px;
        margin: 5px;
        float: left;
    }

    .spin {
        display: inline-block;
      /*width: 100px;*/
      /*height: 100px;*/
      animation-name: spin;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear; 
    }

    @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
    }
</style>