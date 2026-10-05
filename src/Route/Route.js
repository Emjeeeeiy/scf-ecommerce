import { createRouter, createWebHistory } from 'vue-router'
import { useSession, waitForSessionReady } from '../composables/useSession'
import { getLenis } from '../utils/lenis'

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
  routes,
  // Reset scroll on navigation so one page's scroll position never leaks into another.
  // Routed through Lenis when available so jumps stay in sync with smooth scroll.
  scrollBehavior(to, _from, savedPosition) {
    const lenis = getLenis()
    if (savedPosition) {
      if (lenis) lenis.scrollTo(savedPosition.top, { immediate: true })
      return savedPosition
    }
    if (to.hash) {
      if (lenis) {
        lenis.scrollTo(to.hash, { duration: 1.4 })
        return false
      }
      return { el: to.hash, behavior: 'smooth' }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true })
    return { top: 0 }
  }
})

// A tap that hits a stale/missing lazy chunk (old PWA precache, partial deploy)
// otherwise fails silently and the button looks dead. Reload once to pull a
// fresh shell, then let later failures surface normally.
router.onError((error) => {
  const staleChunk = /loading chunk|failed to fetch dynamically|importing a module|chunkloaderror/i.test(
    error?.message || ''
  )
  if (staleChunk && !sessionStorage.getItem('chunk-reload')) {
    sessionStorage.setItem('chunk-reload', '1')
    window.location.reload()
  }
})

router.afterEach(() => {
  sessionStorage.removeItem('chunk-reload')
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
