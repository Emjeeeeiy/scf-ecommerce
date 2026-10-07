<template>
  <AppShell subtitle="Account Settings">
    <section class="mx-auto grid w-full max-w-5xl gap-10 px-2 sm:px-6 lg:grid-cols-2">

      <div class="flex h-fit flex-col border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-neutral-200 p-6 sm:px-8 dark:border-neutral-800">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Personal info</p>
          <h1 class="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">Account details</h1>
        </div>

        <form class="grid gap-6 p-6 sm:p-8" @submit.prevent="handleSaveProfile">
          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Username</label>
            <input
              v-model="profileForm.username"
              type="text"
              placeholder="Your username"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">First name</label>
              <input
                v-model="profileForm.firstName"
                type="text"
                placeholder="First name"
                class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              />
            </div>
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Last name</label>
              <input
                v-model="profileForm.lastName"
                type="text"
                placeholder="Last name"
                class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              />
            </div>
          </div>

          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Contact number</label>
            <input
              v-model="profileForm.contact"
              type="tel"
              placeholder="09xx xxx xxxx"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
            />
          </div>

          <div class="flex items-center gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <input
              id="isStudent"
              v-model="profileForm.isStudent"
              type="checkbox"
              class="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800"
            />
            <label for="isStudent" class="cursor-pointer select-none text-sm text-neutral-600 dark:text-neutral-400">
              I am a student <span class="text-neutral-400">(eligible for student pricing)</span>
            </label>
          </div>

          <button
            type="submit"
            class="mt-2 inline-flex items-center justify-center gap-1.5 bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Save :size="14" />
            <span>Save changes</span>
          </button>
        </form>

        <div v-if="message" class="mx-6 mb-6 border border-neutral-200 p-4 text-sm text-neutral-700 sm:mx-8 sm:mb-8 dark:border-neutral-700 dark:text-neutral-300">
          <p>{{ message }}</p>
        </div>
      </div>

      <div class="flex h-fit flex-col border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-neutral-200 p-6 sm:px-8 dark:border-neutral-800">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Shipping</p>
          <h2 class="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">Saved addresses</h2>
        </div>

        <div class="space-y-0 p-6 sm:p-8">
          <article
            v-for="address in addresses"
            :key="address.id"
            class="group flex items-start justify-between gap-4 border-b border-neutral-200 py-5 first:pt-0 last:border-0 last:pb-0 dark:border-neutral-800"
          >
            <div class="min-w-0">
              <p class="truncate text-sm text-neutral-900 dark:text-white">{{ address.street }}</p>
              <p class="mt-1 text-sm text-neutral-500">{{ address.city }}, {{ address.postalCode }}</p>
              <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-neutral-400">{{ address.country }}</p>
            </div>
            <button
              type="button"
              class="shrink-0 text-xs text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              @click="handleDeleteAddress(address.id)"
            >
              Delete
            </button>
          </article>

          <div v-if="!addresses.length" class="py-12 text-center">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">No addresses saved</p>
            <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
            <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">Addresses you save will appear here.</p>
          </div>
        </div>
      </div>

    </section>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { useSession } from '../../composables/useSession'
import {
  deleteAddress,
  getUserProfile,
  listAddresses,
  updateUserProfile,
} from '../../services/userService'
import { useConfirmAction } from '../../composables/useConfirmAction'
import {
  Save
} from 'lucide-vue-next'

const { confirmAndRun } = useConfirmAction()
const { authUser } = useSession()

const message = ref('')
const addresses = ref([])
const profileForm = reactive({
  username: '',
  firstName: '',
  lastName: '',
  contact: '',
  isStudent: false,
})

const loadProfile = async () => {
  if (!authUser.value) {
    return
  }

  const profile = await getUserProfile(authUser.value.uid)
  addresses.value = await listAddresses(authUser.value.uid)

  profileForm.username = profile?.username || ''
  profileForm.firstName = profile?.firstName || ''
  profileForm.lastName = profile?.lastName || ''
  profileForm.contact = profile?.contact || ''
  profileForm.isStudent = profile?.isStudent || false
}

const handleSaveProfile = async () => {
  await updateUserProfile(authUser.value.uid, profileForm)
  message.value = 'Profile updated successfully!'
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleDeleteAddress = (addressId) =>
  confirmAndRun('Are you sure you want to delete this address?', async () => {
    await deleteAddress(authUser.value.uid, addressId)
    addresses.value = await listAddresses(authUser.value.uid)
  })

onMounted(loadProfile)
</script>