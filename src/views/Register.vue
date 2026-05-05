<template>
  <AppShell subtitle="Create Account">
    <div class="mx-auto max-w-md">
      <div class="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
        <!-- Header -->
        <div class="bg-slate-900 p-8 text-white sm:p-10">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-6 shadow-inner">
            <UserPlus :size="24" class="text-amber-400" />
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Join Us</p>
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl">Create Account</h1>
          <p class="mt-4 text-sm font-medium leading-relaxed text-slate-400">
            Register to save your details and track your orders easily.
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

          <form class="space-y-5" @submit.prevent="handleRegister">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  First Name
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                  placeholder="John"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Last Name
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Mail :size="12" />
                Email Address
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="john@example.com"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Phone :size="12" />
                Contact Number
              </label>
              <input
                v-model="form.contact"
                type="tel"
                class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="0912 345 6789"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <MapPin :size="12" />
                Address
              </label>
              <textarea
                v-model="form.address"
                rows="2"
                class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                placeholder="Street, Barangay, Municipality"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <KeyRound :size="12" />
                  Password
                </label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 pr-12 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Eye v-if="!showPassword" :size="16" />
                    <EyeOff v-else :size="16" />
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <KeyRound :size="12" />
                  Confirm
                </label>
                <div class="relative">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 pr-12 text-sm font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Eye v-if="!showConfirmPassword" :size="16" />
                    <EyeOff v-else :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 shadow-xl shadow-slate-900/10"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              <template v-else>
                <span>Sign Up</span>
                <UserPlus :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </button>
          </form>

          <div class="mt-10 flex flex-col items-center gap-6 border-t border-slate-100 pt-10 text-center">
            <p class="text-[11px] font-medium leading-relaxed text-slate-400">
              Already have an account? 
              <router-link to="/login" class="inline block mt-1 font-black text-slate-900 hover:underline">Sign In</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import { registerUser } from '../services/authService'
import { 
  UserPlus, 
  Mail, 
  KeyRound, 
  Phone, 
  MapPin, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  address: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Password should be at least 6 characters.'
    return
  }

  loading.value = true

  try {
    const profileData = {
      firstName: form.firstName,
      lastName: form.lastName,
      contact: form.contact,
      address: form.address
    }
    
    await registerUser(form.email, form.password, profileData)
    router.push('/shop')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Email is already in use.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Invalid email format.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Password is too weak.'
    } else {
      errorMessage.value = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>