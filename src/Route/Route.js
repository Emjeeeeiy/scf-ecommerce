import { createRouter, createWebHistory } from 'vue-router'
import { useSession, waitForSessionReady } from '../composables/useSession'
import LoginPage from '../views/Login.vue'
import RegisterPage from '../views/Register.vue'
import LandingPage from '../views/LandingPage.vue'
import CatalogPage from '../views/Shop/Catalog.vue'
import ProductDetailsPage from '../views/Shop/ProductDetails.vue'
import CartPage from '../views/Shop/Cart.vue'
import CheckoutPage from '../views/Shop/Checkout.vue'
import ProfilePage from '../views/Account/Profile.vue'
import OrdersPage from '../views/Account/Orders.vue'
import Dashboard from '../views/Admin/Dashboard.vue'
import AdminCategories from '../views/Admin/Categories.vue'
import AdminProducts from '../views/Admin/Products.vue'
import AdminOrders from '../views/Admin/Orders.vue'
import AdminSettings from '../views/Admin/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
  },
  {
    path: '/shop',
    name: 'Catalog',
    component: CatalogPage
  },
  {
    path: '/shop/product/:productId',
    name: 'ProductDetails',
    component: ProductDetailsPage,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guestOnly: true }
  },
  {
    path: '/account/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/orders',
    name: 'Orders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: AdminCategories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettings,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
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