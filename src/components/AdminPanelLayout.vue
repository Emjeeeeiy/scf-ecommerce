<template>
  <div :class="{ 'dark': isDarkMode }" class="h-screen overflow-hidden font-sans">
    <div class="grid h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 lg:grid-cols-[248px_minmax(0,1fr)]">
      <!-- Sidebar (desktop) -->
      <aside class="hidden h-screen border-r border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:block">
        <div data-lenis-prevent class="flex h-full flex-col overflow-y-auto px-4 py-6">
          <!-- Brand -->
          <router-link to="/admin/dashboard" class="flex items-center gap-2.5 px-2">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <img src="/images/scfLogo.png" alt="SCF Logo" class="h-5 w-5" />
            </span>
            <span class="leading-none">
              <span class="block font-heading text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">SCF</span>
              <span class="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Admin</span>
            </span>
          </router-link>

          <!-- Nav groups -->
          <nav class="mt-8 space-y-6" aria-label="Admin sections">
            <div v-for="group in navGroups" :key="group.label">
              <p class="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                {{ group.label }}
              </p>
              <div class="space-y-0.5">
                <router-link
                  v-for="item in group.items"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition"
                  :class="isActive(item.to)
                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'"
                >
                  <component :is="item.icon" :size="17" class="shrink-0" />
                  <span class="flex-1 truncate">{{ item.label }}</span>
                  <span
                    v-if="badgeFor(item) > 0"
                    class="min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white"
                  >
                    {{ badgeFor(item) }}
                  </span>
                </router-link>
              </div>
            </div>
          </nav>

          <!-- Footer -->
          <div class="mt-auto pt-6">
            <div class="space-y-2 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
              <router-link
                to="/shop"
                class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <ExternalLink :size="17" class="shrink-0" />
                <span class="flex-1 truncate">View storefront</span>
              </router-link>
              <div class="flex items-center gap-2.5 rounded-lg bg-neutral-100 p-2 pl-2.5 dark:bg-neutral-800/70">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                  {{ userInitial }}
                </div>
                <div class="min-w-0 flex-1 leading-tight">
                  <p class="truncate text-xs font-bold text-neutral-900 dark:text-white">
                    {{ profile?.username || profile?.email || 'Administrator' }}
                  </p>
                  <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
                    {{ profile?.role || 'admin' }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="admin-btn admin-btn-quiet w-full"
                @click="handleLogout"
              >
                <LogOut :size="15" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex h-screen min-w-0 flex-col">
        <!-- Slim mobile bar (sidebar is desktop-only) -->
        <div class="flex items-center justify-between gap-3 border-b border-neutral-200/70 bg-white/70 px-4 py-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/70 lg:hidden">
          <router-link to="/admin/dashboard" class="flex items-center gap-2">
            <img src="/images/scfLogo.png" alt="SCF Logo" class="h-6 w-6" />
            <span class="font-heading text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              SCF <span class="font-medium text-neutral-400 dark:text-neutral-500">Admin</span>
            </span>
          </router-link>
          <div class="flex items-center gap-1.5">
            <router-link
              to="/shop"
              title="View storefront"
              aria-label="View storefront"
              class="admin-icon-btn h-9 w-9 border border-neutral-200 dark:border-neutral-700"
            >
              <ExternalLink :size="16" />
            </router-link>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              @click="handleLogout"
            >
              <LogOut :size="15" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <main data-lenis-prevent class="relative min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-10 lg:pb-10 lg:pt-8">
          <div class="relative mx-auto w-full max-w-6xl">
            <slot />
          </div>
        </main>

        <!-- Mobile bottom navigation -->
        <nav
          aria-label="Admin sections"
          class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/90 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-900/90 lg:hidden"
        >
          <div class="flex items-stretch">
            <router-link
              v-for="item in flatNav"
              :key="`mobile-nav-${item.to}`"
              :to="item.to"
              :aria-label="item.label"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              class="relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition"
              :class="isActive(item.to) ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'"
            >
              <span
                v-if="isActive(item.to)"
                class="absolute top-0 h-0.5 w-8 rounded-full bg-neutral-900 dark:bg-white"
              ></span>
              <span class="relative">
                <component :is="item.icon" :size="20" :stroke-width="isActive(item.to) ? 2.25 : 2" />
                <span
                  v-if="badgeFor(item) > 0"
                  class="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white"
                >
                  {{ badgeFor(item) }}
                </span>
              </span>
              <span class="hidden text-[9px] font-bold uppercase tracking-[0.08em] min-[420px]:block">{{ item.label }}</span>
            </router-link>
          </div>
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
  LogOut,
  ExternalLink,
  Settings2,
  Users
} from 'lucide-vue-next'
import { useSession } from '../composables/useSession'
import { logoutUser } from '../services/authService'
import { useAdminTheme } from '../composables/useAdminTheme'
import { useOrderNotification } from '../composables/useOrderNotification'
import { useUserNotification } from '../composables/useUserNotification'

const route = useRoute()
const router = useRouter()
const { profile } = useSession()
const { isDarkMode } = useAdminTheme()
const { unseenOrdersCount } = useOrderNotification()
const { unseenUsersCount } = useUserNotification()

const navGroups = [
  {
    label: 'General',
    items: [
      { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/admin/users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Store',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/categories', label: 'Categories', icon: Layers },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings2 },
    ],
  },
]

const flatNav = computed(() => navGroups.flatMap((group) => group.items))

const isActive = (target) => route.path === target

const badgeFor = (item) => {
  if (item.label === 'Orders') return unseenOrdersCount.value || 0
  if (item.label === 'Users') return unseenUsersCount.value || 0
  return 0
}

const userInitial = computed(() =>
  ((profile.value?.username || profile.value?.email || 'A').trim().charAt(0) || 'A').toUpperCase(),
)

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>
