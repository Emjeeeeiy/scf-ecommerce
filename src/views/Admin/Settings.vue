<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />

    <div class="flex-1 p-6">
      <div class="bg-white rounded-2xl shadow-md p-6 max-w-3xl">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Settings</h1>
        <p class="text-gray-500 mb-6">Current admin profile based on the `users` collection</p>

        <div v-if="profile" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="border rounded-xl p-4">
            <p class="text-sm text-gray-500">Username</p>
            <p class="font-semibold text-gray-800">{{ profile.username || '-' }}</p>
          </div>
          <div class="border rounded-xl p-4">
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-semibold text-gray-800">{{ profile.email || '-' }}</p>
          </div>
          <div class="border rounded-xl p-4">
            <p class="text-sm text-gray-500">Full Name</p>
            <p class="font-semibold text-gray-800">
              {{ [profile.firstName, profile.middleInitial, profile.lastName].filter(Boolean).join(' ') || '-' }}
            </p>
          </div>
          <div class="border rounded-xl p-4">
            <p class="text-sm text-gray-500">Role</p>
            <p class="font-semibold text-gray-800 capitalize">{{ profile.role || '-' }}</p>
          </div>
          <div class="border rounded-xl p-4 md:col-span-2">
            <p class="text-sm text-gray-500">Address</p>
            <p class="font-semibold text-gray-800">{{ profile.address || '-' }}</p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import Sidebar from '../../components/Sidebar.vue'
import { auth } from '../../Firebase/Firebase'
import { getUserProfile } from '../../services/store'

const router = useRouter()
const profile = ref(null)

const handleLogout = async () => {
  await signOut(auth)
  router.push('/login')
}

onMounted(async () => {
  const user = auth.currentUser
  if (!user) return
  profile.value = await getUserProfile(user.uid)
})
</script>