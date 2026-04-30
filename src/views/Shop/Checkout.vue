<template>
  <AppShell subtitle="Checkout">
    <div
      v-if="showExclusiveNotice"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div class="bg-amber-400 p-6 text-slate-900">
           <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-4">
             <MapPin :size="20" />
           </div>
           <h2 class="text-xl font-black tracking-tight">Delivery Area Notice</h2>
           <p class="mt-1 text-[10px] font-bold opacity-80 uppercase tracking-widest">Service Advisory</p>
        </div>
        <div class="p-6">
          <p class="text-sm leading-relaxed text-slate-600">
            We currently only support orders within <span class="font-bold text-slate-900">Oriental Mindoro</span>. Please ensure your delivery address is within this region.
          </p>
          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-xs font-black text-white transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/20"
            @click="dismissExclusiveNotice"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <section class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <!-- Customer Details Form -->
      <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div class="flex items-center gap-4 border-b border-slate-50 pb-6 mb-6">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User :size="20" />
          </div>
          <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Step 1 of 2</p>
            <h1 class="text-2xl font-black tracking-tighter text-slate-900 sm:text-3xl">Customer Details</h1>
          </div>
        </div>

        <form class="grid gap-5 md:grid-cols-2">
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <User :size="12" />
              First Name
            </label>
            <input 
              v-model="form.firstName" 
              placeholder="John"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <User :size="12" />
              Last Name
            </label>
            <input 
              v-model="form.lastName" 
              placeholder="Doe"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Mail :size="12" />
              Email Address
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="john@example.com"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Phone :size="12" />
              Contact Number
            </label>
            <input 
              v-model="form.contactNo" 
              placeholder="0912 345 6789"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900" 
              required 
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <MapPin :size="12" />
              Address
            </label>
            <textarea
              v-model="form.addressLine"
              rows="2"
              placeholder="Street, Barangay, Municipality"
              class="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-slate-900"
              required
            ></textarea>
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Globe :size="12" />
              Province
            </label>
            <div class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-100 px-4 py-3">
              <span class="text-sm font-bold text-slate-600">Oriental Mindoro</span>
              <Lock :size="12" class="text-slate-400" />
            </div>
          </div>

          <!-- Payment Method -->
          <div class="md:col-span-2 mt-4 space-y-3">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <CreditCard :size="12" />
              Payment
            </label>
            <div class="grid gap-3 sm:grid-cols-3">
              <label 
                v-for="method in ['cod', 'gcash', 'bank']" 
                :key="method"
                class="relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-3 transition-all"
                :class="form.paymentMethod === method ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-500'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <div class="flex items-center justify-between">
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10" v-if="method === 'cod'"><HandCoins :size="14" /></div>
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10" v-if="method === 'gcash'"><Wallet :size="14" /></div>
                  <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10" v-if="method === 'bank'"><Landmark :size="14" /></div>
                  <div v-if="form.paymentMethod === method" class="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-900">
                    <Check :size="10" />
                  </div>
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest">{{ method === 'cod' ? 'COD' : method.toUpperCase() }}</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Order Review Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-2xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400">
              <Eye :size="20" />
            </div>
            <h2 class="text-xs font-black uppercase tracking-widest text-white">Review</h2>
          </div>

          <div class="max-h-[30vh] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="flex items-center justify-between gap-4 rounded-xl bg-white/5 p-3"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800 shadow-inner">
                  <img
                    v-if="item.base64Image"
                    :src="item.base64Image"
                    :alt="item.productName"
                    class="h-full w-full object-cover opacity-80"
                  />
                  <div v-else class="flex h-full items-center justify-center text-[8px] text-slate-600 font-black uppercase">
                    NA
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-xs font-black text-white">{{ item.productName }}</p>
                  <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {{ item.color }} · x{{ item.quantity }}
                  </p>
                </div>
              </div>
              <span class="text-xs font-black text-amber-400">{{ formatCurrency(item.basePrice * item.quantity) }}</span>
            </div>
          </div>

          <div class="mt-6 space-y-3 border-t border-white/10 pt-6">
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>{{ formatCurrency(cart.totalAmount) }}</span>
            </div>
            <div class="flex items-end justify-between pt-2">
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total</p>
                <p class="text-3xl font-black text-amber-400 leading-none">
                  {{ formatCurrency(cart.totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-xs font-black text-slate-900 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-700"
            @click="handleCheckout"
          >
            <span>Place Order</span>
            <CheckCircle :size="18" />
          </button>
        </div>

        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
           <p class="text-[10px] font-medium leading-relaxed text-slate-500">
             Your order will be verified manually. 100% of proceeds go to our ministry fund.
           </p>
        </div>
      </aside>
    </section>
  </AppShell>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { getCart } from '../../services/cartService'
import { checkoutCart } from '../../services/orderService'
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
  Package
} from 'lucide-vue-next'

const router = useRouter()
const cart = ref({ items: [], totalAmount: 0, totalItems: 0 })
const message = ref('')
const showExclusiveNotice = ref(false)
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

const loadCheckout = async () => {
  cart.value = await getCart()

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
  if (!form.firstName || !form.lastName || !form.contactNo || !form.addressLine) {
    message.value = 'Please fill in all required delivery details.'
    return
  }

  try {
    const customerDetails = {
      ...form,
      completeAddress: `${form.addressLine.trim()}, Oriental Mindoro`,
    }

    const orderId = await checkoutCart({
      customerDetails,
    })

    message.value = `Order ${orderId} created successfully!`
    
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
