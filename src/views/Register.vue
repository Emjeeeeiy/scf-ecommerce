<template>
  <AppShell subtitle="Create a Firebase customer account">
    <div class="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
      <div class="mb-8">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
          New customer
        </p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Register</h1>
      </div>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="handleRegister">
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">First name</span>
          <input v-model="form.firstName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Last name</span>
          <input v-model="form.lastName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Username</span>
          <input v-model="form.username" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Contact</span>
          <input v-model="form.contact" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>

        <label class="block md:col-span-2">
          <span class="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input v-model="form.email" type="email" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>

        <label class="block md:col-span-2">
          <span class="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            v-model="form.password"
            type="password"
            minlength="6"
            class="w-full rounded-2xl border border-slate-200 px-4 py-3"
            required
          />
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="md:col-span-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
    </div>
  </AppShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import { registerUser } from '../services/authService'

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  contact: '',
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await registerUser(form)
    router.push('/shop')
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'That email is already registered.'
    } else {
      errorMessage.value = 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
