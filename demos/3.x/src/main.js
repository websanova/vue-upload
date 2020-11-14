import {createApp} from 'vue';
import App         from './pages/Index.vue';
import http        from './http';
import store       from './store';
import router      from './router';
import upload      from './plugins/upload.js';

const app = createApp(App);
    
app
.use(http)
.use(store)
.use(router)
.use(upload)
.mount('#app');