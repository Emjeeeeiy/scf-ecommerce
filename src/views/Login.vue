<template>
  <AppShell subtitle="Sign In">
    <div class="mx-auto max-w-md">
      <div class="overflow-hidden rounded-4xl bg-white border border-neutral-300 ring-1 ring-neutral-100">
        <!-- Header -->
        <div class="relative overflow-hidden bg-white px-6 py-10 sm:px-8 sm:py-12 border-b border-neutral-200">
          <!-- Subtle Background Accent -->
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-neutral-50/50 blur-3xl"></div>

          <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col gap-3">
              <!-- Icon & Label Row -->
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 shadow-sm">
                  <Lock :size="20" class="text-white" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                 — Welcome Back
                </span>
              </div>

              <!-- Heading & Subtext -->
              <div class="space-y-1">
                <h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                  Account Login
                </h1>
                <p class="max-w-sm text-sm font-medium leading-snug text-neutral-500">
                  Sign in to access your profile and track your orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="p-8 sm:p-10">
          <div
            v-if="errorMessage"
            class="mb-8 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-[11px] font-bold text-rose-600 ring-1 ring-rose-100"
          >
            <AlertCircle :size="16" class="shrink-0" />
            <p>{{ errorMessage }}</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <Mail :size="12" />
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <KeyRound :size="12" />
                Password
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 pr-12 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <Eye v-if="!showPassword" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 px-6 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-100 disabled:text-neutral-300"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              <template v-else>
                <span>Sign In</span>
                <LogIn :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </button>
          </form>

          <div class="mt-5 flex flex-col items-center gap-6 border-t border-neutral-300 pt-3 text-center">
            <p class="text-[11px] font-medium leading-relaxed text-neutral-400">
              Don't have an account yet? 
              <router-link to="/register" class="block mt-1 font-black text-neutral-900 hover:underline">Create Account</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import { loginUser, logoutUser } from '../services/authService'
import { useSession } from '../composables/useSession'
import { 
  Lock, 
  Mail, 
  KeyRound, 
  LogIn, 
  AlertCircle, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-vue-next'

const router = useRouter()
const { isAdmin } = useSession()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const { profile } = await loginUser(email.value, password.value)
    
    // Check for redirect query param
    const redirectPath = router.currentRoute.value.query.redirect

    if (profile.role === 'admin') {
      router.push(redirectPath || '/admin/dashboard')
    } else {
      router.push(redirectPath || '/shop')
    }
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