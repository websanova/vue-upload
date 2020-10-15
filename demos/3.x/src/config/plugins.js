import {createPlugin} from '@websanova/vue-upload/src/plugin.js';

export default (app) => {
    app.use(createPlugin({
        some: 'data'
    }));
}