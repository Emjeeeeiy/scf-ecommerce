<template>
  <AdminPanelLayout subtitle="Configure your workspace and storefront appearance.">
    <div class="space-y-6">
      <!-- Tab Navigation -->
      <div class="flex gap-1 rounded-2xl bg-slate-100 dark:bg-neutral-800/50 p-1.5 w-fit">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 rounded-xl px-6 py-2.5 text-[10px] font-bold transition-all"
          :class="activeTab === tab.id 
            ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-white ' 
            : 'text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200'"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 ">
          <h3 class="text-lg font-black text-slate-950 dark:text-white tracking-tight">System Preferences</h3>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-neutral-400">Customize your admin dashboard experience.</p>
          
          <div class="mt-8 space-y-8">
            <div class="flex items-center justify-between py-2">
              <div>
                <p class="text-sm font-bold text-slate-950 dark:text-white">Appearance Mode</p>
                <p class="text-xs font-medium text-slate-500 dark:text-neutral-400">Toggle between light and dark themes for the admin panel.</p>
              </div>
              <div class="relative flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-neutral-800 p-1">
                <div
                  class="absolute left-1 top-1 h-8 w-12 rounded-lg bg-white  transition-transform duration-300 ease-out dark:bg-neutral-700"
                  :class="isDarkMode ? 'translate-x-13' : 'translate-x-0'"
                ></div>
                <button
                  type="button"
                  @click="handleToggleTheme(false, $event)"
                  class="relative z-10 flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-300"
                  :class="!isDarkMode ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'"
                >
                  <Sun :size="16" class="transition-transform duration-300" :class="!isDarkMode ? 'scale-110 rotate-0' : 'scale-90 -rotate-45'" />
                </button>
                <button
                  type="button"
                  @click="handleToggleTheme(true, $event)"
                  class="relative z-10 flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-300"
                  :class="isDarkMode ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'"
                >
                  <Moon :size="16" class="transition-transform duration-300" :class="isDarkMode ? 'scale-110 rotate-0' : 'scale-90 rotate-45'" />
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800 pt-8">
              <div>
                <p class="text-sm font-bold text-slate-950 dark:text-white">Maintenance Mode</p>
                <p class="text-xs font-medium text-slate-500 dark:text-neutral-400">Temporarily disable storefront access for customers.</p>
              </div>
              <button class="h-6 w-11 rounded-full bg-slate-200 dark:bg-neutral-800 p-1 transition-colors">
                <div class="h-4 w-4 rounded-full bg-white dark:bg-neutral-600 "></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Landing Page Editor Tab -->
      <div v-if="activeTab === 'landing'" class="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
        <div class="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 ">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-black text-slate-950 dark:text-white tracking-tight">Landing Page Content</h3>
              <p class="mt-1 text-sm font-medium text-slate-500 dark:text-neutral-400">Manage what users see on the home page.</p>
            </div>
            <button 
              @click="handleSave"
              :disabled="saving"
              class="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-neutral-400 px-6 py-2.5 text-sm font-bold text-white dark:text-neutral-950 transition-all hover:bg-slate-800 dark:hover:bg-neutral-300 disabled:opacity-50"
            >
              <Save v-if="!saving" :size="16" />
              <Loader2 v-else :size="16" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-slate-400 dark:text-neutral-600" />
          </div>

          <div v-else class="space-y-10">
            <!-- Hero Section -->
            <div class="space-y-4">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                <Layout :size="14" /> Hero Section
              </h4>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Heading Title</label>
                  <input v-model="settings.hero.title" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Description</label>
                  <textarea v-model="settings.hero.description" rows="3" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400"></textarea>
                </div>
              </div>
            </div>

            <!-- Mission & Vision -->
            <div class="grid gap-10 md:grid-cols-2 border-t border-slate-100 dark:border-neutral-800 pt-10">
              <div class="space-y-4">
                <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                  <Target :size="14" /> Mission
                </h4>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Title</label>
                    <input v-model="settings.mission.title" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Description</label>
                    <textarea v-model="settings.mission.description" rows="4" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400"></textarea>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                  <Eye :size="14" /> Vision
                </h4>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Title</label>
                    <input v-model="settings.vision.title" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Description</label>
                    <textarea v-model="settings.vision.description" rows="4" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Officers -->
            <div class="space-y-4 border-t border-slate-100 dark:border-neutral-800 pt-10">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                <Users :size="14" /> Officers
              </h4>
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Card Title</label>
                <input v-model="settings.officers.title" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
              </div>
              <div class="space-y-3">
                <div
                  v-for="(member, i) in settings.officers.members"
                  :key="i"
                  class="space-y-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                      <img
                        v-if="member.photoBase64"
                        :src="member.photoBase64"
                        :alt="member.name"
                        class="h-full w-full object-cover"
                      />
                      <span v-else class="text-lg font-black uppercase text-slate-500 dark:text-neutral-300">
                        {{ ((member.name || '?').trim().charAt(0) || '?').toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        @click="triggerOfficerPhotoPicker(i)"
                        class="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-neutral-400 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white dark:text-neutral-950 transition-all hover:bg-slate-800 dark:hover:bg-neutral-300"
                      >
                        <ImageIcon :size="14" />
                        {{ member.photoBase64 ? 'Change Photo' : 'Upload Photo' }}
                      </button>
                      <input :id="'officer-photo-' + i" type="file" accept="image/*" tabindex="-1" class="hidden" @change="handleOfficerPhotoUpload($event, i)" />
                      <button
                        v-if="member.photoBase64"
                        type="button"
                        @click="removeOfficerPhoto(i)"
                        class="rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Name</label>
                    <input v-model="member.name" type="text" placeholder="Full name" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Position</label>
                    <input v-model="member.position" type="text" placeholder="e.g. President" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                  </div>
                  <div class="flex items-end">
                    <button
                      type="button"
                      @click="removeOfficer(i)"
                      title="Remove officer"
                      class="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                @click="addOfficer"
                class="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-neutral-700 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-neutral-400 transition-all hover:border-slate-900 hover:text-slate-900 dark:hover:border-neutral-400 dark:hover:text-white"
              >
                <Plus :size="14" />
                Add Officer
              </button>
            </div>

            <!-- About Section -->
            <div class="space-y-4 border-t border-slate-100 dark:border-neutral-800 pt-10">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                <Info :size="14" /> About Section
              </h4>
              <div class="grid gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Title</label>
                  <input v-model="settings.about.title" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Content</label>
                  <textarea v-model="settings.about.description" rows="5" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400"></textarea>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-4 border-t border-slate-100 dark:border-neutral-800 pt-10">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                <Mail :size="14" /> Contact Details
              </h4>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Public Email</label>
                  <input v-model="settings.contact.email" type="email" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Location/Address</label>
                  <input v-model="settings.contact.address" type="text" class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Facebook Page URL</label>
                  <input v-model="settings.contact.facebook" type="url" placeholder="https://facebook.com/..." class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Settings Tab -->
      <div v-if="activeTab === 'payment'" class="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
        <div class="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 ">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-black text-slate-950 dark:text-white tracking-tight">Payment Methods</h3>
              <p class="mt-1 text-sm font-medium text-slate-500 dark:text-neutral-400">Configure how customers pay for their orders.</p>
            </div>
            <button 
              @click="handleSave"
              :disabled="saving"
              class="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-neutral-400 px-6 py-2.5 text-sm font-bold text-white dark:text-neutral-950 transition-all hover:bg-slate-800 dark:hover:bg-neutral-300 disabled:opacity-50"
            >
              <Save v-if="!saving" :size="16" />
              <Loader2 v-else :size="32" class="animate-spin text-slate-400 dark:text-neutral-600" />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-slate-400 dark:text-neutral-600" />
          </div>

          <div v-else class="space-y-10">
            <!-- GCash Configuration -->
            <div class="space-y-6">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
                <Wallet :size="14" /> GCash Payment
              </h4>
              
              <div class="grid gap-8 md:grid-cols-[240px_1fr]">
                <!-- QR Code Preview/Upload -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider text-center">GCash QR Code</p>
                  <div class="relative group aspect-square overflow-hidden rounded-2xl bg-slate-50 dark:bg-neutral-800/50 border-2 border-dashed border-slate-200 dark:border-neutral-700 flex items-center justify-center transition-all hover:border-neutral-400 dark:hover:border-neutral-400">
                    <img 
                      v-if="paymentSettings.gcash.qrCodeBase64" 
                      :src="paymentSettings.gcash.qrCodeBase64" 
                      class="h-full w-full object-contain p-2"
                    />
                    <div v-else class="flex flex-col items-center gap-2 text-slate-300 dark:text-neutral-600">
                      <QrCode :size="48" stroke-width="1.5" />
                      <span class="text-[10px] font-black uppercase tracking-widest">No QR Uploaded</span>
                    </div>
                    
                    <label class="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <input type="file" accept="image/*" class="sr-only" @change="handleImageUpload" />
                      <div class="flex flex-col items-center gap-1 text-white">
                        <ImageIcon :size="24" />
                        <span class="text-[10px] font-black uppercase tracking-widest">Update QR</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Account Details -->
                <div class="grid gap-6 content-start">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Account Name</label>
                    <input 
                      v-model="paymentSettings.gcash.accountName" 
                      type="text" 
                      placeholder="e.g. JOHN D." 
                      class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">Account Number</label>
                    <input 
                      v-model="paymentSettings.gcash.accountNumber" 
                      type="text" 
                      placeholder="e.g. 0912 345 6789" 
                      class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-neutral-400" 
                    />
                  </div>
                  <div class="rounded-xl bg-neutral-50 dark:bg-neutral-800/10 p-4 border border-neutral-100 dark:border-neutral-500/20">
                    <p class="text-[10px] font-bold text-neutral-700 dark:text-neutral-400 leading-relaxed">
                      <Info :size="12" class="inline mb-0.5 mr-1" />
                      Customers will see this QR code and account information when they select GCash as their payment method during checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminPanelLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { 
  Settings2, 
  Monitor, 
  Sun, 
  Moon, 
  Save, 
  Loader2,
  Layout,
  Target,
  Eye,
  Info,
  Mail,
  Facebook,
  Wallet,
  Image as ImageIcon,
  QrCode,
  Users,
  Plus,
  Trash2
} from 'lucide-vue-next'
import {
  DEFAULT_LANDING_PAGE_SETTINGS,
  getLandingPageSettings,
  saveLandingPageSettings,
  getPaymentSettings,
  savePaymentSettings
} from '../../services/settingsService'
import { useToast } from '../../composables/useToast'
import { useAdminTheme } from '../../composables/useAdminTheme'
import { runThemeTransition } from '../../utils/themeTransition'

const { success, error: toastError } = useToast()
const { isDarkMode, toggleTheme } = useAdminTheme()
const activeTab = ref('general')

const handleToggleTheme = (val, event) => {
  if (val === isDarkMode.value) return
  runThemeTransition(event, () => toggleTheme(val))
}
const loading = ref(true)
const saving = ref(false)

const tabs = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'landing', label: 'Landing Page', icon: Monitor },
  { id: 'payment', label: 'Payment', icon: Wallet },
]

const settings = ref({
  hero: { title: '', description: '', logoUrl: '' },
  mission: { title: '', description: '' },
  vision: { title: '', description: '' },
  officers: { title: '', members: [] },
  about: { title: '', description: '' },
  contact: { email: '', address: '', facebook: '' }
})

const addOfficer = () => {
  settings.value.officers.members.push({ name: '', position: '' })
}

const removeOfficer = (index) => {
  settings.value.officers.members.splice(index, 1)
}

const triggerOfficerPhotoPicker = (index) => {
  // Programmatic click (instead of a <label>) so focus never moves to the
  // hidden input — label focus was making the browser scroll the window and
  // flash white behind the h-screen admin shell when the picker opened.
  document.getElementById(`officer-photo-${index}`)?.click()
}

const handleOfficerPhotoUpload = (event, index) => {
  const [file] = event.target.files || []
  event.target.value = ''
  if (!file) return

  // Downscale to a small avatar JPEG so 5 photos stay far under Firestore's
  // 1MB per-document limit (raw uploads were ~1.2MB and failed to save).
  const MAX_SIDE = 256
  const objectUrl = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * scale))
    const h = Math.max(1, Math.round(img.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(img, 0, 0, w, h)
    URL.revokeObjectURL(objectUrl)
    settings.value.officers.members[index].photoBase64 = canvas.toDataURL('image/jpeg', 0.72)
  }
  img.onerror = () => {
    URL.revokeObjectURL(objectUrl)
    toastError('Could not read that image file.')
  }
  img.src = objectUrl
}

const removeOfficerPhoto = (index) => {
  settings.value.officers.members[index].photoBase64 = ''
}

const paymentSettings = ref({
  gcash: {
    qrCodeBase64: '',
    accountName: '',
    accountNumber: ''
  }
})

onMounted(async () => {
  try {
    const [landingData, paymentData] = await Promise.all([
      getLandingPageSettings(),
      getPaymentSettings()
    ])
    // Backfill newer keys so docs saved before they existed still edit cleanly.
    settings.value = {
      ...landingData,
      officers: {
        title: landingData.officers?.title ?? DEFAULT_LANDING_PAGE_SETTINGS.officers.title,
        members: Array.isArray(landingData.officers?.members)
          ? landingData.officers.members
          : DEFAULT_LANDING_PAGE_SETTINGS.officers.members.map((m) => ({ ...m })),
      },
    }
    paymentSettings.value = paymentData
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
})

const handleImageUpload = (event) => {
  const [file] = event.target.files || []
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    paymentSettings.value.gcash.qrCodeBase64 = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

const handleSave = async () => {
  saving.value = true
  try {
    if (activeTab.value === 'landing') {
      await saveLandingPageSettings(settings.value)
    } else if (activeTab.value === 'payment') {
      await savePaymentSettings(paymentSettings.value)
    }
    success('Settings saved successfully!')
  } catch (error) {
    console.error('Failed to save settings:', error)
    toastError('Failed to save settings.')
  } finally {
    saving.value = false
  }
}
</script>

