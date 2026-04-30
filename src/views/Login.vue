<template>
  <AppShell subtitle="Admin Access">
    <div class="mx-auto max-w-md">
      <div class="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
        <!-- Header -->
        <div class="bg-slate-950 p-6 text-white sm:p-8">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 mb-4">
            <Lock :size="24" class="text-amber-400" />
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Security Portal</p>
          <h1 class="text-3xl font-black tracking-tighter">Admin Login</h1>
          <p class="mt-3 text-xs font-medium leading-relaxed text-slate-300">
            Authorized access only. Enter your credentials to manage the platform.
          </p>
        </div>

        <!-- Form -->
        <div class="p-6 sm:p-8">
          <div
            v-if="errorMessage"
            class="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-[11px] font-bold text-red-600 ring-1 ring-red-100"
          >
            <AlertCircle :size="16" class="shrink-0" />
            <p>{{ errorMessage }}</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Mail :size="12" />
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="admin@scf.org"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <KeyRound :size="12" />
                Password
              </label>
              <input
                v-model="password"
                type="password"
                class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 text-xs font-black text-white transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 shadow-xl shadow-slate-900/10"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              <LogIn v-else :size="18" class="transition-transform group-hover:translate-x-1" />
              <span>{{ loading ? 'Authenticating...' : 'Sign In' }}</span>
            </button>
          </form>

          <div class="mt-8 flex flex-col items-center gap-5 border-t border-slate-100 pt-8 text-center">
            <div class="flex items-center gap-3 text-slate-300">
               <ShieldCheck :size="18" />
               <span class="text-[9px] font-black uppercase tracking-[0.2em]">Encrypted Session</span>
            </div>
            <p class="max-w-[16rem] text-[11px] font-medium leading-relaxed text-slate-400">
              Not an admin? 
              <router-link to="/shop" class="inline block mt-1 font-black text-slate-900 hover:underline">Return to Storefront</router-link>
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