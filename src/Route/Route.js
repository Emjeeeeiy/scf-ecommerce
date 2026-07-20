import { createRouter, createWebHistory } from 'vue-router'
import { useSession, waitForSessionReady } from '../composables/useSession'

// Route components are lazy-loaded so the initial bundle only ships what the
// landing page needs; each view (and anything it alone depends on, like
// chart.js for the admin dashboard) is fetched on first visit to its route.
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/shop',
    name: 'Catalog',
    component: () => import('../views/Shop/Catalog.vue'),
  },
  {
    path: '/shop/product/:productId',
    name: 'ProductDetails',
    component: () => import('../views/Shop/ProductDetails.vue'),
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Shop/Cart.vue'),
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Shop/Checkout.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/account/profile',
    name: 'Profile',
    component: () => import('../views/Account/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/account/orders',
    name: 'Orders',
    component: () => import('../views/Account/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: () => import('../views/Admin/Categories.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('../views/Admin/Products.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('../views/Admin/Orders.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/Admin/Users.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('../views/Admin/Settings.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  await waitForSessionReady()

  const { authUser, isAdmin } = useSession()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !authUser.value) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (guestOnly && authUser.value) {
    return isAdmin.value ? '/admin/dashboard' : '/shop'
  }

  if (requiresAdmin && !isAdmin.value) {
    return '/shop'
  }
})

export default router
