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
        <div class="group flex items-center gap-1">
          <div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
            <img
              src="/images/scfLogo.png"
              alt="SCF Logo"
              class="h-6 w-6"
            />
          </div>
          <div class="flex flex-col leading-none">
            <span :class="isOverlay ? 'text-base font-black tracking-tighter text-white' : 'text-base font-black tracking-tighter text-neutral-900 dark:text-white'">SCF</span>
          </div>
        </div>

        <!-- Main Desktop Nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <router-link
            v-for="item in mainDesktopNavigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
            :class="isOverlay ? (route.path === item.to ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white') : (route.path === item.to ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white')"
          >
            <Home v-if="item.to === '/'" :size="12" />
            <Store v-else-if="item.to === '/shop'" :size="12" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right Side Nav/Actions -->
        <div class="flex items-center gap-2">
          <!-- Cart Link (icon only, visible on mobile too) -->
          <router-link
            to="/cart"
            class="flex relative h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all"
            :class="route.path === '/cart' ? 'bg-amber-400 text-neutral-900' : (isOverlay ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white')"
          >
            <ShoppingCart :size="18" />
            <span v-if="cartCount > 0" class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[8px] font-black text-white  dark:border-neutral-900">
              {{ cartCount }}
            </span>
          </router-link>

          <div :class="isOverlay ? 'h-5 w-px mx-1.5 bg-white/20' : 'h-5 w-px bg-neutral-300 mx-1.5 dark:bg-neutral-700'"></div>

          <!-- User Section -->
          <div class="flex items-center gap-1.5">
            <template v-if="isAuthenticated">
              <router-link
                to="/account/orders"
                class="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all"
                :class="isOverlay ? (route.path === '/account/orders' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white') : (route.path === '/account/orders' ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white')"
              >
                <Package :size="12" />
                <span class="hidden lg:inline">Order History</span>
              </router-link>

              <router-link
                to="/account/profile"
                class="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all"
                :class="isOverlay ? (route.path === '/account/profile' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white') : (route.path === '/account/profile' ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white')"
              >
                <User :size="12" />
                <span class="hidden lg:inline">Profile</span>
              </router-link>

              <div :class="isOverlay ? 'h-5 w-px mx-1.5 hidden md:block bg-white/20' : 'h-5 w-px bg-neutral-300 mx-1.5 hidden md:block dark:bg-neutral-700'"></div>

              <button
                type="button"
                :class="isOverlay ? 'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/70 transition-all hover:bg-white/10 hover:text-rose-300 active:scale-95' : 'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'"
                @click="handleLogout"
                title="Logout"
              >
                <LogOut :size="14" />
                <span>Logout</span>
              </button>
            </template>

            <template v-else>
              <router-link
                to="/register"
                :class="isOverlay ? 'hidden items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95 sm:flex sm:px-5' : 'hidden items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-600 transition-all hover:bg-neutral-50 active:scale-95 sm:flex sm:px-5 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'"
              >
                <UserPlus :size="14" />
                <span class="hidden xs:inline sm:inline">Register</span>
              </router-link>

              <router-link
                to="/login"
                :class="isOverlay ? 'flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-neutral-950 transition-all hover:bg-amber-300 active:scale-95 sm:px-6' : 'flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 sm:px-6   dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300'"
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
      :class="(transparentHeader && headerProgress < 0.05) ? 'pointer-events-none translate-y-24 opacity-0' : 'translate-y-0 opacity-100'"
      class="fixed bottom-4 left-1/2 z-40 w-fit -translate-x-1/2 rounded-[20px] border border-white/40 bg-white/40 shadow-xl backdrop-blur-md transition-all duration-500 md:hidden dark:border-white/10 dark:bg-neutral-900/40"
    >
      <div class="flex items-center gap-1 px-3 py-2">
        <router-link
          v-for="item in mobileNavigation"
          :key="item.to"
          :to="item.to"
          class="relative flex min-h-11 flex-col items-center justify-center px-5 py-2 transition-all active:scale-95"
          :class="route.path === item.to ? 'text-neutral-900 dark:text-amber-400' : 'text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white'"
        >
          <!-- Icon -->
          <div class="flex items-center justify-center">
            <template v-if="item.to === '/'"><Home :size="20" /></template>
            <template v-else-if="item.to === '/shop'"><Store :size="20" /></template>
            <template v-else-if="item.to === '/login' || item.to === '/account/profile'"><User :size="20" /></template>
            <template v-else-if="item.to === '/register'"><UserPlus :size="20" /></template>
            <template v-else-if="item.to === '/account/orders'"><Package :size="20" /></template>
            <template v-else-if="item.to.startsWith('/admin')"><LayoutDashboard :size="20" /></template>
          </div>
          <!-- Label -->
          <span class="text-[9px] font-bold mt-1 tracking-tight leading-none">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
})

const headerSolid = computed(() => headerProgress.value > 0.5)
// True while the header is still overlaid on the hero (white text); false once solid (dark text).
const isOverlay = computed(() => props.transparentHeader && !headerSolid.value)

const route = useRoute()
const router = useRouter()
const { isAuthenticated, isAdmin } = useSession()
const { cartCount } = useCartStore()

const navigation = computed(() => {
  const base = [{ to: '/', label: 'Home' }, { to: '/shop', label: 'Shop' }]

  if (isAuthenticated.value) {
    base.push(
      { to: '/account/profile', label: 'Profile' },
      { to: '/account/orders', label: 'Orders' },
    )
  } else {
    base.push(
      { to: '/register', label: 'Register' },
      { to: '/login', label: 'Login' }
    )
  }

  if (isAdmin.value) {
    base.push(
      { to: '/admin/dashboard', label: 'Admin' },
      { to: '/admin/categories', label: 'Categories' },
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/orders', label: 'Manage Orders' },
    )
  }

  return base
})

const mobileNavigation = computed(() => {
  const items = [
    navigation.value.find(i => i.to === '/'),
    navigation.value.find(i => i.to === '/shop'),
  ]

  if (isAuthenticated.value) {
    items.push(navigation.value.find(i => i.to === '/account/orders'))
    if (isAdmin.value) {
      items.push(navigation.value.find(i => i.to === '/admin/dashboard'))
    } else {
      items.push(navigation.value.find(i => i.to === '/account/profile'))
    }
  }

  return items.filter(Boolean).slice(0, 5)
})

const mainDesktopNavigation = computed(() => {
  return navigation.value.filter(item =>
    item.to === '/' || item.to === '/shop'
  )
})

const rightDesktopNavigation = computed(() => {
  return navigation.value.filter(item =>
    !item.to.startsWith('/admin') && item.to !== '/' && item.to !== '/shop'
  )
})

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>
