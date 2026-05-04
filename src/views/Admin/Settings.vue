<template>
  <AdminPanelLayout subtitle="Configure your workspace and storefront appearance.">
    <div class="space-y-6">
      <!-- Tab Navigation -->
      <div class="flex gap-1 rounded-2xl bg-slate-100 p-1.5 w-fit">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all"
          :class="activeTab === tab.id 
            ? 'bg-white text-slate-900 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>

      <!-- General Settings Tab -->
      <div v-if="activeTab === 'general'" class="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 class="text-lg font-black text-slate-950 tracking-tight">System Preferences</h3>
          <p class="mt-1 text-sm font-medium text-slate-500">Customize your admin dashboard experience.</p>
          
          <div class="mt-8 space-y-8">
            <div class="flex items-center justify-between py-2">
              <div>
                <p class="text-sm font-bold text-slate-950">Appearance Mode</p>
                <p class="text-xs font-medium text-slate-500">Toggle between light and dark themes for the admin panel.</p>
              </div>
              <div class="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <button 
                  @click="toggleTheme(false)"
                  class="flex h-8 w-12 items-center justify-center rounded-lg transition-all"
                  :class="!isDarkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                >
                  <Sun :size="16" />
                </button>
                <button 
                  @click="toggleTheme(true)"
                  class="flex h-8 w-12 items-center justify-center rounded-lg transition-all"
                  :class="isDarkMode ? 'bg-slate-900 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                >
                  <Moon :size="16" />
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between border-t border-slate-100 pt-8">
              <div>
                <p class="text-sm font-bold text-slate-950">Maintenance Mode</p>
                <p class="text-xs font-medium text-slate-500">Temporarily disable storefront access for customers.</p>
              </div>
              <button class="h-6 w-11 rounded-full bg-slate-200 p-1 transition-colors">
                <div class="h-4 w-4 rounded-full bg-white shadow-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Landing Page Editor Tab -->
      <div v-if="activeTab === 'landing'" class="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-black text-slate-950 tracking-tight">Landing Page Content</h3>
              <p class="mt-1 text-sm font-medium text-slate-500">Manage what users see on the home page.</p>
            </div>
            <button 
              @click="handleSave"
              :disabled="saving"
              class="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              <Save v-if="!saving" :size="16" />
              <Loader2 v-else :size="16" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-slate-400" />
          </div>

          <div v-else class="space-y-10">
            <!-- Hero Section -->
            <div class="space-y-4">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <Layout :size="14" /> Hero Section
              </h4>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Heading Title</label>
                  <input v-model="settings.hero.title" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <!-- <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Logo URL (Path)</label>
                  <input v-model="settings.hero.logoUrl" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                </div> -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                  <textarea v-model="settings.hero.description" rows="3" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                </div>
              </div>
            </div>

            <!-- Mission & Vision -->
            <div class="grid gap-10 md:grid-cols-2 border-t border-slate-100 pt-10">
              <div class="space-y-4">
                <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                  <Target :size="14" /> Mission
                </h4>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                    <input v-model="settings.mission.title" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                    <textarea v-model="settings.mission.description" rows="4" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                  <Eye :size="14" /> Vision
                </h4>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                    <input v-model="settings.vision.title" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                    <textarea v-model="settings.vision.description" rows="4" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- About Section -->
            <div class="space-y-4 border-t border-slate-100 pt-10">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <Info :size="14" /> About Section
              </h4>
              <div class="grid gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                  <input v-model="settings.about.title" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Content</label>
                  <textarea v-model="settings.about.description" rows="5" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900"></textarea>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="space-y-4 border-t border-slate-100 pt-10">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <Mail :size="14" /> Contact Details
              </h4>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Email</label>
                  <input v-model="settings.contact.email" type="email" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Location/Address</label>
                  <input v-model="settings.contact.address" type="text" class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Settings Tab -->
      <div v-if="activeTab === 'payment'" class="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-black text-slate-950 tracking-tight">Payment Methods</h3>
              <p class="mt-1 text-sm font-medium text-slate-500">Configure how customers pay for their orders.</p>
            </div>
            <button 
              @click="handleSave"
              :disabled="saving"
              class="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              <Save v-if="!saving" :size="16" />
              <Loader2 v-else :size="16" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-slate-400" />
          </div>

          <div v-else class="space-y-10">
            <!-- GCash Configuration -->
            <div class="space-y-6">
              <h4 class="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <Wallet :size="14" /> GCash Payment
              </h4>
              
              <div class="grid gap-8 md:grid-cols-[240px_1fr]">
                <!-- QR Code Preview/Upload -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold text-slate-700 uppercase tracking-wider text-center">GCash QR Code</p>
                  <div class="relative group aspect-square overflow-hidden rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center transition-all hover:border-amber-400">
                    <img 
                      v-if="paymentSettings.gcash.qrCodeBase64" 
                      :src="paymentSettings.gcash.qrCodeBase64" 
                      class="h-full w-full object-contain p-2"
                    />
                    <div v-else class="flex flex-col items-center gap-2 text-slate-300">
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
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Name</label>
                    <input 
                      v-model="paymentSettings.gcash.accountName" 
                      type="text" 
                      placeholder="e.g. JOHN D." 
                      class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Number</label>
                    <input 
                      v-model="paymentSettings.gcash.accountNumber" 
                      type="text" 
                      placeholder="e.g. 0912 345 6789" 
                      class="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900" 
                    />
                  </div>
                  <div class="rounded-xl bg-amber-50 p-4 border border-amber-100">
                    <p class="text-[10px] font-bold text-amber-700 leading-relaxed">
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
  Wallet,
  Image as ImageIcon,
  QrCode
} from 'lucide-vue-next'
import { 
  getLandingPageSettings, 
  saveLandingPageSettings,
  getPaymentSettings,
  savePaymentSettings
} from '../../services/settingsService'
import { useToast } from '../../composables/useToast'
import { useAdminTheme } from '../../composables/useAdminTheme'

const { success, error: toastError } = useToast()
const { isDarkMode, toggleTheme } = useAdminTheme()
const activeTab = ref('general')
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
  about: { title: '', description: '' },
  contact: { email: '', address: '' }
})

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
    settings.value = landingData
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
