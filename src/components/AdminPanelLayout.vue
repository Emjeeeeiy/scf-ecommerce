<template>
  <div :class="{ 'dark': isDarkMode }" class="h-screen overflow-hidden font-sans">
    <div class="grid h-full lg:grid-cols-[240px_minmax(0,1fr)] bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <aside class="hidden h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 lg:block shadow-sm">
        <div class="flex h-full flex-col overflow-y-auto px-5 py-6">

          <div class="rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/50 p-4">
            <div class="flex items-center gap-2.5">
              <div class="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <User :size="14" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-neutral-950 dark:text-white">
                  {{ profile?.username || profile?.email || 'Administrator' }}
                </p>
                <p class="text-[9px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {{ profile?.role || 'admin' }}
                </p>
              </div>
            </div>
          </div>

          <nav class="mt-6 space-y-1">
            <p class="px-3 mb-2 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Main Menu</p>
            <router-link
              v-for="item in adminNavigation"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200"
              :class="isActive(item.to)
                ? 'bg-neutral-900 dark:bg-neutral-400 text-white dark:text-neutral-950 shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-white'"
            >
              <div class="relative">
                <component :is="item.icon" :size="16" :class="isActive(item.to) ? '' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'" />
                <span 
                  v-if="item.label === 'Orders' && unseenOrdersCount > 0" 
                  class="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-neutral-900"
                >
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                </span>
                <span 
                  v-if="item.label === 'Users' && unseenUsersCount > 0" 
                  class="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-neutral-900"
                >
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold tracking-tight">{{ item.label }}</p>
              </div>
              <span
                v-if="item.tag"
                class="rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                :class="isActive(item.to) ? 'bg-white/10 dark:bg-black/10' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'"
              >
                {{ item.tag }}
              </span>
            </router-link>
          </nav>

          <div class="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
            <router-link
              to="/shop"
              class="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 transition shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.98]"
            >
              <ExternalLink :size="12" />
              View storefront
            </router-link>
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 dark:bg-neutral-400 px-3 py-2.5 text-[10px] font-bold text-white dark:text-neutral-950 transition shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-300 active:scale-[0.98]"
              @click="handleLogout"
            >
              <LogOut :size="12" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div class="flex h-screen min-w-0 flex-col">
        <!-- Top Bar for Mobile & Desktop -->
        <header class="shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
          <div class="flex items-center justify-between px-6 py-4 lg:py-5">
            <!-- Section Info -->
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                <component :is="currentSection.icon" :size="10" />
                <span>{{ currentSection.label }}</span>
              </div>
              <h2 class="mt-0.5 text-lg font-black text-neutral-950 dark:text-white tracking-tight truncate">{{ currentSection.label }}</h2>
            </div>

            <!-- Mobile: Quick Actions / Logout -->
            <div class="flex items-center gap-2 lg:hidden">
              <router-link 
                to="/shop" 
                class="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700"
              >
                <ExternalLink :size="18" />
              </router-link>
              <button 
                @click="handleLogout"
                class="p-2.5 rounded-xl bg-neutral-950 dark:bg-neutral-400 text-white dark:text-neutral-950 shadow-sm"
              >
                <LogOut :size="18" />
              </button>
            </div>

            <!-- Desktop: Action Buttons -->
            <div class="hidden flex-wrap gap-2 lg:flex">
              <router-link
                v-for="action in headerActions"
                :key="action.to"
                :to="action.to"
                class="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 transition shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.98]"
              >
                <Plus v-if="action.label.toLowerCase().includes('add')" :size="12" />
                <ArrowLeft v-else-if="action.label.toLowerCase().includes('back')" :size="12" />
                <ExternalLink v-else :size="12" />
                {{ action.label }}
              </router-link>
            </div>
          </div>
          
          <!-- Desktop only Subtitle -->
          <div class="hidden lg:block px-6 pb-4">
            <p class="max-w-2xl text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              {{ subtitle || currentSection.description }}
            </p>
          </div>
        </header>

        <main class="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-neutral-950 px-6 py-6 pb-24 lg:pb-6">
          <div class="mx-auto max-w-6xl">
            <slot />
          </div>
        </main>

        <!-- Mobile Bottom Navigation -->
        <nav class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-2 py-3 backdrop-blur-lg lg:hidden">
          <router-link
            v-for="item in adminNavigation"
            :key="`mobile-nav-${item.to}`"
            :to="item.to"
            class="relative flex flex-col items-center gap-1 px-3 py-1 transition-all"
            :class="isActive(item.to) ? 'text-neutral-950 dark:text-neutral-400' : 'text-neutral-400 dark:text-neutral-500'"
          >
            <component :is="item.icon" :size="20" :stroke-width="isActive(item.to) ? 2.5 : 2" />
            <span class="text-[8px] font-black uppercase tracking-tighter">{{ item.label }}</span>
            
            <span 
              v-if="item.label === 'Orders' && unseenOrdersCount > 0" 
              class="absolute top-0 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 shadow-sm"
            >
              {{ unseenOrdersCount }}
            </span>

            <span 
              v-if="item.label === 'Users' && unseenUsersCount > 0" 
              class="absolute top-0 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-neutral-900 shadow-sm"
            >
              {{ unseenUsersCount }}
            </span>
            
            <div 
              v-if="isActive(item.to)"
              class="absolute -bottom-3 h-1 w-6 rounded-t-full bg-neutral-950 dark:bg-neutral-400"
            ></div>
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  ShoppingCart, 
  User, 
  LogOut, 
  ExternalLink,
  Plus,
  ArrowLeft,
  Settings2,
  Users
} from 'lucide-vue-next'
import { useSession } from '../composables/useSession'
import { logoutUser } from '../services/authService'
import { useAdminTheme } from '../composables/useAdminTheme'
import { useOrderNotification } from '../composables/useOrderNotification'
import { useUserNotification } from '../composables/useUserNotification'

defineProps({
  subtitle: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const { profile } = useSession()
const { isDarkMode } = useAdminTheme()
const { unseenOrdersCount } = useOrderNotification()
const { unseenUsersCount } = useUserNotification()

const adminNavigation = [
  {
    to: '/admin/dashboard',
    label: 'Overview',
    tag: 'Hub',
    icon: LayoutDashboard,
    description: 'Monitor metrics, activity, and admin priorities.',
  },
  {
    to: '/admin/users',
    label: 'Users',
    tag: 'Community',
    icon: Users,
    description: 'Manage accounts and customer profiles.',
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    tag: 'Taxonomy',
    icon: Layers,
    description: 'Shape the storefront structure customers browse.',
  },
  {
    to: '/admin/products',
    label: 'Products',
    tag: 'Catalog',
    icon: Package,
    description: 'Manage listings, images, pricing, and variants.',
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    tag: 'Ship',
    icon: ShoppingCart,
    description: 'Handle status flow and fulfillment progress.',
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    tag: 'Config',
    icon: Settings2,
    description: 'Manage storefront content and system preferences.',
  },
]

const isActive = (target) => route.path === target

const currentSection = computed(
  () => adminNavigation.find((item) => item.to === route.path) || adminNavigation[0],
)

const headerActions = computed(() => {
  if (route.path === '/admin/dashboard') {
    return [
      { to: '/admin/products', label: 'Add product' },
      { to: '/admin/categories', label: 'Edit categories' },
      { to: '/admin/orders', label: 'Open orders' },
    ]
  }

  return [
    { to: '/admin/dashboard', label: 'Back to dashboard' },
    { to: '/shop', label: 'View storefront' },
  ]
})

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>

