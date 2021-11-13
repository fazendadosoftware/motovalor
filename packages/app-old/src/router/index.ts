import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: async () => await import('@/views/Home.vue')
  },
  {
    path: '/models',
    name: 'models',
    component: async () => await import('@/views/Models.vue')
  },
  {
    path: '/filters',
    name: 'filters',
    redirect: '/filters/current',
    component: async () => await import('@/views/FiltersView.vue'),
    children: [
      { path: 'current', name: 'currentFilter', component: async () => await import('@/components/TabFiltersCurrent.vue') },
      { path: 'saved', name: 'savedFilters', component: async () => await import('@/components/TabFiltersSaved.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
