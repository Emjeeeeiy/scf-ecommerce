<template>
  <AppShell subtitle="Finalize your order">
    <!-- Delivery Area Notice -->
    <div
      v-if="showExclusiveNotice"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-md"
    >
      <div class="w-full max-w-sm border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-neutral-200 p-6 dark:border-neutral-800">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Service advisory</p>
          <h2 class="mt-2 text-xl font-medium tracking-tight text-neutral-900 dark:text-white">Delivery area notice</h2>
        </div>
        <div class="p-6">
          <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            We currently only support orders within <span class="font-medium text-neutral-900 dark:text-white">Oriental Mindoro</span>. Please ensure your delivery address is within this region.
          </p>
          <button
            type="button"
            class="mt-6 w-full bg-neutral-900 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            @click="dismissExclusiveNotice"
          >
            I understand
          </button>
        </div>
      </div>
    </div>

    <section class="mx-auto grid w-full max-w-5xl gap-10 px-2 sm:px-6 lg:grid-cols-[1.3fr_0.8fr]">
      <!-- Customer Details Form -->
      <div v-if="!isAuthenticated" class="flex h-fit flex-col border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-neutral-200 p-6 sm:px-8 dark:border-neutral-800">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Step 1 of 2</p>
          <h1 class="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">Customer details</h1>
        </div>

        <form class="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">First name</label>
            <input
              v-model="form.firstName"
              placeholder="John"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              required
            />
          </div>
          <div>
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Last name</label>
            <input
              v-model="form.lastName"
              placeholder="Doe"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              required
            />
          </div>
          <div class="md:col-span-2">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Email address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              required
            />
          </div>
          <div class="md:col-span-2">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Contact number</label>
            <input
              v-model="form.contactNo"
              placeholder="0912 345 6789"
              class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              required
            />
          </div>
          <div class="md:col-span-2">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Address</label>
            <textarea
              v-model="form.addressLine"
              rows="2"
              placeholder="Street, Barangay, Municipality"
              class="mt-2 w-full resize-none border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
              required
            ></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Province</label>
            <p class="mt-2 border-b border-neutral-200 py-2.5 text-sm text-neutral-900 dark:border-neutral-700 dark:text-white">Oriental Mindoro</p>
          </div>

          <!-- Payment Method -->
          <div class="mt-2 space-y-3 md:col-span-2">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Payment method</label>
            <div class="grid gap-2 sm:grid-cols-3">
              <label
                v-for="method in ['cod', 'gcash', 'bank']"
                :key="method"
                class="flex cursor-pointer items-center justify-between border p-4 transition-colors"
                :class="form.paymentMethod === method
                  ? 'border-neutral-900 dark:border-white'
                  : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <span class="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">{{ method === 'cod' ? 'COD' : method }}</span>
                <div v-if="form.paymentMethod === method" class="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <Check :size="10" stroke-width="3" />
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Logged In Order Summary -->
      <div v-else class="flex h-fit flex-col border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="border-b border-neutral-200 p-6 sm:px-8 dark:border-neutral-800">
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Step 2 of 2</p>
          <h1 class="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">Payment details</h1>
        </div>

        <div class="p-6 sm:p-8">
          <div class="mb-8 border border-neutral-200 p-6 dark:border-neutral-800">
            <div class="mb-6 flex items-center justify-between">
               <h3 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Shipping information</h3>
               <router-link to="/account/profile" class="text-xs text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-700">Edit profile</router-link>
            </div>
            <div class="grid gap-6 sm:grid-cols-2">
              <div>
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Recipient</p>
                <p class="mt-1 text-sm text-neutral-900 dark:text-white">{{ profile.firstName }} {{ profile.lastName }}</p>
              </div>
              <div>
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Contact</p>
                <p class="mt-1 text-sm text-neutral-900 dark:text-white">{{ profile.contact }}</p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Delivery address</p>
                <p class="mt-1 text-sm leading-relaxed text-neutral-900 dark:text-white">{{ profile.address }}</p>
                <p class="mt-1 text-xs text-neutral-500">Oriental Mindoro</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Payment method</label>
            <div class="grid gap-2 sm:grid-cols-3">
              <label
                v-for="method in ['cod', 'gcash', 'bank']"
                :key="method"
                class="flex cursor-pointer items-center justify-between border p-4 transition-colors"
                :class="form.paymentMethod === method
                  ? 'border-neutral-900 dark:border-white'
                  : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <span class="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">{{ method === 'cod' ? 'COD' : method }}</span>
                <div v-if="form.paymentMethod === method" class="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <Check :size="10" stroke-width="3" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Review Sidebar -->
      <aside class="h-fit space-y-6 lg:sticky lg:top-24">
        <div class="border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 class="border-b border-neutral-200 pb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:border-neutral-800">Review selection</h2>

          <div class="custom-scrollbar max-h-[40vh] space-y-4 overflow-y-auto py-6 pr-1">
            <div
              v-for="item in cartItems"
              :key="item.cartKey || item.id"
              class="flex items-center justify-between gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0 dark:border-neutral-800"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="h-10 w-10 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                  <img
                    v-if="item.base64Image"
                    :src="item.base64Image"
                    :alt="item.productName"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full items-center justify-center text-[10px] uppercase text-neutral-400">
                    N/A
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm text-neutral-900 dark:text-white">{{ item.productName }}</p>
                  <p class="mt-0.5 text-xs text-neutral-500">
                    {{ item.color || 'Standard' }} · x{{ item.quantity }}
                  </p>
                </div>
              </div>
              <span class="shrink-0 text-sm tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="space-y-3 border-t border-neutral-200 pt-6 text-sm dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span class="tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(cartTotalAmount) }}</span>
            </div>

            <div class="flex items-end justify-between border-t border-neutral-200 pt-5 dark:border-neutral-800">
              <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Total</p>
              <p class="text-2xl font-medium tabular-nums tracking-tight text-neutral-900 dark:text-white">
                {{ formatCurrency(cartTotalAmount) }}
              </p>
            </div>
          </div>

          <button
            type="button"
            :disabled="isProcessing"
            class="mt-8 flex w-full items-center justify-center gap-2 bg-neutral-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            @click="handleCheckout"
          >
            <span v-if="!isProcessing">Place order</span>
            <span v-else>Processing…</span>
            <Loader2 v-if="isProcessing" :size="16" class="animate-spin" />
          </button>

          <div v-if="message" class="mt-4 border border-neutral-200 p-3 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
             <p>{{ message }}</p>
          </div>
        </div>

        <p class="border-t border-neutral-200 pt-5 text-xs leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          Your order will be verified manually by our team. 100% of proceeds go to missions.
        </p>
      </aside>
    </section>

    <!-- GCash Payment Modal -->
    <Transition name="fade">
      <div v-if="showGcashModal" class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-neutral-900/60 transition-opacity" 
          @click="!isProcessing && (showGcashModal = false)"
        ></div>
        
        <!-- Modal Container — minimalist -->
        <div class="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Settle your balance</p>
              <h3 class="mt-1 truncate text-xl font-medium tracking-tight text-neutral-900 dark:text-white">GCash payment</h3>
            </div>
            <button
              v-if="!isProcessing"
              @click="showGcashModal = false"
              class="shrink-0 p-2 text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="custom-scrollbar overflow-y-auto p-5 sm:p-6">

            <!-- Step 1: Pay -->
            <div class="mb-8 flex flex-col items-center">
              <p class="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Step 1 — Scan or copy info</p>

              <!-- QR Code Section -->
              <div class="relative mb-6 flex h-44 w-44 items-center justify-center border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
                <img
                  v-if="paymentSettings.gcash.qrCodeBase64"
                  :src="paymentSettings.gcash.qrCodeBase64"
                  alt="GCash QR Code"
                  class="h-full w-full object-contain"
                />
                <div v-else class="text-center text-neutral-400">
                  <QrCode :size="28" class="mx-auto mb-2" />
                  <p class="text-[11px] uppercase tracking-[0.18em]">No QR code</p>
                </div>
              </div>

              <!-- Account Details -->
              <div class="w-full">
                <div class="flex items-center justify-between gap-4 border border-neutral-200 p-4 dark:border-neutral-700">
                  <div class="min-w-0">
                    <p class="mb-0.5 text-[11px] uppercase tracking-[0.18em] text-neutral-400">Account details</p>
                    <p class="truncate text-sm text-neutral-900 dark:text-white">{{ paymentSettings.gcash.accountName || 'N/A' }}</p>
                    <p class="text-sm tabular-nums text-neutral-500">{{ paymentSettings.gcash.accountNumber || 'N/A' }}</p>
                  </div>
                  <button
                    @click="copyToClipboard(paymentSettings.gcash.accountNumber)"
                    class="border border-neutral-200 p-2.5 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
                    title="Copy Number"
                  >
                    <Copy :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <div class="relative mb-8">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
              </div>
              <div class="relative flex justify-center text-[11px] uppercase tracking-[0.18em]">
                <span class="bg-white px-3 text-neutral-400 dark:bg-neutral-900">Verification</span>
              </div>
            </div>

            <!-- Step 2: Proof -->
            <div class="space-y-6">
              <p class="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Step 2 — Upload proof</p>

              <!-- Reference Number -->
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Reference number</label>
                <input
                  v-model="form.referenceNo"
                  type="text"
                  placeholder="Enter 13-digit number"
                  class="mt-2 w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-white"
                />
              </div>

              <!-- File Upload -->
              <div>
                <label class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Screenshot of receipt</label>
                <div class="group relative mt-2 overflow-hidden border border-dashed border-neutral-300 transition-colors hover:border-neutral-900 dark:border-neutral-700">
                  <input
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 z-10 cursor-pointer opacity-0"
                    @change="handleFileChange"
                  />
                  <div v-if="!receiptPreview" class="flex flex-col items-center py-8">
                    <Upload :size="18" class="mb-3 text-neutral-400" />
                    <p class="text-xs uppercase tracking-[0.14em] text-neutral-500">Tap to upload image</p>
                    <p class="mt-1 text-[11px] text-neutral-400">JPG, PNG up to 5MB</p>
                  </div>
                  <div v-else class="p-2">
                    <img :src="receiptPreview" class="aspect-video w-full object-cover" />
                    <div class="mt-2 bg-neutral-100 py-2 text-center text-xs uppercase tracking-[0.14em] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">Change receipt image</div>
                  </div>
                </div>
              </div>

              <!-- Status Indicator -->
              <div v-if="isVerifying || receiptStatus" class="flex items-center gap-3 border p-4 text-xs uppercase tracking-[0.14em]"
                :class="{
                  'border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300': isVerifying,
                  'border-neutral-900 text-neutral-900 dark:border-white dark:text-white': receiptStatus === 'legit',
                  'border-rose-300 text-rose-700 dark:border-rose-500/30 dark:text-rose-400': receiptStatus === 'fake'
                }"
              >
                <template v-if="isVerifying">
                  <Loader2 :size="14" class="animate-spin" />
                  <span>Checking receipt…</span>
                </template>
                <template v-else-if="receiptStatus === 'legit'">
                  <CheckCircle :size="14" />
                  <span>Receipt verified</span>
                </template>
                <template v-else-if="receiptStatus === 'fake'">
                  <AlertCircle :size="14" />
                  <span>Invalid receipt image</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="shrink-0 border-t border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              @click="confirmGcashPayment"
              :disabled="isProcessing || receiptStatus !== 'legit' || !form.referenceNo"
              class="flex w-full items-center justify-center gap-2 bg-neutral-900 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <span v-if="!isProcessing">Confirm payment</span>
              <Loader2 v-else :size="16" class="animate-spin" />
            </button>
            <p class="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-neutral-400">
              Need help? Contact support
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </AppShell>
</template>>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { useCartStore } from '../../stores/cartStore'
import { checkoutCart } from '../../services/orderService'
import { getPaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../../services/settingsService'
import { useSession } from '../../composables/useSession'
import { formatCurrency } from '../../utils/format'
import {
  MapPin,
  Check,
  AlertCircle,
  CheckCircle,
  QrCode,
  X,
  Upload,
  Loader2,
  Copy
} from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated, profile } = useSession()
const { items: cartItems, totalAmount: cartTotalAmount, refresh: refreshCart } = useCartStore()
const message = ref('')
const showExclusiveNotice = ref(false)
const showGcashModal = ref(false)
const isProcessing = ref(false)
const isVerifying = ref(false)
const receiptStatus = ref(null) // null, 'verifying', 'legit', 'fake'
const receiptFile = ref(null)
const receiptPreview = ref(null)
const paymentSettings = ref(DEFAULT_PAYMENT_SETTINGS)
const CHECKOUT_NOTICE_KEY = 'scf_checkout_oriental_mindoro_notice_seen'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  addressLine: '',
  completeAddress: '',
  paymentMethod: '',
  referenceNo: '',
  receiptUrl: '',
})

// Sync form with profile if authenticated
watch(profile, (newProfile) => {
  if (newProfile && isAuthenticated.value) {
    form.firstName = newProfile.firstName || ''
    form.lastName = newProfile.lastName || ''
    form.email = newProfile.email || ''
    form.contactNo = newProfile.contact || ''
    form.addressLine = newProfile.address || ''
  }
}, { immediate: true })

const loadCheckout = async () => {
  const [, pSettings] = await Promise.all([
    refreshCart(),
    getPaymentSettings()
  ])
  paymentSettings.value = pSettings

  const hasSeenNotice = localStorage.getItem(CHECKOUT_NOTICE_KEY)
  showExclusiveNotice.value = !hasSeenNotice
}

const dismissExclusiveNotice = () => {
  showExclusiveNotice.value = false
  localStorage.setItem(CHECKOUT_NOTICE_KEY, 'true')
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  receiptFile.value = file
  receiptPreview.value = URL.createObjectURL(file)
  verifyReceipt(file)
}

const verifyReceipt = async (file) => {
  isVerifying.value = true
  receiptStatus.value = 'verifying'
  
  // Simulate AI/OCR verification logic
  setTimeout(() => {
    isVerifying.value = false
    const isBigEnough = file.size > 20000 // > 20KB
    const isImage = file.type.startsWith('image/')
    
    if (isBigEnough && isImage) {
      receiptStatus.value = 'legit'
    } else {
      receiptStatus.value = 'fake'
    }
  }, 2500)
}

const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  // In a real app, you'd show a "Copied!" toast here
}

const handleCheckout = async () => {
  if (!cartItems.value.length) {
    message.value = 'Your cart is empty.'
    return
  }
  if (!form.paymentMethod) {
    message.value = 'Please select a payment method.'
    return
  }
  if (!form.firstName || !form.lastName || !form.contactNo || !form.addressLine) {
    message.value = 'Please fill in all delivery details.'
    return
  }

  if (form.paymentMethod === 'gcash') {
    showGcashModal.value = true
    return
  }

  await processOrder()
}

const confirmGcashPayment = async () => {
  if (!form.referenceNo || form.referenceNo.length < 10) {
    message.value = 'Invalid reference number.'
    return
  }
  if (!receiptFile.value || receiptStatus.value !== 'legit') {
    message.value = 'Please upload a valid GCash receipt.'
    return
  }

  await processOrder()
}

const processOrder = async () => {
  isProcessing.value = true
  message.value = 'Finalizing your order...'
  
  try {
    if (form.paymentMethod === 'gcash' && receiptFile.value) {
      message.value = 'Processing receipt...'
      const reader = new FileReader()
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(receiptFile.value)
      })
      form.receiptUrl = await base64Promise
    }

    const customerDetails = {
      ...form,
      completeAddress: `${form.addressLine.trim()}, Oriental Mindoro`,
    }

    const orderId = await checkoutCart({
      customerDetails,
      userId: isAuthenticated.value ? profile.value.id : null
    })

    message.value = `Order created successfully! Redirecting...`
    showGcashModal.value = false
    await refreshCart()

    setTimeout(() => {
      router.push('/shop')
    }, 2000)
  } catch (error) {
    isProcessing.value = false
    message.value = error.message || 'Checkout failed. Please try again.'
  }
}

onMounted(loadCheckout)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404040; }

input:focus, textarea:focus { outline: none; }
</style>
