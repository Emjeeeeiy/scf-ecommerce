<template>
  <AppShell subtitle="Create Account">
    <div class="mx-auto max-w-md">
      <div class="overflow-hidden rounded-4xl bg-white border border-neutral-300 ring-1 ring-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:ring-neutral-800">
        <!-- Header -->
        <div class="relative overflow-hidden bg-white px-6 py-10 sm:px-8 sm:py-12 border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
          <!-- Subtle Background Accent (Optional: para sa modern touch) -->
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-neutral-50/50 blur-3xl dark:bg-neutral-800/30"></div>

          <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col gap-3">
              <!-- Icon & Label Row -->
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 shadow-sm">
                  <UserPlus :size="20" class="text-white" />
                </div>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                 — Join Us
                </span>
              </div>

              <!-- Heading & Subtext -->
              <div class="space-y-1">
                <h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
                  Create Account
                </h1>
                <p class="max-w-sm text-sm font-medium leading-snug text-neutral-500 dark:text-neutral-400">
                  Save your details and track orders in one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="p-8 sm:p-10">
          <div
            v-if="errorMessage"
            class="mb-8 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-[11px] font-bold text-rose-600 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
          >
            <AlertCircle :size="16" class="shrink-0" />
            <p>{{ errorMessage }}</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleRegister">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  First Name
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                  placeholder="John"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  Last Name
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                <Mail :size="12" />
                Email Address
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                placeholder="john@example.com"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                <Phone :size="12" />
                Contact Number
              </label>
              <input
                v-model="form.contact"
                type="tel"
                class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                placeholder="0912 345 6789"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                <MapPin :size="12" />
                Address
              </label>
              <textarea
                v-model="form.address"
                rows="2"
                class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 text-sm font-bold text-neutral-900  outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                placeholder="Street, Barangay, Municipality"
                required
              ></textarea>
            </div>

            <div class="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <input
                id="isStudent"
                v-model="form.isStudent"
                type="checkbox"
                class="h-5 w-5 rounded border-neutral-300 text-amber-500 focus:ring-amber-400 dark:border-neutral-600 dark:bg-neutral-800"
              />
              <label for="isStudent" class="text-xs font-bold text-neutral-600 cursor-pointer select-none dark:text-neutral-400">
                I am a student (Eligible for student pricing)
              </label>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  <KeyRound :size="12" />
                  Password
                </label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 pr-12 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  >
                    <Eye v-if="!showPassword" :size="16" />
                    <EyeOff v-else :size="16" />
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  <KeyRound :size="12" />
                  Confirm
                </label>
                <div class="relative">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-5 py-3.5 pr-12 text-sm font-bold text-neutral-900 outline-none ring-1 ring-neutral-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:ring-neutral-700 dark:focus:bg-neutral-800"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
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
              class="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-neutral-900 px-6 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-100 disabled:text-neutral-300 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
            >
              <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-neutral-950/20 dark:border-t-neutral-950"></span>
              <template v-else>
                <span>Sign Up</span>
                <UserPlus :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </button>
          </form>

          <div class="mt-5 flex flex-col items-center gap-6 border-t border-neutral-300 pt-3 text-center dark:border-neutral-800">
            <p class="text-[11px] font-medium leading-relaxed text-neutral-400 dark:text-neutral-500">
              Already have an account?
              <router-link to="/login" class="block mt-1 font-black text-neutral-900 hover:underline dark:text-white">Sign In</router-link>
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
  isStudent: false,
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
      address: form.address,
      isStudent: form.isStudent
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