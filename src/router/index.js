import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../views/ResultPage.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/DetailPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
