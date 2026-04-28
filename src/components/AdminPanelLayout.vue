<template>
  <div class="h-screen overflow-hidden bg-slate-950 text-slate-100">
    <div class="grid h-full lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside class="hidden h-screen border-r border-slate-800 bg-slate-950 lg:block">
        <div class="flex h-full flex-col overflow-y-auto px-6 py-6">
          <div class="border-b border-slate-800 pb-6">
            <router-link to="/" class="text-xs uppercase tracking-[0.35em] text-slate-500">
              SCF Ecommerce
            </router-link>
            <h1 class="mt-4 text-3xl font-bold text-white">Admin</h1>
            <p class="mt-2 text-sm text-slate-400">
              A dedicated workspace for storefront operations.
            </p>
          </div>

          <div class="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Signed in as</p>
            <p class="mt-3 font-semibold text-white">
              {{ profile?.username || profile?.email || 'Administrator' }}
            </p>
            <p class="mt-1 text-sm text-slate-400">
              {{ profile?.role || 'admin' }}
            </p>
          </div>

          <nav class="mt-6 space-y-2">
            <router-link
              v-for="item in adminNavigation"
              :key="item.to"
              :to="item.to"
              class="block rounded-2xl border px-4 py-4 transition"
              :class="isActive(item.to)
                ? 'border-slate-200 bg-white text-slate-950 shadow-lg'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold">{{ item.label }}</p>
                  <p
                    class="mt-1 text-xs"
                    :class="isActive(item.to) ? 'text-slate-600' : 'text-slate-500'"
                  >
                    {{ item.description }}
                  </p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  :class="isActive(item.to) ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-300'"
                >
                  {{ item.tag }}
                </span>
              </div>
            </router-link>
          </nav>

          <div class="mt-auto space-y-3 pt-6">
            <router-link
              to="/shop"
              class="block rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-800"
            >
              View storefront
            </router-link>
            <button
              type="button"
              class="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div class="flex h-screen min-w-0 flex-col bg-slate-100 text-slate-900">
        <header class="shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div class="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-slate-500">
                Admin workspace
              </p>
              <h2 class="mt-2 text-3xl font-bold text-slate-950">
                {{ currentSection.label }}
              </h2>
              <p class="mt-2 max-w-2xl text-sm text-slate-500">
                {{ subtitle || currentSection.description }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <router-link
                v-for="action in headerActions"
                :key="action.to"
                :to="action.to"
                class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {{ action.label }}
              </router-link>
            </div>
          </div>
        </header>

        <main class="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSession } from '../composables/useSession'
import { logoutUser } from '../services/authService'

defineProps({
  subtitle: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const { profile } = useSession()

const adminNavigation = [
  {
    to: '/admin/dashboard',
    label: 'Overview',
    tag: 'Hub',
    description: 'Monitor metrics, activity, and admin priorities.',
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    tag: 'Taxonomy',
    description: 'Shape the storefront structure customers browse.',
  },
  {
    to: '/admin/products',
    label: 'Products',
    tag: 'Catalog',
    description: 'Manage listings, images, pricing, and variants.',
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    tag: 'Fulfillment',
    description: 'Handle status flow and fulfillment progress.',
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
