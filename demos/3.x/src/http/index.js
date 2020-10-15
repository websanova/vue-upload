import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export default (app) => {
    app.axios = axios;
    app.$http = axios;

    app.config.globalProperties.axios = axios;
    app.config.globalProperties.$http = axios;
}