import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../Firebase/Firebase'

// Main
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/Login.vue'

// User
import PreOrder from '../views/User/PreOrder.vue'

// Admin 
import Dashboard from '../views/Admin/Dashboard.vue'

const routes = [
  // Public
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },

 // User
  {
    path: '/user',
    children: [
      {
        path: 'pre-order',
        name: 'PreOrder',
        component: PreOrder
      }
    ]
  },

  // Admin 
  {
    path: '/admin',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Navigation Guard

// Protect admin routes from normal users


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const user = auth.currentUser

    if (!user) {
      alert('Please login first as Admin')
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router