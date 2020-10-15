import {createPlugin} from '@websanova/vue-upload/src/v3.js';

export default (app) => {
    app.use(createPlugin({
        http: {}
    }));
}