<template>
  <AppShell subtitle="Admin Access">
    <div class="mx-auto max-w-md">
      <div class="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
        <!-- Header -->
        <div class="bg-slate-900 p-8 text-white sm:p-10">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-6 shadow-inner">
            <Lock :size="24" class="text-amber-400" />
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Welcome Back</p>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl">Account Login</h1>
          <p class="mt-4 text-sm font-medium leading-relaxed text-slate-400">
            Sign in to access your profile and track your orders.
          </p>
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

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Mail :size="12" />
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                class="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <KeyRound :size="12" />
                Password
              </label>
              <input
                v-model="password"
                type="password"
                class="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 shadow-xl shadow-slate-900/10"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              <template v-else>
                <span>Sign In</span>
                <LogIn :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </button>
          </form>

          <div class="mt-10 flex flex-col items-center gap-6 border-t border-slate-100 pt-10 text-center">
             <p class="text-[11px] font-medium leading-relaxed text-slate-400">
              Don't have an account yet? 
              <router-link to="/register" class="inline block mt-1 font-black text-slate-900 hover:underline">Create Account</router-link>
            </p>
            <div class="flex items-center gap-3 text-slate-300">
               <ShieldCheck :size="18" />
               <span class="text-[9px] font-black uppercase tracking-[0.2em]">Encrypted Session</span>
            </div>
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
  ShieldCheck 
} from 'lucide-vue-next'

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