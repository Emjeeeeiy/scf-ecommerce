<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">

      <!-- Title -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Create Account</h1>
        <p class="text-gray-500 text-sm">Register to start ordering clothes</p>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4"
      >
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">

        <!-- Username -->
        <input v-model="form.username" type="text" placeholder="Username"
          class="w-full px-4 py-3 border rounded-xl" required />

        <!-- Email -->
        <input v-model="form.email" type="email" placeholder="Email"
          class="w-full px-4 py-3 border rounded-xl" required />

        <!-- Names Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input v-model="form.firstName" type="text" placeholder="First Name"
            class="px-4 py-3 border rounded-xl" required />

          <input v-model="form.middleInitial" type="text" placeholder="M.I"
            maxlength="1"
            class="px-4 py-3 border rounded-xl text-center uppercase" />

          <input v-model="form.lastName" type="text" placeholder="Last Name"
            class="px-4 py-3 border rounded-xl" required />

        </div>

        <!-- Contact -->
        <input v-model="form.contact" type="text" placeholder="Contact Number"
          class="w-full px-4 py-3 border rounded-xl" required />

        <!-- Address -->
        <textarea v-model="form.address" placeholder="Complete Address"
          class="w-full px-4 py-3 border rounded-xl resize-none" rows="3" required />

        <!-- Gender -->
        <select v-model="form.gender"
          class="w-full px-4 py-3 border rounded-xl bg-white"
          required>
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <!-- Password -->
        <input v-model="form.password" type="password" placeholder="Password"
          class="w-full px-4 py-3 border rounded-xl" required />

        <!-- Confirm Password -->
        <input v-model="form.confirmPassword" type="password" placeholder="Confirm Password"
          class="w-full px-4 py-3 border rounded-xl" required />

        <!-- Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl"
        >
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>

      </form>

      <!-- Login Link -->
      <p class="text-center text-sm text-gray-500 mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Login here
        </router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Firebase
import { auth } from '../Firebase/Firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { saveUserProfile } from '../services/store'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  username: '',
  email: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  contact: '',
  address: '',
  gender: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  loading.value = true

  try {

    // validation
    if (form.value.password !== form.value.confirmPassword) {
      errorMessage.value = "Passwords do not match"
      loading.value = false
      return
    }

    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    )

    const user = userCredential.user

    // Save profile based on the schema
    await saveUserProfile(user.uid, {
      username: form.value.username,
      email: form.value.email,
      firstName: form.value.firstName,
      middleInitial: form.value.middleInitial,
      lastName: form.value.lastName,
      contact: form.value.contact,
      address: form.value.address,
      gender: form.value.gender,
      role: 'user',
      createdAt: new Date()
    })

    alert("Account created successfully!")

    router.push('/login')

  } catch (error) {
    console.error(error)

    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = "Email already exists"
    } else if (error.code === 'auth/invalid-email') {
      errorMessage.value = "Invalid email"
    } else {
      errorMessage.value = "Registration failed"
    }

  } finally {
    loading.value = false
  }
}
</script>