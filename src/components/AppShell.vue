<template>
  <div
    class="store-scope min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900"
  >
    <!-- Desktop Header -->
    <header
      ref="headerRef"
      :class="transparentHeader ? 'fixed top-0 inset-x-0 z-40 w-full border-b border-transparent' : 'sticky top-0 z-40 w-full border-b border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900'"
    >
      <!-- Transparent state: subtle white hairline over hero photo -->
      <div v-if="transparentHeader" class="pointer-events-none absolute inset-0 border-b border-white/10"></div>
      <!-- Solid state: white bg fading in with scroll, complete once outside hero -->
      <div
        v-if="transparentHeader"
        class="pointer-events-none absolute inset-0 border-b border-neutral-300 bg-white backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900"
        :style="{ opacity: headerProgress }"
      ></div>
      <div class="relative flex min-h-17 w-full items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-12">
        <router-link to="/" aria-label="SCF home" class="flex items-center gap-1 rounded-lg" :class="overlayFocus">
          <span class="flex h-9 w-9 items-center justify-center">
            <img src="/images/scfLogo.png" alt="" class="h-6 w-6" />
          </span>
          <span
            class="text-base font-bold leading-none tracking-tighter"
            :class="isOverlay ? 'text-white' : 'text-neutral-900 dark:text-white'"
          >SCF</span>
        </router-link>

        <!-- Main Desktop Nav: absolutely centered so it never shifts when cart/actions appear -->
        <nav aria-label="Main" class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          <router-link
            v-for="item in mainDesktopNavigation"
            :key="item.to"
            :to="item.to"
            :aria-current="route.path === item.to ? 'page' : undefined"
            class="relative pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:content-[''] after:transition-all"
            :class="[desktopNavClass(item.to), overlayFocus]"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Right Side Nav/Actions -->
        <div class="flex items-center gap-2">
          <!-- Cart: always on shopping pages, and everywhere once it holds items -->
          <router-link
            v-if="showCart"
            to="/cart"
            :aria-label="cartLabel"
            :aria-current="route.path === '/cart' ? 'page' : undefined"
            class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors"
            :class="[cartClass, overlayFocus]"
          >
            <ShoppingCart :size="18" />
            <span
              v-if="cartCount > 0"
              class="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-neutral-900 px-1 text-[10px] font-bold leading-none text-white dark:border-neutral-900"
              :class="{ 'cart-badge-bump': badgeBump }"
            >
              {{ cartBadge }}
            </span>
          </router-link>

          <div v-if="showCart" class="mx-1.5 h-5 w-px" :class="dividerClass"></div>

          <!-- User Section -->
          <div class="flex items-center gap-1.5">
            <template v-if="isAuthenticated">
              <router-link
                v-for="link in accountLinks"
                :key="link.to"
                :to="link.to"
                :aria-label="link.label"
                :aria-current="route.path === link.to ? 'page' : undefined"
                class="hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors md:flex"
                :class="[actionClass(isCurrent(link.to)), overlayFocus]"
              >
                <component :is="link.icon" :size="14" />
                <span class="hidden lg:inline">{{ link.label }}</span>
              </router-link>

              <div class="mx-1.5 hidden h-5 w-px md:block" :class="dividerClass"></div>

              <button
                type="button"
                class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors active:scale-95"
                :class="[logoutClass, overlayFocus]"
                @click="handleLogout"
              >
                <LogOut :size="14" />
                <span>Logout</span>
              </button>
            </template>

            <template v-else>
              <router-link
                to="/register"
                class="hidden items-center gap-2 rounded-lg border px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors active:scale-95 sm:flex sm:px-5"
                :class="[registerClass, overlayFocus]"
              >
                <UserPlus :size="14" />
                <span>Register</span>
              </router-link>

              <router-link
                to="/login"
                class="flex items-center gap-2 rounded-lg px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors active:scale-95 sm:px-6"
                :class="[loginClass, overlayFocus]"
              >
                <LogIn :size="14" />
                <span>Login</span>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main :class="transparentHeader ? 'w-full px-4 pt-0 pb-24 sm:px-6 lg:px-12 md:pb-8' : 'w-full px-4 py-6 pb-24 sm:px-6 lg:px-12 md:pb-8'">
      <slot />
    </main>

    <!-- Mobile Navigation -->
    <nav
      aria-label="Primary"
      :class="(transparentHeader && headerProgress < 0.05) ? 'pointer-events-none translate-y-24 opacity-0' : 'translate-y-0 opacity-100'"
      class="fixed bottom-4 left-1/2 z-40 w-fit -translate-x-1/2 rounded-full border border-neutral-200 bg-white/70 shadow-xl backdrop-blur-md transition-all duration-500 md:hidden dark:border-neutral-700 dark:bg-neutral-900/60"
    >
      <div class="flex items-center gap-1 px-3 py-2">
        <router-link
          v-for="item in mobileNavigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="relative flex min-h-11 flex-col items-center justify-center rounded-full px-4 py-2 transition-all active:scale-95"
          :class="isCurrent(item.to) ? 'text-neutral-900 dark:text-amber-400' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'"
        >
          <component :is="item.icon" :size="20" :stroke-width="isCurrent(item.to) ? 2.25 : 2" />
          <span class="mt-1 text-[11px] font-semibold leading-none tracking-tight">{{ item.label }}</span>
          <span
            v-if="isCurrent(item.to)"
            class="absolute bottom-0.5 h-1 w-1 rounded-full bg-amber-500"
            aria-hidden="true"
          ></span>
        </router-link>
        <button
          v-if="isAuthenticated"
          type="button"
          class="relative flex min-h-11 flex-col items-center justify-center rounded-full px-4 py-2 text-neutral-500 transition-all hover:text-rose-500 active:scale-95 dark:text-neutral-400 dark:hover:text-rose-400"
          @click="handleLogout"
        >
          <LogOut :size="20" />
          <span class="mt-1 text-[11px] font-semibold leading-none tracking-tight">Logout</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logoutUser } from '../services/authService'
import { useSession } from '../composables/useSession'
import { useCartStore } from '../stores/cartStore'
import {
  ShoppingCart,
  User,
  Home,
  Store,
  Package,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-vue-next'

const props = defineProps({
  subtitle: {
    type: String,
    default: '',
  },
  transparentHeader: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const { isAuthenticated, isAdmin } = useSession()
const { cartCount } = useCartStore()

// Sticky overlay header: transparent over hero, fades to solid white once past hero.
// headerProgress 0 = fully transparent (inside hero top), 1 = fully solid (outside hero).
const headerRef = ref(null)
const headerProgress = ref(0)

const updateHeaderProgress = () => {
  if (!props.transparentHeader) {
    headerProgress.value = 1
    return
  }
  const y = window.scrollY || window.pageYOffset || 0
  const hero = document.getElementById('hero')
  const headerH = headerRef.value?.offsetHeight || 68
  if (!hero) {
    headerProgress.value = Math.min(y / 200, 1)
    return
  }
  const heroH = hero.offsetHeight || window.innerHeight
  const range = Math.max(heroH - headerH, 1)
  headerProgress.value = Math.min(Math.max(y / range, 0), 1)
}

onMounted(() => {
  updateHeaderProgress()
  window.addEventListener('scroll', updateHeaderProgress, { passive: true })
  window.addEventListener('resize', updateHeaderProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeaderProgress)
  window.removeEventListener('resize', updateHeaderProgress)
  clearTimeout(bumpTimer)
})

const headerSolid = computed(() => headerProgress.value > 0.5)
// True while the header is still overlaid on the hero (white text); false once solid (dark text).
const isOverlay = computed(() => props.transparentHeader && !headerSolid.value)

// The default dark focus ring disappears on the hero photo; switch to white there.
const overlayFocus = computed(() => (isOverlay.value ? 'focus-visible:outline-white' : ''))

// "/shop" stays active on product pages, "/account/orders" on an order's details.
const isCurrent = (to) =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)

const isShopRoute = computed(() =>
  route.path.startsWith('/shop') || route.path === '/cart' || route.path === '/checkout'
)

// Cart belongs on shopping pages, and follows the shopper everywhere once it holds items.
const showCart = computed(() => isShopRoute.value || cartCount.value > 0)
const cartBadge = computed(() => (cartCount.value > 99 ? '99+' : String(cartCount.value)))
const cartLabel = computed(() =>
  cartCount.value > 0
    ? `Cart, ${cartCount.value} ${cartCount.value === 1 ? 'item' : 'items'}`
    : 'Cart'
)

// Small bump on the badge whenever something is added.
const badgeBump = ref(false)
let bumpTimer = null
watch(cartCount, (next, prev) => {
  if (next <= prev) return
  badgeBump.value = false
  // Re-adding the class on the next frame restarts the animation for rapid adds.
  requestAnimationFrame(() => {
    badgeBump.value = true
  })
  clearTimeout(bumpTimer)
  bumpTimer = setTimeout(() => {
    badgeBump.value = false
  }, 600)
})

const mainDesktopNavigation = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
]

const accountLinks = computed(() => [
  ...(isAdmin.value ? [{ to: '/admin/dashboard', label: 'Admin', icon: LayoutDashboard }] : []),
  { to: '/account/orders', label: 'Order History', icon: Package },
  { to: '/account/profile', label: 'Profile', icon: User },
])

const mobileNavigation = computed(() => {
  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Store },
  ]

  if (isAuthenticated.value) {
    items.push({ to: '/account/orders', label: 'Orders', icon: Package })
    items.push(
      isAdmin.value
        ? { to: '/admin/dashboard', label: 'Admin', icon: LayoutDashboard }
        : { to: '/account/profile', label: 'Profile', icon: User }
    )
  }

  return items
})

// Header styling has two states: overlaid on the hero photo, or the solid bar.
const desktopNavClass = (to) => {
  const active = isCurrent(to)
  if (isOverlay.value) {
    return active
      ? 'text-white after:bg-amber-400'
      : 'text-white/60 after:bg-transparent hover:text-white hover:after:bg-white/40'
  }
  return active
    ? 'text-neutral-900 after:bg-amber-500 dark:text-white dark:after:bg-amber-400'
    : 'text-neutral-500 after:bg-transparent hover:text-neutral-900 hover:after:bg-neutral-300 dark:text-neutral-400 dark:hover:text-white'
}

const actionClass = (active) => {
  if (isOverlay.value) {
    return active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }
  return active
    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
}

const cartClass = computed(() => {
  if (route.path === '/cart') return 'bg-amber-400 text-neutral-900'
  return isOverlay.value
    ? 'text-white/80 hover:bg-white/10 hover:text-white'
    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
})

const logoutClass = computed(() =>
  isOverlay.value
    ? 'text-white/70 hover:bg-white/10 hover:text-rose-300'
    : 'text-neutral-500 hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'
)

const registerClass = computed(() =>
  isOverlay.value
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
)

const loginClass = computed(() =>
  isOverlay.value
    ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
    : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300'
)

const dividerClass = computed(() => (isOverlay.value ? 'bg-white/20' : 'bg-neutral-300 dark:bg-neutral-700'))

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>

<style scoped>
.cart-badge-bump {
  animation: cart-badge-bump 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cart-badge-bump {
  40% {
    transform: scale(1.35);
  }
}
</style>
