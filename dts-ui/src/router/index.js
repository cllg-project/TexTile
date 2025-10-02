import { createRouter, createWebHistory } from 'vue-router'
import Catalog from '../views/Catalog.vue'
import Collection from '../views/Collection.vue'
import DocumentView from '../views/DocumentView.vue'
import SearchView from '@/views/SearchView.vue'
import About from '@/views/About.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/catalog' },
    { path: '/catalog', name: 'catalog', component: Catalog },
    { path: '/collection/:id', name: 'collection', component: Collection, props: true },
    { path: '/doc/:resource', name: 'document', component: DocumentView, props: true },
    { path: '/doc/:resource/p/:ref', name: 'documentRef', component: DocumentView, props: true },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/about', name: 'about', component: About },
  ],
})

export default router
