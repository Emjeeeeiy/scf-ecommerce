<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 p-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
          <p class="text-gray-500 text-sm">View all registered users from Firestore</p>
        </div>

        <router-link
          to="/admin/dashboard"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition"
        >
          Back to Dashboard
        </router-link>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="bg-white rounded-2xl shadow-md p-8 text-center"
      >
        <p class="text-gray-500">Loading users...</p>
      </div>

      <!-- Table -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-md overflow-x-auto"
      >
        <table class="w-full text-left">

          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-4 font-semibold text-gray-700">User ID</th>
              <th class="p-4 font-semibold text-gray-700">Username</th>
              <th class="p-4 font-semibold text-gray-700">Email</th>
              <th class="p-4 font-semibold text-gray-700">First Name</th>
              <th class="p-4 font-semibold text-gray-700">Middle Initial</th>
              <th class="p-4 font-semibold text-gray-700">Last Name</th>
              <th class="p-4 font-semibold text-gray-700">Contact</th>
              <th class="p-4 font-semibold text-gray-700">Gender</th>
              <th class="p-4 font-semibold text-gray-700">Address</th>
              <th class="p-4 font-semibold text-gray-700">Role</th>
              <th class="p-4 font-semibold text-gray-700">Created At</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-4">{{ user.userId || user.id }}</td>
              <td class="p-4">{{ user.username || '-' }}</td>
              <td class="p-4">{{ user.email || '-' }}</td>
              <td class="p-4">{{ user.firstName || '-' }}</td>
              <td class="p-4">{{ user.middleInitial || '-' }}</td>
              <td class="p-4">{{ user.lastName || '-' }}</td>
              <td class="p-4">{{ user.contact || '-' }}</td>
              <td class="p-4">{{ user.gender || '-' }}</td>
              <td class="p-4">{{ user.address || '-' }}</td>

              <td class="p-4">
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  "
                >
                  {{ user.role || 'user' }}
                </span>
              </td>

              <td class="p-4">
                {{ formatDate(user.createdAt) }}
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="users.length === 0">
              <td colspan="11" class="p-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Sidebar from '../../components/Sidebar.vue'
import { watchUsers } from '../../services/store'

const users = ref([])
const loading = ref(true)

const fetchUsers = async () => {
  loading.value = true

  try {
    stopUsers = watchUsers((items) => {
      users.value = items
      loading.value = false
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    alert('Failed to fetch users')
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'

  try {
    if (timestamp.seconds) {
      return new Date(
        timestamp.seconds * 1000
      ).toLocaleDateString()
    }

    return new Date(timestamp).toLocaleDateString()
  } catch {
    return '-'
  }
}

let stopUsers = null

onMounted(() => {
  fetchUsers()
})

onUnmounted(() => {
  stopUsers?.()
})
</script>