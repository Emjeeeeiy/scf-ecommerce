<template>
  <AppShell subtitle="Create Account">
    <div class="mx-auto grid w-full max-w-5xl gap-12 px-2 pt-8 sm:px-6 sm:pt-12 md:grid-cols-2 md:gap-16">
      <div class="md:sticky md:top-24 md:self-start">
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Get started</p>
        <h1 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Create account</h1>
        <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
        <p class="mt-4 max-w-sm text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">Save your details and track orders in one place.</p>

        <ul class="mt-10 hidden divide-y divide-neutral-200 border-y border-neutral-200 md:block dark:divide-neutral-800 dark:border-neutral-800">
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">01</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">One account for shop, cart, and orders</p>
          </li>
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">02</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Save addresses for faster checkout</p>
          </li>
          <li class="flex gap-5 py-4">
            <span class="w-7 shrink-0 text-xs tabular-nums text-neutral-400">03</span>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Support SCF missions with every purchase</p>
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

        <form class="space-y-6" @submit.prevent="handleRegister">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">First name</label>
              <input
                v-model="form.firstName"
                type="text"
                class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Last name</label>
              <input
                v-model="form.lastName"
                type="text"
                class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Email address</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Contact number</label>
            <input
              v-model="form.contact"
              type="tel"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              placeholder="0912 345 6789"
              required
            />
          </div>

          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Address</label>
            <textarea
              v-model="form.address"
              rows="2"
              class="mt-2 w-full resize-none border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              placeholder="Street, Barangay, Municipality"
              required
            ></textarea>
          </div>

          <div class="flex items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <input
              id="isStudent"
              v-model="form.isStudent"
              type="checkbox"
              class="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800"
            />
            <label for="isStudent" class="cursor-pointer select-none text-sm text-neutral-600 dark:text-neutral-400">
              I am a student <span class="text-neutral-400">(eligible for student pricing)</span>
            </label>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
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
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Confirm</label>
              <div class="relative">
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
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
            class="group flex w-full items-center justify-center gap-2 bg-neutral-900 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-neutral-900/20 dark:border-t-neutral-900"></span>
            <template v-else>
              <span>Sign up</span>
              <UserPlus :size="16" class="transition-transform group-hover:translate-x-0.5" />
            </template>
          </button>
        </form>

        <div class="mt-8 border-t border-neutral-200 pt-6 text-center dark:border-neutral-800">
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            Already have an account?
            <router-link to="/login" class="mt-1 block text-sm text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-700 dark:hover:decoration-white">Sign in</router-link>
          </p>
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