import {createPlugin} from '@websanova/vue-upload/src/index.js';

export default (app) => {
    app.use(createPlugin({
        http: {}
    }));
}