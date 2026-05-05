<template>
  <AppShell subtitle="Checkout">
    <!-- Delivery Area Notice (Unchanged) -->
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
      <!-- Customer Details Form (Unchanged) -->
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

      <!-- Logged In Order Summary (Unchanged) -->
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

      <!-- Order Review Sidebar (Unchanged) -->
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
            :disabled="isProcessing"
            class="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500"
            @click="handleCheckout"
          >
            <span v-if="!isProcessing">Place Order</span>
            <span v-else>Processing...</span>
            <CheckCircle v-if="!isProcessing" :size="18" />
            <Loader2 v-else :size="18" class="animate-spin" />
          </button>
          
          <p v-if="message" class="mt-4 text-center text-[10px] font-bold uppercase tracking-widest" :class="message.includes('success') ? 'text-emerald-400' : 'text-rose-400'">
            {{ message }}
          </p>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
           <div class="items-start gap-3 flex">
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

    <!-- GCash Payment Modal (Redesigned) -->
    <Transition name="fade">
      <div v-if="showGcashModal" class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/60 transition-opacity" 
          @click="!isProcessing && (showGcashModal = false)"
        ></div>
        
        <!-- Modal Container -->
        <!-- Responsive Width: 95% sa mobile, max-w-md sa desktop -->
        <div class="relative w-[95%] sm:w-full sm:max-w-md overflow-hidden rounded-4xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
          
          <!-- Header: Sticky sa taas -->
          <div class="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6 bg-white shrink-0">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Wallet :size="20" />
              </div>
              <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-bold text-slate-900 truncate">GCash Payment</h3>
                <p class="text-[10px] sm:text-xs text-slate-500 truncate">Settle your balance via GCash</p>
              </div>
            </div>
            <button 
              v-if="!isProcessing" 
              @click="showGcashModal = false"
              class="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="overflow-y-auto p-5 sm:p-6 custom-scrollbar">
            
            <!-- Step 1: Pay -->
            <div class="mb-6 flex flex-col items-center">
              <div class="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Step 1: Scan or Copy Info
              </div>
              
              <!-- QR Code Section: Responsive size -->
              <div class="relative mb-6 flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                <img 
                  v-if="paymentSettings.gcash.qrCodeBase64" 
                  :src="paymentSettings.gcash.qrCodeBase64" 
                  alt="GCash QR Code"
                  class="h-28 w-28 sm:h-36 sm:w-36 object-contain"
                />
                <div v-else class="text-center text-slate-300">
                  <QrCode :size="32" class="mx-auto mb-1" />
                  <p class="text-[10px] uppercase font-bold">No QR Code</p>
                </div>
              </div>

              <!-- Account Details: Stackable sa super small screens if needed -->
              <div class="w-full space-y-3">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div class="min-w-0">
                    <p class="text-[9px] font-bold uppercase tracking-tight text-slate-400">Account Name</p>
                    <p class="font-bold text-slate-800 wrap-break-word">{{ paymentSettings.gcash.accountName || 'N/A' }}</p>
                  </div>
                  <div class="flex items-center justify-between w-full sm:w-auto sm:text-right gap-3">
                    <div class="min-w-0">
                      <p class="text-[9px] font-bold uppercase tracking-tight text-slate-400">GCash Number</p>
                      <p class="font-bold text-slate-800">{{ paymentSettings.gcash.accountNumber || 'N/A' }}</p>
                    </div>
                    <button 
                      @click="copyToClipboard(paymentSettings.gcash.accountNumber)" 
                      class="rounded-lg bg-white p-2 text-blue-600 shadow-sm hover:bg-blue-50 active:scale-90 transition-all border border-slate-100"
                    >
                      <Copy :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr class="mb-6 border-slate-100" />

            <!-- Step 2: Proof -->
            <div class="space-y-5">
              <div class="text-center">
                <div class="mb-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Step 2: Upload Proof
                </div>
              </div>

              <!-- Reference Number -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 ml-1">Reference Number</label>
                <input 
                  v-model="form.referenceNo"
                  type="text" 
                  placeholder="Enter 13-digit number"
                  class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <!-- File Upload -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700 ml-1">Screenshot of Receipt</label>
                <div class="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100">
                  <input 
                    type="file" 
                    accept="image/*"
                    class="absolute inset-0 z-10 cursor-pointer opacity-0"
                    @change="handleFileChange"
                  />
                  <div v-if="!receiptPreview" class="flex flex-col items-center py-6 sm:py-8">
                    <Upload :size="24" class="mb-2 text-slate-400" />
                    <p class="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Tap to upload image</p>
                  </div>
                  <div v-else class="p-2">
                    <img :src="receiptPreview" class="aspect-video w-full rounded-lg object-cover" />
                    <div class="mt-2 text-center text-[10px] font-bold text-blue-600 uppercase">Change Image</div>
                  </div>
                </div>
              </div>

              <!-- Status Indicator -->
              <div v-if="isVerifying || receiptStatus" class="flex items-center gap-3 rounded-xl p-3 text-xs font-bold transition-all animate-in fade-in slide-in-from-top-2">
                <template v-if="isVerifying">
                  <Loader2 :size="16" class="animate-spin text-blue-500" />
                  <span class="text-slate-600">Checking receipt...</span>
                </template>
                <template v-else-if="receiptStatus === 'legit'">
                  <CheckCircle :size="16" class="text-emerald-500" />
                  <span class="text-emerald-600">Receipt verified!</span>
                </template>
                <template v-else-if="receiptStatus === 'fake'">
                  <AlertCircle :size="16" class="text-rose-500" />
                  <span class="text-rose-600">Invalid receipt image.</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Footer Actions: Sticky sa baba -->
          <div class="border-t border-slate-100 p-5 sm:p-6 bg-white shrink-0">
            <button 
              @click="confirmGcashPayment"
              :disabled="isProcessing || receiptStatus !== 'legit' || !form.referenceNo"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 sm:py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
            >
              <span v-if="!isProcessing">Confirm Payment</span>
              <Loader2 v-else :size="20" class="animate-spin" />
            </button>
            <p class="mt-4 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              Help: <span class="font-bold text-slate-600">0912 345 6789</span>
            </p>
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
  CreditCard, 
  HandCoins, 
  Wallet, 
  Landmark, 
  Check, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck,
  QrCode,
  X,
  Info as InfoIcon,
  ArrowRight,
  Hash,
  Camera,
  Upload,
  Loader2,
  Copy
} from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated, profile } = useSession()
const cart = ref({ items: [], totalAmount: 0, totalItems: 0 })
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
  const [cartData, pSettings] = await Promise.all([
    getCart(),
    getPaymentSettings()
  ])
  cart.value = cartData
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
  if (!cart.value.items.length) {
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
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-enter-to { opacity: 1; transform: scale(1) translateY(0); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom Focus Ring for blue theme */
input:focus {
  outline: none;
}
</style>
