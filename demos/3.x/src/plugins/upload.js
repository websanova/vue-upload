import {createUpload}  from '@websanova/vue-upload/src/v3.js';
import driverHttpAxios from '@websanova/vue-upload/src/drivers/http/axios.js';

export default (app) => {
    app.use(createUpload({
        plugins: {
            http: app.axios,
        },
        drivers: {
            http: driverHttpAxios,
        },
        options: {

        }
    }));
}