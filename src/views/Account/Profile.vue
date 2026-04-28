<template>
  <AppShell subtitle="Manage customer profile and saved addresses">
    <section class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div class="rounded-3xl bg-white p-8 shadow-sm">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Profile</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">Account details</h1>

        <form class="mt-6 grid gap-4" @submit.prevent="handleSaveProfile">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Username</span>
            <input v-model="profileForm.username" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">First name</span>
            <input v-model="profileForm.firstName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Last name</span>
            <input v-model="profileForm.lastName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Contact</span>
            <input v-model="profileForm.contact" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <button
            type="submit"
            class="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Save profile
          </button>
        </form>

        <p v-if="message" class="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {{ message }}
        </p>
      </div>

      <div class="rounded-3xl bg-white p-8 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Addresses</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">Saved addresses</h2>
          </div>
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="flex items-start justify-between rounded-2xl border border-slate-200 p-4"
          >
            <div class="text-sm text-slate-600">
              <p class="font-semibold text-slate-900">{{ address.street }}</p>
              <p>{{ address.city }}, {{ address.postalCode }}</p>
              <p>{{ address.country }}</p>
            </div>
            <button
              type="button"
              class="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
              @click="handleDeleteAddress(address.id)"
            >
              Delete
            </button>
          </div>

          <div v-if="!addresses.length" class="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
            No addresses saved yet.
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

const { authUser } = useSession()

const message = ref('')
const addresses = ref([])
const profileForm = reactive({
  username: '',
  firstName: '',
  lastName: '',
  contact: '',
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
}

const handleSaveProfile = async () => {
  await updateUserProfile(authUser.value.uid, profileForm)
  message.value = 'Profile updated.'
}

const handleDeleteAddress = async (addressId) => {
  await deleteAddress(authUser.value.uid, addressId)
  addresses.value = await listAddresses(authUser.value.uid)
}

onMounted(loadProfile)
</script>
