<template>
  <AppShell subtitle="Account Settings">
    <section class="grid gap-8 lg:grid-cols-2">
      
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-fit">
        <div class="flex items-center gap-3 border-b border-slate-100 p-6 sm:px-8">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
            <UserCircle :size="16" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Personal Info</p>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">Account Details</h1>
          </div>
        </div>

        <form class="p-6 sm:p-8 grid gap-5" @submit.prevent="handleSaveProfile">
          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <AtSign :size="10" stroke-width="1.5" />
              <span>Username</span>
            </label>
            <input 
              v-model="profileForm.username" 
              type="text"
              placeholder="Your username"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100" 
            />
          </div>
          
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <User :size="10" stroke-width="1.5" />
                <span>First Name</span>
              </label>
              <input 
                v-model="profileForm.firstName" 
                type="text"
                placeholder="First name"
                class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100" 
              />
            </div>
            <div class="space-y-1.5">
              <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <User :size="10" stroke-width="1.5" />
                <span>Last Name</span>
              </label>
              <input 
                v-model="profileForm.lastName" 
                type="text"
                placeholder="Last name"
                class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100" 
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Phone :size="10" stroke-width="1.5" />
              <span>Contact Number</span>
            </label>
            <input 
              v-model="profileForm.contact" 
              type="tel"
              placeholder="09xx xxx xxxx"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100" 
            />
          </div>

          <button
            type="submit"
            class="group mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            <Save :size="14" />
            <span>Save Changes</span>
          </button>
        </form>

        <div v-if="message" class="mx-6 mb-6 sm:mx-8 sm:mb-8 flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-medium text-emerald-700">
          <CheckCircle :size="14" stroke-width="1.5" class="shrink-0 mt-0.5" />
          <p>{{ message }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-fit">
        <div class="flex items-center justify-between border-b border-slate-100 p-6 sm:px-8">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
              <MapPinned :size="16" stroke-width="1.5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Shipping</p>
              <h2 class="text-xl font-bold tracking-tight text-slate-900">Saved Addresses</h2>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8 space-y-3.5">
          <article
            v-for="address in addresses"
            :key="address.id"
            class="group relative flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 border border-slate-100 transition group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950">
                <Home :size="14" stroke-width="1.5" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold tracking-tight text-slate-900 truncate">{{ address.street }}</p>
                <p class="mt-0.5 text-[11px] font-medium text-slate-500">{{ address.city }}, {{ address.postalCode }}</p>
                <p class="mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">{{ address.country }}</p>
              </div>
            </div>
            <button
              type="button"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition hover:bg-rose-100 active:scale-90"
              @click="handleDeleteAddress(address.id)"
            >
              <Trash2 :size="12" />
            </button>
          </article>

          <div v-if="!addresses.length" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="mb-3.5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
              <MapPinOff :size="24" stroke-width="1.5" />
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Addresses Saved</p>
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
import { useConfirm } from '../../composables/useConfirm'
import { 
  UserCircle, 
  User, 
  AtSign, 
  Phone, 
  Save, 
  CheckCircle, 
  MapPinned, 
  Home, 
  Trash2, 
  MapPinOff 
} from 'lucide-vue-next'

const { confirm } = useConfirm()
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
  message.value = 'Profile updated successfully!'
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleDeleteAddress = async (addressId) => {
  if (await confirm('Are you sure you want to delete this address?')) {
    await deleteAddress(authUser.value.uid, addressId)
    addresses.value = await listAddresses(authUser.value.uid)
  }
}

onMounted(loadProfile)
</script>