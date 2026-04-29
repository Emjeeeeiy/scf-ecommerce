<template>
  <AppShell subtitle="Admin access only">
    <div class="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <div class="mb-8">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
          Welcome back
        </p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Admin Login</h1>
        <p class="mt-2 text-sm text-slate-500">
          This page is for administrators only. Shoppers can browse products and checkout without creating an account.
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            v-model="email"
            type="email"
            class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder="you@example.com"
            required
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            v-model="password"
            type="password"
            class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            placeholder="Enter your password"
            required
          />
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-slate-500">Need to shop? Go back to the storefront and continue as customer.</p>
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import { loginUser, logoutUser } from '../services/authService'
import { useSession } from '../composables/useSession'

const router = useRouter()
const { isAdmin } = useSession()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const { profile } = await loginUser(email.value, password.value)
    if (profile.role === 'admin' || isAdmin.value) {
      router.push('/admin/dashboard')
      return
    }

    await logoutUser()
    errorMessage.value = 'Only admin accounts are allowed to sign in here.'
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      errorMessage.value = 'User not found.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage.value = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Invalid email format.'
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage.value = 'Invalid email or password.'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>