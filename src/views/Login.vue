<template>
  <AppShell subtitle="Sign in with Firebase Auth">
    <div class="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <div class="mb-8">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
          Welcome back
        </p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Login</h1>
        <p class="mt-2 text-sm text-slate-500">
          Customer accounts and admin access both use Firebase Auth. Admin rights come from your Firestore profile role.
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

      <div class="my-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-slate-200"></div>
        <span class="text-xs uppercase tracking-[0.25em] text-slate-400">or</span>
        <div class="h-px flex-1 bg-slate-200"></div>
      </div>

      <button
        type="button"
        :disabled="loading"
        class="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleGoogleLogin"
      >
        <span class="text-base">G</span>
        <span>{{ loading ? 'Please wait...' : 'Continue with Google' }}</span>
      </button>

      <p class="mt-6 text-sm text-slate-500">
        Need an account?
        <router-link to="/register" class="font-semibold text-slate-900">
          Register here
        </router-link>
      </p>
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import { loginUser, loginWithGoogle } from '../services/authService'
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
    router.push(profile.role === 'admin' || isAdmin.value ? '/admin/dashboard' : '/shop')
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

const handleGoogleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const { profile } = await loginWithGoogle()
    router.push(profile.role === 'admin' || isAdmin.value ? '/admin/dashboard' : '/shop')
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage.value = 'Google sign-in was cancelled.'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage.value = 'This domain is not authorized for Google sign-in in Firebase.'
    } else {
      errorMessage.value = 'Google login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>