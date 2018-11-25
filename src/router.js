import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/components/Accueil.vue')
        },
        {
            path: '/realisations',
            name: 'realisations',
            component: () => import('@/components/Realisations.vue')
        },
        {
            path: '/cuisines',
            name: 'cuisines',
            component: () => import('@/components/Realisations.vue')
        },
        {
            path: '/realisation/:id',
            name: 'realisation',
            component: () => import('@/components/Realisation.vue')
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
