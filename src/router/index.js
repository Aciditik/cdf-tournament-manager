import { createRouter, createWebHistory } from 'vue-router'
import Registration from '@/views/Registration.vue'
import Login from '@/views/Login.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Scorecard from '@/views/Scorecard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'registration',
      component: Registration
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPanel,
      meta: { requiresAuth: true }
    },
    {
      path: '/scorecard',
      name: 'scorecard',
      component: Scorecard
    }
  ]
})

// Handle GitHub Pages redirect
const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect) {
  window.history.replaceState({}, '', redirect)
  window.location.href = redirect
}

// Auth guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true'
    if (!isLoggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router