<template>
  <AppShell subtitle="Account Settings">
    <section class="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <!-- Profile Details Card -->
      <div class="rounded-2xl bg-white p-6 shadow-xl shadow-blue-100/50 ring-1 ring-blue-50 sm:p-8">
        <div class="flex items-center gap-4 border-b border-blue-50 pb-6 mb-6">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
            <UserCircle :size="20" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-blue-400 leading-none mb-1">Personal Info</p>
            <h1 class="text-2xl font-black tracking-tighter text-blue-900 sm:text-3xl">Account Details</h1>
          </div>
        </div>

        <form class="grid gap-5" @submit.prevent="handleSaveProfile">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <AtSign :size="12" />
              Username
            </label>
            <input 
              v-model="profileForm.username" 
              placeholder="Your username"
              class="w-full rounded-xl border border-blue-50 bg-blue-50/30 px-4 py-3 text-sm font-bold text-blue-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600" 
            />
          </div>
          
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                <User :size="12" />
                First Name
              </label>
              <input 
                v-model="profileForm.firstName" 
                placeholder="First name"
                class="w-full rounded-xl border border-blue-50 bg-blue-50/30 px-4 py-3 text-sm font-bold text-blue-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600" 
              />
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                <User :size="12" />
                Last Name
              </label>
              <input 
                v-model="profileForm.lastName" 
                placeholder="Last name"
                class="w-full rounded-xl border border-blue-50 bg-blue-50/30 px-4 py-3 text-sm font-bold text-blue-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600" 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <Phone :size="12" />
              Contact Number
            </label>
            <input 
              v-model="profileForm.contact" 
              placeholder="09xx xxx xxxx"
              class="w-full rounded-xl border border-blue-50 bg-blue-50/30 px-4 py-3 text-sm font-bold text-blue-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600" 
            />
          </div>

          <button
            type="submit"
            class="group mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-black text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Save :size="16" />
            <span>Save Changes</span>
          </button>
        </form>

        <div v-if="message" class="mt-6 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-[11px] font-bold text-green-600 ring-1 ring-green-100">
          <CheckCircle :size="14" class="shrink-0" />
          <p>{{ message }}</p>
        </div>
      </div>

      <!-- Addresses Card -->
      <div class="rounded-2xl bg-white p-6 shadow-xl shadow-blue-100/50 ring-1 ring-blue-50 sm:p-8">
        <div class="flex items-center justify-between border-b border-blue-50 pb-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPinned :size="20" />
            </div>
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-blue-400 leading-none mb-1">Shipping</p>
              <h2 class="text-2xl font-black tracking-tighter text-blue-900 sm:text-3xl">Saved Addresses</h2>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <article
            v-for="address in addresses"
            :key="address.id"
            class="group relative flex items-start justify-between rounded-xl border border-blue-50 bg-blue-50/10 p-5 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-lg"
          >
            <div class="flex items-start gap-4">
               <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-400 ring-1 ring-blue-50 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                  <Home :size="16" />
               </div>
               <div>
                  <p class="text-sm font-black tracking-tight text-blue-900">{{ address.street }}</p>
                  <p class="mt-1 text-xs font-medium text-blue-500">{{ address.city }}, {{ address.postalCode }}</p>
                  <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{{ address.country }}</p>
               </div>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:text-red-600 active:scale-90"
              @click="handleDeleteAddress(address.id)"
            >
              <Trash2 :size="16" />
            </button>
          </article>

          <div v-if="!addresses.length" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50/50 text-blue-200">
              <MapPinOff :size="32" />
            </div>
            <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">No Addresses Saved</p>
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