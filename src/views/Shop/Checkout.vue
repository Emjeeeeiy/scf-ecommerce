<template>
  <AppShell subtitle="One more step to place your order">
    <div
      v-if="showExclusiveNotice"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Service advisory</p>
        <h2 class="mt-2 text-xl font-bold text-slate-900">Delivery area notice</h2>
        <p class="mt-3 text-sm text-slate-600">
          Orders are currently exclusive to Oriental Mindoro only.
        </p>
        <div class="mt-5 flex justify-end">
          <button
            type="button"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="dismissExclusiveNotice"
          >
            Got it
          </button>
        </div>
      </div>
    </div>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Checkout</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-900">Customer details</h1>
        <p class="mt-2 text-sm text-slate-500">
          Enter your details to place the order. We store this in Firestore under `users`.
        </p>
        <form class="mt-8 grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">First name</span>
            <input v-model="form.firstName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Last name</span>
            <input v-model="form.lastName" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input v-model="form.email" type="email" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Contact No.</span>
            <input v-model="form.contactNo" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Landmark - Address (Street/Barangay/Municipality)</span>
            <textarea
              v-model="form.addressLine"
              rows="3"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3"
              required
            ></textarea>
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Province</span>
            <input
              value="Oriental Mindoro"
              readonly
              class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
            />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Seller Contact (Optional)</span>
            <select v-model="form.sellerContact" class="w-full rounded-2xl border border-slate-200 px-4 py-3">
              <option value="">I do not know anyone</option>
              <option v-for="seller in sellerContacts" :key="seller" :value="seller">
                {{ seller }}
              </option>
            </select>
          </label>

          <fieldset class="md:col-span-2 rounded-2xl border border-slate-200 p-4">
            <legend class="px-1 text-sm font-semibold text-slate-700">Payment Method</legend>
            <p class="mb-3 text-xs text-slate-500">Please choose one payment option.</p>
            <div class="grid gap-2 sm:grid-cols-3">
              <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <input v-model="form.paymentMethod" type="radio" value="cod" />
                <span class="text-sm text-slate-700">COD</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <input v-model="form.paymentMethod" type="radio" value="gcash" />
                <span class="text-sm text-slate-700">GCash</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <input v-model="form.paymentMethod" type="radio" value="bank" />
                <span class="text-sm text-slate-700">Bank Transfer</span>
              </label>
            </div>
          </fieldset>

          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Notes (Optional)</span>
            <input v-model="form.notes" class="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
        </form>
      </div>

      <aside class="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Order summary</p>
        <h2 class="mt-3 text-2xl font-bold text-slate-900">Review</h2>

        <div class="mt-6 space-y-4 text-sm text-slate-600">
          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex items-center justify-between gap-4"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-[10px] text-slate-500">
                  No image
                </div>
              </div>
              <div class="min-w-0">
                <p class="truncate font-semibold text-slate-900">{{ item.productName }}</p>
                <p class="text-xs text-slate-500">x{{ item.quantity }}</p>
              </div>
            </div>
            <span class="font-semibold text-slate-900">{{ formatCurrency(item.basePrice * item.quantity) }}</span>
          </div>
        </div>

        <div class="mt-6 border-t border-slate-200 pt-4">
          <div class="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{{ formatCurrency(cart.totalAmount) }}</span>
          </div>
        </div>

        <p v-if="message" class="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {{ message }}
        </p>

        <button
          type="button"
          class="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          @click="handleCheckout"
        >
          Place order
        </button>
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

const router = useRouter()
const cart = ref({ items: [], totalAmount: 0, totalItems: 0 })
const message = ref('')
const showExclusiveNotice = ref(false)
const sellerContacts = ['Ana Reyes', 'Mark Dela Cruz', 'Jessa Santos', 'Paolo Ramos']
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
    message.value = 'Your cart is empty.'
    return
  }
  if (!form.paymentMethod) {
    message.value = 'Please select a payment method.'
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

    message.value = `Order ${orderId} created successfully.`
    router.push('/shop')
  } catch (error) {
    message.value = error.message || 'Checkout failed.'
  }
}

onMounted(loadCheckout)
</script>
