import {createPlugin} from '@websanova/vue-upload/src/v3.js';
import httpAxios      from '@websanova/vue-upload/src/drivers/http/axios.js';

export default (app) => {
    app.use(createPlugin({
        http: httpAxios
    }));
}