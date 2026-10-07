<template>
  <AppShell subtitle="Sign In">
    <div class="mx-auto grid w-full max-w-5xl gap-12 px-2 pt-8 sm:px-6 sm:pt-12 md:grid-cols-2 md:gap-16">
      <div class="md:sticky md:top-24 md:self-start">
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Welcome back</p>
        <h1 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Account login</h1>
        <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
        <p class="mt-4 max-w-sm text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">Sign in to access your profile and track your orders.</p>

        <ul class="mt-10 hidden divide-y divide-neutral-200 border-y border-neutral-200 md:block dark:divide-neutral-800 dark:border-neutral-800">
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">01</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Track orders and view purchase history</p>
          </li>
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">02</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Faster checkout with saved details</p>
          </li>
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">03</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Student pricing when eligible</p>
          </li>
        </ul>
      </div>

      <div class="h-fit border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div
          v-if="errorMessage"
          class="mb-8 flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
        >
          <AlertCircle :size="16" class="shrink-0" />
          <p>{{ errorMessage }}</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Email address</label>
            <input
              v-model="email"
              type="email"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Eye v-if="!showPassword" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="group flex w-full items-center justify-center gap-2 bg-neutral-900 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-neutral-900/20 dark:border-t-neutral-900"></span>
            <template v-else>
              <span>Sign in</span>
              <LogIn :size="16" class="transition-transform group-hover:translate-x-0.5" />
            </template>
          </button>
        </form>

        <div class="mt-8 border-t border-neutral-200 pt-6 text-center dark:border-neutral-800">
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Don't have an account yet?
            <router-link to="/register" class="mt-1 block text-sm text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-700 dark:hover:decoration-white">Create account</router-link>
          </p>
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