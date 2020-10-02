import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView(view) {
    return () => import(`../pages/${view}.vue`);
}

Vue.router = new VueRouter({
    hashbang: false,
    mode: 'history',
    base: __dirname,
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
    }]
});

export default Vue.router;