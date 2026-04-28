import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../Firebase/Firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from '../services/store'

// main
import LandingPage from '../views/LandingPage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// User
import PreOrder from '../views/User/PreOrder.vue'

// Admin
import Dashboard from '../views/Admin/Dashboard.vue'
import UserManagement from '../views/Admin/UserManagement.vue'
import AdminPreOrder from '../views/Admin/Pre-Order.vue'
import AdminSettings from '../views/Admin/Settings.vue'

const routes = [
  
  // main
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },

  // user
  {
    path: '/user/preorder',
    name: 'PreOrder',
    component: PreOrder,
    meta: {
      requiresAuth: true,
      role: 'user'
    }
  },

  // admin
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/pre-order',
    name: 'AdminPreOrder',
    component: AdminPreOrder,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettings,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// WAIT FOR FIREBASE AUTH
// This prevents auto logout issue and keeps user session persistent
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

// auth + role guard

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  // Public routes
  if (!requiresAuth) {
    return next()
  }

  // Wait for Firebase auth session
  const user = await getCurrentUser()

  // Not logged in
  if (!user) {
    alert('Please login first')
    return next('/login')
  }

  // Check role
  const profile = await getUserProfile(user.uid)
  const userRole = profile?.role || 'user'

  // Role mismatch
  if (requiredRole && userRole !== requiredRole) {
    alert('Access denied')
    return next('/')
  }

  next()
})

export default router