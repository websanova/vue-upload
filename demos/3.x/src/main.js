import {createApp} from 'vue'
import App         from './pages/Index.vue'
import router      from './router'

createApp(App)
    .use(router)
    .mount('#app')