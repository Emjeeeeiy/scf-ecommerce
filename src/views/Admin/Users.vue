<template>
  <AdminPanelLayout>
    <div class="mx-auto max-w-7xl space-y-4 sm:space-y-5">
      <AdminPageHead
        eyebrow="Community"
        title="Users"
        :description="`${users.length} registered ${users.length === 1 ? 'account' : 'accounts'}.`"
      />

      <!-- Search -->
      <div class="relative">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" :size="16" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users by name, email, or username..."
          class="admin-search admin-card"
        >
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          title="Clear search"
          aria-label="Clear search"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <X :size="15" />
        </button>
      </div>

      <!-- Users table -->
      <section class="admin-card overflow-hidden">
        <div class="admin-card-table-wrap overflow-x-auto">
          <table class="admin-card-table w-full border-collapse border-spacing-0 text-left">
            <thead>
              <tr class="border-b border-neutral-100 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/40">
                <th class="admin-th">User</th>
                <th class="admin-th">Tier</th>
                <th class="admin-th">Role</th>
                <th class="admin-th">Email</th>
                <th class="admin-th">Joined</th>
                <th class="admin-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr
                v-for="user in pagedUsers"
                :key="user.id"
                class="cursor-pointer transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30"
              >
                <td class="whitespace-nowrap px-5 py-3.5" data-label="User" @click="openDetails(user)">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
                      <UserIcon :size="16" />
                    </div>
                    <div class="min-w-0">
                      <p class="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                        <span class="truncate">{{ user.firstName }} {{ user.lastName }}</span>
                        <span v-if="!user.seenByAdmin" class="admin-pill shrink-0 border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">New</span>
                      </p>
                      <p class="truncate text-[11px] text-neutral-400 dark:text-neutral-500">@{{ user.username }}</p>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-3.5" data-label="Tier" @click="openDetails(user)">
                  <span
                    class="admin-pill"
                    :class="user.isStudent ? 'border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300' : 'border-neutral-100 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-500'"
                  >
                    {{ user.isStudent ? 'Student' : 'Regular' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-3.5" data-label="Role" @click="openDetails(user)">
                  <span
                    class="admin-pill"
                    :class="getRoleClass(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-3.5" data-label="Email" @click="openDetails(user)">
                  <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ user.email }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3.5" data-label="Joined" @click="openDetails(user)">
                  <p class="text-xs text-neutral-400 dark:text-neutral-500">{{ formatDate(user.createdAt) }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3.5" data-label="Actions">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click.stop="openDetails(user)"
                      class="admin-icon-btn h-8 w-8"
                      title="View profile"
                      aria-label="View profile"
                    >
                      <Eye :size="15" />
                    </button>
                    <button
                      v-if="user.role !== 'admin'"
                      @click.stop="handleDeleteUser(user)"
                      class="admin-icon-btn h-8 w-8 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                      title="Delete user"
                      aria-label="Delete user"
                    >
                      <Trash2 :size="15" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!filteredUsers.length" class="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-600">
              <UsersIcon :size="22" />
            </div>
            <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">No matching users</p>
          </div>
          <Pagination :page="page" :total-pages="totalPages" :total-items="totalFilteredUsers" @update:page="goToPage" />
        </div>
      </section>
    </div>

    <!-- User detail modal -->
    <Transition
      name="modal"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="selectedUser" class="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm dark:bg-black/60" @click="selectedUser = null"></div>

        <div class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white dark:bg-neutral-900">
          <div class="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <UserIcon :size="18" />
              </div>
              <div class="min-w-0">
                <h3 class="truncate font-heading text-base font-bold tracking-tight text-neutral-900 dark:text-white">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
                <p class="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">ID: {{ selectedUser.id }}</p>
              </div>
            </div>
            <button @click="selectedUser = null" title="Close" aria-label="Close profile" class="admin-icon-btn">
              <X :size="18" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="space-y-5">
              <div class="grid gap-2.5 sm:grid-cols-2">
                <div class="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <p class="admin-eyebrow mb-1">Username</p>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">@{{ selectedUser.username }}</p>
                </div>
                <div class="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <p class="admin-eyebrow mb-1">Email</p>
                  <p class="break-all text-sm font-bold text-neutral-900 dark:text-white">{{ selectedUser.email }}</p>
                </div>
                <div class="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <p class="admin-eyebrow mb-1.5">Role</p>
                  <span
                    class="admin-pill"
                    :class="getRoleClass(selectedUser.role)"
                  >
                    {{ selectedUser.role }}
                  </span>
                </div>
                <div class="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <p class="admin-eyebrow mb-1.5">Tier</p>
                  <span
                    class="admin-pill"
                    :class="selectedUser.isStudent ? 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300' : 'border-neutral-100 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-500'"
                  >
                    {{ selectedUser.isStudent ? 'Student pricing' : 'Regular pricing' }}
                  </span>
                </div>
              </div>

              <div>
                <h4 class="admin-eyebrow mb-3 flex items-center gap-1.5">
                  <Phone :size="12" /> Contact
                </h4>
                <div class="space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40 sm:p-5">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
                      <Phone :size="16" />
                    </div>
                    <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ selectedUser.contact || 'N/A' }}</p>
                  </div>
                  <div class="flex items-start gap-3 border-t border-neutral-200/60 pt-3 dark:border-neutral-700">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
                      <MapPin :size="16" />
                    </div>
                    <p class="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{{ selectedUser.address || 'No address provided' }}</p>
                  </div>
                </div>
              </div>

              <p class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                <Calendar :size="12" />
                <span>Joined {{ formatDate(selectedUser.createdAt) }}</span>
              </p>
            </div>
          </div>

          <div class="flex shrink-0 justify-end border-t border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
            <button
              @click="selectedUser = null"
              class="admin-btn admin-btn-quiet"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminPanelLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  User as UserIcon,
  Users as UsersIcon,
  Search,
  X,
  Eye,
  Trash2,
  Calendar,
  Phone,
  MapPin
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import AdminPageHead from '../../components/AdminPageHead.vue'
import Pagination from '../../components/Pagination.vue'
import { subscribeToAllUsers, markUserAsSeen, deleteUser } from '../../services/userService'
import { formatDate } from '../../utils/format'
import { useSearchFilter } from '../../composables/useSearchFilter'
import { useFirestoreSubscription } from '../../composables/useFirestoreSubscription'
import { usePagination } from '../../composables/usePagination'
import { useConfirmAction } from '../../composables/useConfirmAction'
import { useToast } from '../../composables/useToast'

const { data: users } = useFirestoreSubscription(subscribeToAllUsers)
const { query: searchQuery, filtered: filteredUsers } = useSearchFilter(users, (user) => [
  `${user.firstName} ${user.lastName}`,
  user.email,
  user.username,
])

const { page, totalPages, totalItems: totalFilteredUsers, paged: pagedUsers, goToPage, resetPage } = usePagination(filteredUsers, 20)
watch(searchQuery, resetPage)

const selectedUser = ref(null)
const toast = useToast()
const { confirmAndRun } = useConfirmAction()

const openDetails = async (user) => {
  selectedUser.value = user
  if (!user.seenByAdmin) {
    try {
      await markUserAsSeen(user.id)
    } catch (error) {
      console.error('Failed to mark user as seen:', error)
    }
  }
}

const handleDeleteUser = (user) => {
  if (user.role === 'admin') {
    toast.error('Admin accounts cannot be deleted')
    return
  }

  return confirmAndRun(
    `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
    () => deleteUser(user.id),
    { title: 'Delete User', successMessage: 'User deleted successfully', errorMessage: 'Failed to delete user' },
  )
}

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
    case 'customer': return 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
    case 'guest': return 'border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
    default: return 'border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
  }
}
</script>

<style scoped>
/* Table-to-card responsive rules live in style.css (.admin-card-table). */
.modal-enter-from { opacity: 0; transform: scale(0.96); }
.modal-enter-to { opacity: 1; transform: scale(1); }
</style>
