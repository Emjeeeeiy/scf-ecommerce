<template>
  <AppShell subtitle="Account Settings">
    <section class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <!-- Profile Details Card -->
      <div class="rounded-3xl bg-white border border-slate-300 ring-1 ring-slate-100 flex flex-col h-fit">
        <div class="flex items-center gap-4 border-b border-slate-100 p-6 sm:px-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
            <UserCircle :size="20" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Personal Info</p>
            <h1 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Account Details</h1>
          </div>
        </div>

        <form class="p-6 sm:p-8 grid gap-5" @submit.prevent="handleSaveProfile">
          <div class="space-y-1.5">
            <label class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <AtSign :size="10" />
              Username
            </label>
            <input 
              v-model="profileForm.username" 
              placeholder="Your username"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none ring-1 ring-slate-50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400" 
            />
          </div>
          
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <User :size="10" />
                First Name
              </label>
              <input 
                v-model="profileForm.firstName" 
                placeholder="First name"
                class="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none ring-1 ring-slate-50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400" 
              />
            </div>
            <div class="space-y-1.5">
              <label class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <User :size="10" />
                Last Name
              </label>
              <input 
                v-model="profileForm.lastName" 
                placeholder="Last name"
                class="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400" 
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <Phone :size="10" />
              Contact Number
            </label>
            <input 
              v-model="profileForm.contact" 
              placeholder="09xx xxx xxxx"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none ring-1 ring-slate-50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-400" 
            />
          </div>

          <button
            type="submit"
            class="group mt-2 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <Save :size="14" />
            <span>Save Changes</span>
          </button>
        </form>

        <div v-if="message" class="mx-6 mb-6 sm:mx-8 sm:mb-8 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-100">
          <CheckCircle :size="14" class="shrink-0" />
          <p>{{ message }}</p>
        </div>
      </div>

      <!-- Addresses Card -->
      <div class="rounded-3xl bg-white border border-slate-300 ring-1 ring-slate-100 flex flex-col h-fit">
        <div class="flex items-center justify-between border-b border-slate-100 p-6 sm:px-8">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-lg shadow-slate-900/10">
              <MapPinned :size="20" />
            </div>
            <div>
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Shipping</p>
              <h2 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Saved Addresses</h2>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8 space-y-4">
          <article
            v-for="address in addresses"
            :key="address.id"
            class="group relative flex items-start justify-between rounded-2xl border border-slate-50 bg-slate-50/30 p-5 transition-all duration-500 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40"
          >
            <div class="flex items-start gap-4">
               <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-100 transition-all group-hover:bg-slate-900 group-hover:text-amber-400">
                  <Home :size="16" />
               </div>
               <div class="min-w-0">
                  <p class="text-xs font-black tracking-tight text-slate-900 truncate">{{ address.street }}</p>
                  <p class="mt-0.5 text-[10px] font-medium text-slate-400">{{ address.city }}, {{ address.postalCode }}</p>
                  <p class="mt-1.5 text-[8px] font-black text-amber-500 uppercase tracking-[0.2em]">{{ address.country }}</p>
               </div>
            </div>
            <button
              type="button"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white active:scale-90"
              @click="handleDeleteAddress(address.id)"
            >
              <Trash2 :size="14" />
            </button>
          </article>

          <div v-if="!addresses.length" class="flex flex-col items-center justify-center py-12 text-center">
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-200 shadow-inner">
              <MapPinOff :size="28" />
            </div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">No Addresses Saved</p>
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