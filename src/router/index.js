// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 后台路由
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/backend/ProjectsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/add',
    name: 'AddProject',
    component: () => import('@/views/backend/ProjectFormView.vue'),
  },
  {
    path: '/admin/edit/:id',
    name: 'EditProject',
    component: () => import('@/views/backend/ProjectFormView.vue'),
    props: true,
  },

  // 前台路由
  {
    path: '/woodsheep',
    name: 'Home',
    component: () => import('@/views/frontend/HomeView.vue'),
  },
  {
    path: '/properties',
    name: 'Properties',
    component: () => import('@/views/frontend/PropertyDisplay.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/frontend/AboutView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
