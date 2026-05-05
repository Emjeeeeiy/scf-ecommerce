<template>
  <AdminPanelLayout subtitle="Monitor and search registered user accounts">
    <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Search Bar Only -->
      <section>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div class="relative w-full">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search users by name, email, or username..." 
              class="w-full pl-12 pr-10 py-3 rounded-xl border-none bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
            >
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X :size="16" />
            </button>
          </div>
        </div>
      </section>

      <!-- Users Table -->
      <section class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">User</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Role</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Email</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Registration Date</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id"
                class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                @click="openDetails(user)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <UserIcon :size="18" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                      <p class="text-[10px] font-medium text-slate-400">@{{ user.username }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border"
                    :class="getRoleClass(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-xs font-semibold text-slate-500">{{ user.email }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-xs font-semibold text-slate-400">{{ formatDate(user.createdAt) }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <button 
                      class="p-2 text-slate-300 group-hover:text-amber-500 transition-colors"
                      title="View Profile"
                    >
                      <Eye :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!filteredUsers.length" class="flex flex-col items-center justify-center py-20 text-center px-6">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-3">
              <UsersIcon :size="24" />
            </div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
          </div>
        </div>
      </section>
    </div>

    <!-- User Detail Modal (Remains for viewing details) -->
    <Transition 
      name="modal"
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-95"
    >
      <div v-if="selectedUser" class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
        <div class="absolute inset-0 bg-slate-900/40" @click="selectedUser = null"></div>
        
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col">
          <div class="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 shrink-0">
            <div class="flex items-center gap-4">
              <div class="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <UserIcon :size="20" />
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">User Profile</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {{ selectedUser.id }}</p>
              </div>
            </div>
            <button @click="selectedUser = null" class="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <X :size="20" />
            </button>
          </div>

          <div class="p-8 overflow-y-auto scrollbar-hide flex-1">
            <div class="space-y-8">
              <div class="grid sm:grid-cols-2 gap-6">
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</p>
                  <p class="text-sm font-bold text-slate-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
                </div>
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Username</p>
                  <p class="text-sm font-bold text-slate-900">@{{ selectedUser.username }}</p>
                </div>
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</p>
                  <p class="text-sm font-bold text-slate-900">{{ selectedUser.email }}</p>
                </div>
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Role</p>
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border"
                    :class="getRoleClass(selectedUser.role)"
                  >
                    {{ selectedUser.role }}
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone :size="12" /> Contact & Delivery
                </h4>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                      <Phone :size="18" />
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact Number</p>
                      <p class="text-sm font-bold text-slate-900">{{ selectedUser.contact || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4 pt-4 border-t border-slate-200/50">
                    <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                      <MapPin :size="18" />
                    </div>
                    <div class="flex-1">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Address</p>
                      <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ selectedUser.address || 'No address provided' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                <Calendar :size="12" />
                <span>Joined on {{ formatDate(selectedUser.createdAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex justify-end shrink-0">
            <button 
              @click="selectedUser = null"
              class="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { 
  User as UserIcon, 
  Users as UsersIcon,
  Search,
  X,
  Eye,
  Calendar,
  Phone,
  MapPin
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { listAllUsers } from '../../services/userService'
import { useToast } from '../../composables/useToast'

const users = ref([])
const searchQuery = ref('')
const selectedUser = ref(null)

const toast = useToast()

const loadUsers = async () => {
  try {
    users.value = await listAllUsers()
  } catch (error) {
    toast.error('Failed to load users')
    console.error(error)
  }
}

const openDetails = (user) => {
  selectedUser.value = user
}

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-rose-50 text-rose-600 border-rose-100'
    case 'customer': return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'guest': return 'bg-slate-50 text-slate-600 border-slate-100'
    default: return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  })
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const searchLower = searchQuery.value.toLowerCase()
    return !searchQuery.value || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
  })
})

onMounted(loadUsers)
</script>

<style scoped>
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-enter-to { opacity: 1; transform: scale(1) translateY(0); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
