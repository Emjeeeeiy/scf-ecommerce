<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900">
    <!-- Desktop Header -->
    <header class="sticky top-0 z-40 w-full border-b border-neutral-300 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <div class="group flex items-center gap-1">
          <div class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
            <img 
              src="/scfLogo.png" 
              alt="SCF Logo" 
              class="h-6 w-6"
            />
          </div>
          <div class="flex flex-col leading-none">
            <span class="text-base font-black tracking-tighter text-neutral-900">SCF</span>
          </div>
        </div>

        <!-- Main Desktop Nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <router-link
            v-for="item in mainDesktopNavigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
            :class="route.path === item.to ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/20' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'"
          >
            <Home v-if="item.to === '/'" :size="12" />
            <Store v-else-if="item.to === '/shop'" :size="12" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right Side Nav/Actions -->
        <div class="flex items-center gap-2">
          <!-- Cart Link (Dedicated) - Hidden on Mobile (moved to bottom bar) -->
          <router-link
            to="/cart"
            class="hidden md:flex relative h-9 w-9 items-center justify-center rounded-lg transition-all"
            :class="route.path === '/cart' ? 'bg-amber-400 text-neutral-900 shadow-xl shadow-amber-400/20' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'"
          >
            <ShoppingCart :size="18" />
            <span v-if="cartCount > 0" class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-[8px] font-black text-white shadow-sm">
              {{ cartCount }}
            </span>
          </router-link>

          <div class="h-5 w-px bg-neutral-300 mx-1.5"></div>

          <!-- User Section -->
          <div class="flex items-center gap-1.5">
            <template v-if="isAuthenticated">
              <router-link
                to="/account/orders"
                class="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all"
                :class="route.path === '/account/orders' ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/20' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'"
              >
                <Package :size="12" />
                <span class="hidden lg:inline">Order History</span>
              </router-link>
              
              <router-link
                to="/account/profile"
                class="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all"
                :class="route.path === '/account/profile' ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/20' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'"
              >
                <User :size="12" />
                <span class="hidden lg:inline">Profile</span>
              </router-link>

              <div class="h-5 w-px bg-neutral-300 mx-1.5 hidden md:block"></div>

              <button
                type="button"
                class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
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
                class="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-neutral-600 transition-all hover:bg-neutral-50 active:scale-95 sm:px-4"
              >
                <UserPlus :size="12" />
                <span class="hidden xs:inline sm:inline">Register</span>
              </router-link>
              
              <router-link
                to="/login"
                class="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-xl shadow-neutral-900/20"
              >
                <LogIn :size="12" />
                <span>Login</span>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:pb-8">
      <slot />
    </main>

    <!-- Mobile Navigation -->
    <nav class="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 bg-white md:hidden">
      <div class="flex items-center justify-around py-2 px-1">
        <router-link
          v-for="item in mobileNavigation"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95"
          :class="route.path === item.to ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'"
        >
          <!-- Icon -->
          <div class="flex items-center justify-center">
            <template v-if="item.to === '/'"><Home :size="20" /></template>
            <template v-else-if="item.to === '/shop'"><Store :size="20" /></template>
            <template v-else-if="item.to === '/cart'">
              <div class="relative">
                <ShoppingCart :size="20" />
                <span v-if="cartCount > 0" class="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-amber-400 text-[8px] font-black text-neutral-900 shadow-sm">
                  {{ cartCount }}
                </span>
              </div>
            </template>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logoutUser } from '../services/authService'
import { useSession } from '../composables/useSession'
import { useCart } from '../composables/useCart'
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

defineProps({
  subtitle: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const { isAuthenticated, isAdmin } = useSession()
const { cartCount } = useCart()

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
    { to: '/cart', label: 'Cart' }
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