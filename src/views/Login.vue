<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

      <!-- Home -->
      <div class="flex justify-between items-center mb-6">
        <router-link
          to="/"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Home
        </router-link>
      </div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Login</h1>
        <p class="text-gray-500 text-sm mt-1">
          Access your account
        </p>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4"
      >
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter email"
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter password"
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            required
          />

          <!-- Eye Icon -->
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-10 text-gray-500 hover:text-gray-800"
          >
            <Eye v-if="!showPassword" />
            <EyeOff v-else />
          </button>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase/Firebase'
import { getUserProfile } from '../services/store'

// Lucide icons
import { Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const user = userCredential.user

    const profile = await getUserProfile(user.uid)
    const role = profile?.role || 'user'

    alert('Login successful!')

    if (role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/user/preorder')
    }

  } catch (error) {
    console.error(error)

    if (error.code === 'auth/user-not-found') {
      errorMessage.value = 'User not found.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage.value = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = 'Invalid email format.'
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>