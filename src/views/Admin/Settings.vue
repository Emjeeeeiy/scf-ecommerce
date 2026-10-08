<template>
  <AdminPanelLayout>
    <div class="space-y-4 sm:space-y-5">
      <AdminPageHead
        eyebrow="System"
        title="Settings"
        description="Manage storefront content and workspace preferences."
      />

      <!-- Tab navigation -->
      <div class="flex w-fit gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800/60">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition sm:px-5"
          :class="activeTab === tab.id
            ? 'bg-white text-neutral-900  dark:bg-neutral-700 dark:text-white'
            : 'text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200'"
        >
          <component :is="tab.icon" :size="14" />
          {{ tab.label }}
        </button>
      </div>

      <!-- General tab -->
      <div v-if="activeTab === 'general'">
        <div class="admin-card p-5 sm:p-6">
          <h3 class="admin-card-title">System preferences</h3>
          <p class="admin-muted mt-1">Customize your admin dashboard experience.</p>

          <div class="mt-6 flex items-center justify-between gap-4 py-2">
            <div>
              <p class="text-sm font-bold text-neutral-900 dark:text-white">Appearance</p>
              <p class="admin-muted mt-0.5">Toggle between light and dark themes for the admin panel.</p>
            </div>
              <div class="relative flex items-center gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
                <div
                  class="absolute left-1 top-1 h-8 w-12 rounded-lg bg-white  transition-transform duration-300 ease-out dark:bg-neutral-700"
                  :class="isDarkMode ? 'translate-x-13' : 'translate-x-0'"
                ></div>
                <button
                  type="button"
                  @click="handleToggleTheme(false, $event)"
                  class="relative z-10 flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-300"
                  :class="!isDarkMode ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'"
                >
                  <Sun :size="16" class="transition-transform duration-300" :class="!isDarkMode ? 'scale-110 rotate-0' : 'scale-90 -rotate-45'" />
                </button>
                <button
                  type="button"
                  @click="handleToggleTheme(true, $event)"
                  class="relative z-10 flex h-8 w-12 items-center justify-center rounded-lg transition-colors duration-300"
                  :class="isDarkMode ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'"
                >
                  <Moon :size="16" class="transition-transform duration-300" :class="isDarkMode ? 'scale-110 rotate-0' : 'scale-90 rotate-45'" />
                </button>
              </div>
            </div>
          </div>
        </div>

      <!-- Landing page editor tab -->
      <div v-if="activeTab === 'landing'" class="space-y-4 sm:space-y-5">
        <div class="admin-card p-5 sm:p-6">
          <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="admin-card-title">Landing page content</h3>
              <p class="admin-muted mt-1">Sections follow the same order as the home page, top to bottom.</p>
            </div>
            <button
              @click="handleSave"
              :disabled="saving"
              class="admin-btn admin-btn-primary shrink-0"
            >
              <Save v-if="!saving" :size="14" />
              <Loader2 v-else :size="14" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-neutral-400 dark:text-neutral-600" />
          </div>

          <div v-else class="space-y-10">
            <!-- 1 · Hero -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">1</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Hero</h4>
                  <p class="admin-muted">Top of the home page — headline and intro.</p>
                </div>
              </div>
              <div class="grid gap-4 lg:grid-cols-2">
                <div class="space-y-4">
                  <div>
                    <label class="admin-label">Headline</label>
                    <input v-model="settings.hero.title" type="text" placeholder="Silangan Christian Fellowship" class="admin-field-lg" />
                    <p class="mt-1.5 text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">Each word appears on its own line. The last word is highlighted in amber.</p>
                  </div>
                  <div>
                    <label class="admin-label">Intro</label>
                    <textarea v-model="settings.hero.description" rows="3" class="admin-field-lg"></textarea>
                  </div>
                </div>
                <div class="h-fit rounded-lg bg-neutral-950 p-5 dark:bg-black">
                  <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Preview</p>
                  <p class="mt-3 font-heading text-2xl font-extrabold uppercase leading-[1.1]">
                    <span
                      v-for="(word, i) in heroPreviewWords"
                      :key="i"
                      class="block"
                      :class="i === heroPreviewWords.length - 1 ? 'text-amber-400' : 'text-white'"
                    >{{ word }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- 2 · Latest arrivals (automatic) -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">2</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Latest arrivals</h4>
                  <p class="admin-muted">Product rail under the hero.</p>
                </div>
              </div>
              <div class="flex items-start gap-3 rounded-lg bg-neutral-100/70 p-4 dark:bg-neutral-800/50">
                <Info :size="16" class="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                <p class="text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  This section fills itself with your 6 newest products — nothing to edit here. Add or update products in
                  <router-link to="/admin/products" class="font-bold text-neutral-900 underline underline-offset-2 dark:text-white">Products</router-link>.
                </p>
              </div>
            </div>

            <!-- 3 · Mission & Vision -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">3</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Mission &amp; Vision</h4>
                  <p class="admin-muted">Side-by-side cards under “Our Purpose”.</p>
                </div>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 sm:p-5">
                  <p class="admin-eyebrow">Mission</p>
                  <div>
                    <label class="admin-label">Title</label>
                    <input v-model="settings.mission.title" type="text" class="admin-field-lg" />
                  </div>
                  <div>
                    <label class="admin-label">Description</label>
                    <textarea v-model="settings.mission.description" rows="4" class="admin-field-lg"></textarea>
                  </div>
                </div>
                <div class="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 sm:p-5">
                  <p class="admin-eyebrow">Vision</p>
                  <div>
                    <label class="admin-label">Title</label>
                    <input v-model="settings.vision.title" type="text" class="admin-field-lg" />
                  </div>
                  <div>
                    <label class="admin-label">Description</label>
                    <textarea v-model="settings.vision.description" rows="4" class="admin-field-lg"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4 · Officers -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">4</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Officers</h4>
                  <p class="admin-muted">Leadership list with photos and positions.</p>
                </div>
              </div>
              <div>
                <label class="admin-label">Section title</label>
                <input v-model="settings.officers.title" type="text" class="admin-field-lg" />
              </div>
              <div class="space-y-3">
                <div
                  v-for="(member, i) in settings.officers.members"
                  :key="i"
                  class="space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-4"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <img
                        v-if="member.photoBase64"
                        :src="member.photoBase64"
                        :alt="member.name"
                        class="h-full w-full object-cover"
                      />
                      <span v-else class="text-lg font-bold uppercase text-neutral-500 dark:text-neutral-300">
                        {{ ((member.name || '?').trim().charAt(0) || '?').toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        @click="triggerOfficerPhotoPicker(i)"
                        class="admin-btn admin-btn-primary px-4 py-2"
                      >
                        <ImageIcon :size="14" />
                        {{ member.photoBase64 ? 'Change Photo' : 'Upload Photo' }}
                      </button>
                      <input :id="'officer-photo-' + i" type="file" accept="image/*" tabindex="-1" class="hidden" @change="handleOfficerPhotoUpload($event, i)" />
                      <button
                        v-if="member.photoBase64"
                        type="button"
                        @click="removeOfficerPhoto(i)"
                        class="rounded-lg px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <label class="admin-label">Name</label>
                    <input v-model="member.name" type="text" placeholder="Full name" class="admin-field" />
                  </div>
                  <div>
                    <label class="admin-label">Position</label>
                    <input v-model="member.position" type="text" placeholder="e.g. President" class="admin-field" />
                  </div>
                  <div class="flex items-end">
                    <button
                      type="button"
                      @click="removeOfficer(i)"
                      title="Remove officer"
                      class="flex h-11 w-11 items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
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
                class="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-all hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-white"
              >
                <Plus :size="14" />
                Add Officer
              </button>
            </div>

            <!-- 5 · Basis of Faith -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">5</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Basis of Faith</h4>
                  <p class="admin-muted">Numbered belief statements under “What We Believe”.</p>
                </div>
              </div>
              <div>
                <label class="admin-label">Section title</label>
                <input v-model="settings.basisOfFaith.title" type="text" class="admin-field-lg" />
              </div>
              <div class="space-y-2.5">
                <div
                  v-for="(point, i) in settings.basisOfFaith.points"
                  :key="i"
                  class="flex items-start gap-2.5"
                >
                  <span class="w-6 shrink-0 pt-3.5 text-right text-xs font-bold tabular-nums text-neutral-400 dark:text-neutral-500">{{ i + 1 }}</span>
                  <textarea v-model="settings.basisOfFaith.points[i]" rows="2" class="admin-field-lg"></textarea>
                  <button
                    type="button"
                    @click="removeBasisPoint(i)"
                    title="Remove point"
                    aria-label="Remove point"
                    class="admin-icon-btn mt-1.5 shrink-0 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                @click="addBasisPoint"
                class="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 px-5 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-all hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-neutral-400 dark:hover:text-white"
              >
                <Plus :size="14" />
                Add Point
              </button>
            </div>

            <!-- 6 · About -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">6</span>
                <div>
                  <h4 class="admin-card-title leading-tight">About</h4>
                  <p class="admin-muted">Story block near the bottom of the page.</p>
                </div>
              </div>
              <div class="grid gap-4">
                <div>
                  <label class="admin-label">Title</label>
                  <input v-model="settings.about.title" type="text" class="admin-field-lg" />
                </div>
                <div>
                  <label class="admin-label">Content</label>
                  <textarea v-model="settings.about.description" rows="5" class="admin-field-lg"></textarea>
                </div>
              </div>
            </div>

            <!-- 7 · Contact -->
            <div class="space-y-4 border-t border-neutral-100 pt-8 dark:border-neutral-800">
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-heading text-xs font-bold text-white dark:bg-white dark:text-neutral-900">7</span>
                <div>
                  <h4 class="admin-card-title leading-tight">Contact</h4>
                  <p class="admin-muted">Bottom of the page — heading, intro and channels.</p>
                </div>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="admin-label">Heading</label>
                  <input v-model="settings.contact.title" type="text" class="admin-field-lg" />
                </div>
                <div>
                  <label class="admin-label">Location / Address</label>
                  <input v-model="settings.contact.address" type="text" class="admin-field-lg" />
                </div>
                <div class="md:col-span-2">
                  <label class="admin-label">Intro</label>
                  <textarea v-model="settings.contact.intro" rows="2" class="admin-field-lg"></textarea>
                </div>
                <div>
                  <label class="admin-label">Public email</label>
                  <input v-model="settings.contact.email" type="email" class="admin-field-lg" />
                </div>
                <div>
                  <label class="admin-label">Facebook page URL</label>
                  <input v-model="settings.contact.facebook" type="url" placeholder="https://facebook.com/..." class="admin-field-lg" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-2.5 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
            <router-link
              to="/"
              class="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white"
            >
              <ExternalLink :size="14" />
              Preview home page
            </router-link>
            <button
              @click="handleSave"
              :disabled="saving"
              class="admin-btn admin-btn-primary w-full sm:w-auto"
            >
              <Save v-if="!saving" :size="14" />
              <Loader2 v-else :size="14" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Payment tab -->
      <div v-if="activeTab === 'payment'" class="space-y-4 sm:space-y-5">
        <div class="admin-card p-5 sm:p-6">
          <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="admin-card-title">Payment methods</h3>
              <p class="admin-muted mt-1">Configure how customers pay for their orders.</p>
            </div>
            <button
              @click="handleSave"
              :disabled="saving"
              class="admin-btn admin-btn-primary shrink-0"
            >
              <Save v-if="!saving" :size="14" />
              <Loader2 v-else :size="14" class="animate-spin" />
              {{ saving ? 'Saving...' : 'Save changes' }}
            </button>
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <Loader2 :size="32" class="animate-spin text-neutral-400 dark:text-neutral-600" />
          </div>

          <div v-else class="space-y-10">
            <!-- GCash Configuration -->
            <div class="space-y-6">
              <h4 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                <Wallet :size="14" /> GCash Payment
              </h4>
              
              <div class="grid gap-8 md:grid-cols-[240px_1fr]">
                <!-- QR Code Preview/Upload -->
                <div class="space-y-4">
                  <p class="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-center">GCash QR Code</p>
                  <div class="relative group aspect-square overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all hover:border-neutral-400 dark:hover:border-neutral-400">
                    <img 
                      v-if="paymentSettings.gcash.qrCodeBase64" 
                      :src="paymentSettings.gcash.qrCodeBase64" 
                      class="h-full w-full object-contain p-2"
                    />
                    <div v-else class="flex flex-col items-center gap-2 text-neutral-300 dark:text-neutral-600">
                      <QrCode :size="48" stroke-width="1.5" />
                      <span class="text-[10px] font-bold uppercase tracking-widest">No QR Uploaded</span>
                    </div>
                    
                    <label class="absolute inset-0 flex cursor-pointer items-center justify-center bg-neutral-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <input type="file" accept="image/*" class="sr-only" @change="handleImageUpload" />
                      <div class="flex flex-col items-center gap-1 text-white">
                        <ImageIcon :size="24" />
                        <span class="text-[10px] font-bold uppercase tracking-widest">Update QR</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Account Details -->
                <div class="grid gap-6 content-start">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Account Name</label>
                    <input 
                      v-model="paymentSettings.gcash.accountName" 
                      type="text" 
                      placeholder="e.g. JOHN D." 
                      class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Account Number</label>
                    <input 
                      v-model="paymentSettings.gcash.accountNumber" 
                      type="text" 
                      placeholder="e.g. 0912 345 6789" 
                      class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-4 text-sm font-medium text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400" 
                    />
                  </div>
                  <div class="rounded-lg bg-neutral-50 dark:bg-neutral-800/10 p-4 border border-neutral-100 dark:border-neutral-500/20">
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
import { ref, computed, onMounted, watch } from 'vue'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import AdminPageHead from '../../components/AdminPageHead.vue'
import {
  Settings2,
  Monitor,
  Sun,
  Moon,
  Save,
  Loader2,
  Info,
  Wallet,
  Image as ImageIcon,
  QrCode,
  Plus,
  Trash2,
  ExternalLink
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
  hero: { title: '', description: '' },
  mission: { title: '', description: '' },
  vision: { title: '', description: '' },
  officers: { title: '', members: [] },
  basisOfFaith: { title: '', points: [] },
  about: { title: '', description: '' },
  contact: { email: '', address: '', facebook: '', title: '', intro: '' }
})

// Mirrors the landing page headline: one word per line, last word amber.
const heroPreviewWords = computed(() => {
  const raw = (settings.value.hero?.title || '').trim()
  const source = raw === '' || raw.toUpperCase() === 'SCF'
    ? DEFAULT_LANDING_PAGE_SETTINGS.hero.title
    : raw
  return source.split(/\s+/).filter(Boolean)
})

const addBasisPoint = () => {
  settings.value.basisOfFaith.points.push('')
}

const removeBasisPoint = (index) => {
  settings.value.basisOfFaith.points.splice(index, 1)
}

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
    // Backfill newer keys so docs saved before they existed still edit
    // cleanly. Nested objects are cloned so editing never mutates defaults.
    const landing = landingData || {}
    const defaultOfficers = DEFAULT_LANDING_PAGE_SETTINGS.officers
    const defaultFaith = DEFAULT_LANDING_PAGE_SETTINGS.basisOfFaith
    const defaultContact = DEFAULT_LANDING_PAGE_SETTINGS.contact
    settings.value = {
      hero: { title: '', description: '', ...(landing.hero || {}) },
      mission: { title: '', description: '', ...(landing.mission || {}) },
      vision: { title: '', description: '', ...(landing.vision || {}) },
      officers: {
        title: landing.officers?.title ?? defaultOfficers.title,
        members: Array.isArray(landing.officers?.members)
          ? landing.officers.members.map((m) => ({ ...m }))
          : defaultOfficers.members.map((m) => ({ ...m })),
      },
      basisOfFaith: {
        title: landing.basisOfFaith?.title ?? defaultFaith.title,
        points: Array.isArray(landing.basisOfFaith?.points)
          ? [...landing.basisOfFaith.points]
          : [...defaultFaith.points],
      },
      about: { title: '', description: '', ...(landing.about || {}) },
      contact: {
        email: '',
        address: '',
        facebook: '',
        title: defaultContact.title,
        intro: defaultContact.intro,
        ...(landing.contact || {}),
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

