import Vue from 'vue'
import Router from 'vue-router'
import * as process from "../.eslintrc";

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
            path: '/rangements',
            name: 'rangements',
            component: () => import('@/components/Realisations.vue')
        },
        {
            path: '/salles_de_bain',
            name: 'salles_de_bain',
            component: () => import('@/components/Realisations.vue')
        },
        {
            path: '/realisation/:id',
            name: 'realisation',
            component: () => import('@/components/Realisation.vue')
        },
        {
            path: '/cuisine/:id',
            name: 'cuisine',
            component: () => import('@/components/Realisation.vue')
        },
        {
            path: '/rangement/:id',
            name: 'rangement',
            component: () => import('@/components/Realisation.vue')
        },
        {
            path: '/salle_de_bain/:id',
            name: 'salle_de_bain',
            component: () => import('@/components/Realisation.vue')
        },
        {
            path: '/actualites',
            name: 'actualites',
            component: () => import('@/components/Actualites.vue')
        },
        {
            path: '/admin/:password',
            name: 'admin',
            component: () => import('@/components/Admin.vue')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/components/PageNotFound.vue')
        }
    ]
})
