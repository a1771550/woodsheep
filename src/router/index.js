import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/ProjectFormView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/ProjectFormView.vue'),
    },
  ],
})

export default router
