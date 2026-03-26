// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 前台路由 (公開展示)
export const frontendRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/frontend/HomeView.vue'),
  },
  {
    path: '/properties',
    name: 'properties',
    component: () => import('@/views/frontend/PropertyDisplay.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/frontend/AboutView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/frontend/ContactView.vue'),
  },
]

// 後台路由 (管理系統)
export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/backend/ProjectsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/add',
    name: 'add-project',
    component: () => import('@/views/backend/ProjectFormView.vue'),
  },
  {
    path: '/admin/edit/:id',
    name: 'edit-project',
    component: () => import('@/views/backend/ProjectFormView.vue'),
    props: true,
  },
]

// 本地開發時使用全部路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...frontendRoutes, ...adminRoutes],
})

export default router
