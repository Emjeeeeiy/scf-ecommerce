<template>
  <div :class="{ 'dark': isDarkMode }" class="h-screen overflow-hidden font-sans">
    <div class="grid h-full lg:grid-cols-[240px_minmax(0,1fr)] bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <aside class="hidden h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:block shadow-sm">
        <div class="flex h-full flex-col overflow-y-auto px-5 py-6">
          <div class="border-b border-slate-100 dark:border-slate-800 pb-5 flex items-center gap-2.5">
            <div class="bg-slate-900 dark:bg-amber-400 p-1.5 rounded-lg text-white dark:text-slate-950">
              <LayoutDashboard :size="18" />
            </div>
            <div>
              <router-link to="/shop" class="text-sm font-bold text-slate-950 dark:text-white tracking-tight">
                SCF Admin
              </router-link>
              <p class="text-[9px] font-medium text-slate-500 dark:text-slate-400">Workspace Management</p>
            </div>
          </div>

          <div class="mt-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4 shadow-sm">
            <div class="flex items-center gap-2.5">
              <div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <User :size="14" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-slate-950 dark:text-white">
                  {{ profile?.username || profile?.email || 'Administrator' }}
                </p>
                <p class="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ profile?.role || 'admin' }}
                </p>
              </div>
            </div>
          </div>

          <nav class="mt-6 space-y-1">
            <p class="px-3 mb-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Main Menu</p>
            <router-link
              v-for="item in adminNavigation"
              :key="item.to"
              :to="item.to"
              class="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200"
              :class="isActive(item.to)
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'"
            >
              <component :is="item.icon" :size="16" :class="isActive(item.to) ? '' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'" />
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold tracking-tight">{{ item.label }}</p>
              </div>
              <span
                v-if="item.tag"
                class="rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                :class="isActive(item.to) ? 'bg-white/10 dark:bg-black/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'"
              >
                {{ item.tag }}
              </span>
            </router-link>
          </nav>

          <div class="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <router-link
              to="/shop"
              class="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]"
            >
              <ExternalLink :size="12" />
              View storefront
            </router-link>
            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 dark:bg-amber-400 px-3 py-2.5 text-[10px] font-bold text-white dark:text-slate-950 transition shadow-sm hover:bg-slate-800 dark:hover:bg-amber-300 active:scale-[0.98]"
              @click="handleLogout"
            >
              <LogOut :size="12" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div class="flex h-screen min-w-0 flex-col">
        <header class="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div class="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <component :is="currentSection.icon" :size="10" />
                <span>{{ currentSection.label }}</span>
              </div>
              <h2 class="mt-0.5 text-lg font-black text-slate-950 dark:text-white tracking-tight">{{ currentSection.label }}</h2>
              <p class="mt-0.5 max-w-2xl text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {{ subtitle || currentSection.description }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 lg:hidden">
              <router-link
                v-for="item in adminNavigation"
                :key="`mobile-${item.to}`"
                :to="item.to"
                class="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <component :is="item.icon" :size="12" />
                {{ item.label }}
              </router-link>
            </div>

            <div class="hidden flex-wrap gap-2 lg:flex">
              <router-link
                v-for="action in headerActions"
                :key="action.to"
                :to="action.to"
                class="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]"
              >
                <Plus v-if="action.label.toLowerCase().includes('add')" :size="12" />
                <ArrowLeft v-else-if="action.label.toLowerCase().includes('back')" :size="12" />
                <ExternalLink v-else :size="12" />
                {{ action.label }}
              </router-link>
            </div>
          </div>
        </header>

        <main class="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-slate-950 px-6 py-6">
          <div class="mx-auto max-w-6xl">
            <slot />
          </div>
        </main>
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
  Settings2
} from 'lucide-vue-next'
import { useSession } from '../composables/useSession'
import { logoutUser } from '../services/authService'
import { useAdminTheme } from '../composables/useAdminTheme'

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

const adminNavigation = [
  {
    to: '/admin/dashboard',
    label: 'Overview',
    tag: 'Hub',
    icon: LayoutDashboard,
    description: 'Monitor metrics, activity, and admin priorities.',
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

