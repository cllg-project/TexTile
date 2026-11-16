import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/homepage' },
    { path: '/catalog', name: 'catalog', component: () => import('../views/Catalog.vue') },
    { path: '/collection/:id', name: 'collection', component: () => import('../views/Collection.vue'), props: true },
    { path: '/doc/:resource', name: 'document', component: () => import('../views/DocumentView.vue'), props: true },
    { path: '/doc/:resource/p/:ref', name: 'documentRef', component: () => import('../views/DocumentView.vue'), props: true },
    { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
    { path: '/homepage', name: 'homepage', component: () => import('@/views/About.vue') },
    { path: '/about', name: 'project-info', component: () => import('@/views/ProjectInfo.vue') },
  ],
})

export default router
