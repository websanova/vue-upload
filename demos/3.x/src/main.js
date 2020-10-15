import {createApp} from 'vue';
import App         from './pages/Index.vue';
import http        from './http';
import store       from './store';
import router      from './router';

createApp(App)
    .use(http)
    .use(store)
    .use(router)
    .mount('#app');