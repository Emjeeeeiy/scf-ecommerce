<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start justify-between gap-4">
          <div>
            <router-link to="/" class="inline-flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                SCF
              </span>
              <span>
                <span class="block text-lg font-bold text-slate-900">SCF Ecommerce</span>
                <span v-if="subtitle" class="block text-sm text-slate-500">
                  {{ subtitle }}
                </span>
              </span>
            </router-link>
          </div>
        </div>

        <nav class="flex flex-wrap items-center gap-2 text-sm">
          <router-link
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 font-medium transition"
            :class="route.path === item.to ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          >
            {{ item.label }}
          </router-link>

          <button
            v-if="isAuthenticated"
            type="button"
            class="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-700 transition hover:bg-rose-200"
            @click="handleLogout"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logoutUser } from '../services/authService'
import { useSession } from '../composables/useSession'

defineProps({
  subtitle: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const router = useRouter()
const { isAuthenticated, isAdmin } = useSession()

const navigation = computed(() => {
  const base = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
  ]

  if (isAuthenticated.value) {
    base.push(
      { to: '/cart', label: 'Cart' },
      { to: '/account/profile', label: 'Profile' },
      { to: '/account/orders', label: 'Orders' },
    )
  } else {
    base.push(
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
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

const handleLogout = async () => {
  await logoutUser()
  router.push('/login')
}
</script>
