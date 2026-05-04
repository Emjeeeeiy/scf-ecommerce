<template>
  <AppShell subtitle="Checkout">
    <div
      v-if="showExclusiveNotice"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-100">
        <div class="bg-amber-400 p-6 text-slate-900">
           <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-4 shadow-inner">
             <MapPin :size="20" />
           </div>
           <h2 class="text-xl font-black tracking-tight">Delivery Area Notice</h2>
           <p class="mt-1 text-[8px] font-black opacity-60 uppercase tracking-[0.2em]">Service Advisory</p>
        </div>
        <div class="p-6">
          <p class="text-xs leading-relaxed text-slate-500">
            We currently only support orders within <span class="font-black text-slate-900">Oriental Mindoro</span>. Please ensure your delivery address is within this region.
          </p>
          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-slate-900 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-900/10"
            @click="dismissExclusiveNotice"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <!-- Customer Details Form -->
      <div v-if="!isAuthenticated" class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-10">
        <div class="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
            <User :size="20" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Step 1 of 2</p>
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Customer Details</h1>
          </div>
        </div>

        <form class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <User :size="10" />
              First Name
            </label>
            <input 
              v-model="form.firstName" 
              placeholder="John"
              class="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <User :size="10" />
              Last Name
            </label>
            <input 
              v-model="form.lastName" 
              placeholder="Doe"
              class="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <Mail :size="10" />
              Email Address
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="john@example.com"
              class="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <Phone :size="10" />
              Contact Number
            </label>
            <input 
              v-model="form.contactNo" 
              placeholder="0912 345 6789"
              class="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <MapPin :size="10" />
              Address
            </label>
            <textarea
              v-model="form.addressLine"
              rows="2"
              placeholder="Street, Barangay, Municipality"
              class="w-full rounded-xl border-none bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 shadow-sm outline-none ring-1 ring-slate-100 transition-all focus:bg-white focus:ring-2 focus:ring-slate-900"
              required
            ></textarea>
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <Globe :size="10" />
              Province
            </label>
            <div class="flex items-center justify-between rounded-xl border-none bg-slate-100 px-5 py-3">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Oriental Mindoro</span>
              <Lock :size="12" class="text-slate-300" />
            </div>
          </div>

          <!-- Payment Method -->
          <div class="md:col-span-2 mt-4 space-y-3">
            <label class="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <CreditCard :size="10" />
              Payment Method
            </label>
            <div class="grid gap-3 sm:grid-cols-3">
              <label 
                v-for="method in ['cod', 'gcash', 'bank']" 
                :key="method"
                class="relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition-all"
                :class="form.paymentMethod === method ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <div class="flex items-center justify-between">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10" v-if="method === 'cod'"><HandCoins :size="18" /></div>
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10" v-if="method === 'gcash'"><Wallet :size="18" /></div>
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10" v-if="method === 'bank'"><Landmark :size="18" /></div>
                  <div v-if="form.paymentMethod === method" class="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-sm">
                    <Check :size="10" />
                  </div>
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest">{{ method === 'cod' ? 'COD' : method.toUpperCase() }}</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Logged In Order Summary -->
      <div v-else class="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-10">
        <div class="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
            <CreditCard :size="20" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Authenticated Checkout</p>
            <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Payment Details</h1>
          </div>
        </div>

        <div class="mb-8 rounded-2xl bg-slate-50 p-6 border border-slate-100 shadow-inner">
          <div class="flex items-center justify-between mb-6">
             <h3 class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping Information</h3>
             <router-link to="/account/profile" class="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">Edit Profile</router-link>
          </div>
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <p class="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Recipient Name</p>
              <p class="text-xs font-black text-slate-900">{{ profile.firstName }} {{ profile.lastName }}</p>
            </div>
            <div>
              <p class="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Contact No.</p>
              <p class="text-xs font-black text-slate-900">{{ profile.contact }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Delivery Address</p>
              <p class="text-xs font-black text-slate-900 leading-relaxed">{{ profile.address }}</p>
              <p class="mt-1 text-[9px] font-black text-amber-500 uppercase tracking-widest">Oriental Mindoro</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
            Select Payment Method
          </label>
          <div class="grid gap-3 sm:grid-cols-3">
            <label 
              v-for="method in ['cod', 'gcash', 'bank']" 
              :key="method"
              class="relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-5 transition-all"
              :class="form.paymentMethod === method ? 'border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'"
            >
              <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
              <div class="flex items-center justify-between">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10" v-if="method === 'cod'"><HandCoins :size="20" /></div>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10" v-if="method === 'gcash'"><Wallet :size="20" /></div>
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10" v-if="method === 'bank'"><Landmark :size="20" /></div>
                <div v-if="form.paymentMethod === method" class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20">
                  <Check :size="12" />
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase tracking-[0.2em]">{{ method === 'cod' ? 'COD' : method.toUpperCase() }}</span>
                <span class="mt-0.5 text-[7px] font-bold opacity-50 uppercase tracking-tighter" v-if="method === 'cod'">Cash on Delivery</span>
                <span class="mt-0.5 text-[7px] font-bold opacity-50 uppercase tracking-tighter" v-else-if="method === 'gcash'">E-Wallet</span>
                <span class="mt-0.5 text-[7px] font-bold opacity-50 uppercase tracking-tighter" v-else-if="method === 'bank'">Bank Transfer</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Order Review Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
          <div class="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400 shadow-inner">
              <Eye :size="20" />
            </div>
            <h2 class="text-[9px] font-black uppercase tracking-[0.2em] text-white">Review Selection</h2>
          </div>

          <div class="max-h-[30vh] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="flex items-center justify-between gap-4 rounded-xl bg-white/5 p-3 ring-1 ring-white/5 transition-colors hover:bg-white/10"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800 shadow-inner">
                  <img
                    v-if="item.base64Image"
                    :src="item.base64Image"
                    :alt="item.productName"
                    class="h-full w-full object-cover opacity-90"
                  />
                  <div v-else class="flex h-full items-center justify-center text-[8px] text-slate-700 font-black uppercase">
                    NA
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-xs font-black text-white tracking-tight">{{ item.productName }}</p>
                  <p class="mt-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    {{ item.color }} · x{{ item.quantity }}
                  </p>
                </div>
              </div>
              <span class="text-xs font-black text-amber-400 tracking-tighter">{{ formatCurrency(item.basePrice * item.quantity) }}</span>
            </div>
          </div>

          <div class="mt-8 space-y-3 border-t border-white/10 pt-8">
            <div class="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <span>Order Subtotal</span>
              <span>{{ formatCurrency(cart.totalAmount) }}</span>
            </div>
            <div class="flex items-end justify-between pt-3">
              <div>
                <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1.5">Total Payable</p>
                <p class="text-3xl font-black text-amber-400 leading-none tracking-tighter">
                  {{ formatCurrency(cart.totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500"
            @click="handleCheckout"
          >
            <span>Place Order</span>
            <CheckCircle :size="18" />
          </button>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
           <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 shadow-inner">
                <ShieldCheck :size="14" />
              </div>
              <p class="text-[10px] font-bold leading-relaxed text-slate-500">
                Your order will be verified manually by our team. <span class="text-slate-900">100% of proceeds</span> go to missions.
              </p>
           </div>
        </div>
      </aside>
    </section>

    <!-- GCash Payment Modal -->
    <Transition 
      name="modal"
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-8"
    >
      <div v-if="showGcashModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
        <div class="absolute inset-0 bg-slate-900/80" @click="showGcashModal = false"></div>
        
        <div class="relative w-full max-w-xs overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <!-- Header -->
          <div class="bg-blue-600 p-8 text-center text-white">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
              <Wallet :size="32" />
            </div>
            <h3 class="text-2xl font-black tracking-tight">GCash Pay</h3>
            <p class="mt-1 text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Scan to Settle Payment</p>
          </div>

          <div class="p-8">
            <!-- QR Code -->
            <div class="mx-auto mb-8 aspect-square max-w-[180px] overflow-hidden rounded-2xl bg-slate-50 border-4 border-slate-50 p-2 shadow-inner">
              <img 
                v-if="paymentSettings.gcash.qrCodeBase64" 
                :src="paymentSettings.gcash.qrCodeBase64" 
                alt="GCash QR Code"
                class="h-full w-full object-contain"
              />
              <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
                <QrCode :size="40" stroke-width="1.5" />
                <span class="text-[8px] font-black uppercase tracking-widest">No QR Image</span>
              </div>
            </div>

            <!-- Account Details -->
            <div class="space-y-4 rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-100">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">Account Name</span>
                <span class="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{{ paymentSettings.gcash.accountName || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between pt-0.5">
                <span class="text-[8px] font-black uppercase tracking-widest text-slate-400">Number</span>
                <span class="text-xs font-black text-slate-900 tracking-widest">{{ paymentSettings.gcash.accountNumber || 'N/A' }}</span>
              </div>
            </div>

            <div class="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 border border-amber-100">
              <InfoIcon :size="14" class="shrink-0 text-amber-500" />
              <p class="text-[9px] font-bold leading-relaxed text-amber-900">
                Please <span class="text-slate-900 font-black">screenshot your receipt</span>. Our team will verify the transaction once processed.
              </p>
            </div>

            <!-- Action -->
            <div class="mt-8 flex gap-3">
              <button 
                @click="showGcashModal = false"
                class="flex-1 rounded-xl border-2 border-slate-100 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 transition hover:bg-slate-50 active:scale-95"
              >
                Cancel
              </button>
              <button 
                @click="processOrder"
                class="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-[9px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
              >
                <span>Done Paying</span>
                <ArrowRight :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { getCart } from '../../services/cartService'
import { checkoutCart } from '../../services/orderService'
import { getPaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../../services/settingsService'
import { useSession } from '../../composables/useSession'
import { formatCurrency } from '../../utils/format'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Lock, 
  Users, 
  CreditCard, 
  HandCoins, 
  Wallet, 
  Landmark, 
  Check, 
  FileText, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck,
  Package,
  QrCode,
  X,
  Info as InfoIcon,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated, profile } = useSession()
const cart = ref({ items: [], totalAmount: 0, totalItems: 0 })
const message = ref('')
const showExclusiveNotice = ref(false)
const showGcashModal = ref(false)
const paymentSettings = ref(DEFAULT_PAYMENT_SETTINGS)
const sellerContacts = ['Jhoe Anne Ramirez', 'Sandara Calaluan', 'Errold Santos', 'MJ may bitaw']
const CHECKOUT_NOTICE_KEY = 'scf_checkout_oriental_mindoro_notice_seen'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  addressLine: '',
  completeAddress: '',
  sellerContact: '',
  paymentMethod: '',
  notes: '',
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
  const [cartData, pSettings] = await Promise.all([
    getCart(),
    getPaymentSettings()
  ])
  cart.value = cartData
  paymentSettings.value = pSettings

  if (profile.value && isAuthenticated.value) {
    form.firstName = profile.value.firstName || ''
    form.lastName = profile.value.lastName || ''
    form.email = profile.value.email || ''
    form.contactNo = profile.value.contact || ''
    form.addressLine = profile.value.address || ''
  }

  const hasSeenNotice = localStorage.getItem(CHECKOUT_NOTICE_KEY)
  showExclusiveNotice.value = !hasSeenNotice
}

const dismissExclusiveNotice = () => {
  showExclusiveNotice.value = false
  localStorage.setItem(CHECKOUT_NOTICE_KEY, 'true')
}

const handleCheckout = async () => {
  if (!cart.value.items.length) {
    message.value = 'Your cart is empty. Please add items before checking out.'
    return
  }
  if (!form.paymentMethod) {
    message.value = 'Please select a payment method to continue.'
    return
  }
  
  // For guests, check all fields. For authenticated, fields are synced from profile.
  if (!form.firstName || !form.lastName || !form.contactNo || !form.addressLine) {
    message.value = 'Please fill in all required delivery details.'
    return
  }

  if (form.paymentMethod === 'gcash') {
    showGcashModal.value = true
    return
  }

  await processOrder()
}

const processOrder = async () => {
  try {
    const customerDetails = {
      ...form,
      completeAddress: `${form.addressLine.trim()}, Oriental Mindoro`,
    }

    const orderId = await checkoutCart({
      customerDetails,
      userId: isAuthenticated.value ? profile.value.id : null
    })

    message.value = `Order ${orderId} created successfully!`
    showGcashModal.value = false
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/shop')
    }, 2000)
  } catch (error) {
    message.value = error.message || 'Checkout failed. Please try again.'
  }
}

onMounted(loadCheckout)
</script>
