import {createRouter, createWebHistory} from 'vue-router';

function loadView(view) {
    return () => import(`../pages/${view}.vue`);
}

const router = createRouter({
    hashbang: false,
    history: createWebHistory(),
    routes: [{
        path: '/',
        redirect: {
            name: 'site-single'
        }
    }, {
        path: '/single',
        name: 'site-single',
        component: loadView('site/Single'),
    }, {
        path: '/multi',
        name: 'site-multi',
        component: loadView('site/Multi'),
    }, {
        path: '/:pathNotFound(.*)*',
        redirect: {
            path: '/'
        }
    }]
});

export default (app) => {
    app.router = router;

    app.use(router);
}