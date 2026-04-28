<template>
  <AppShell subtitle="One more step to place your order">
    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Checkout</p>
        <h1 class="mt-3 text-3xl font-bold text-slate-900">Shipping address</h1>
        <p class="mt-2 text-sm text-slate-500">
          Select an existing address or save a new one for this checkout.
        </p>

        <div v-if="addresses.length" class="mt-6 grid gap-3">
          <label
            v-for="address in addresses"
            :key="address.id"
            class="flex cursor-pointer gap-3 rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <input v-model="selectedAddressId" :value="address.id" type="radio" class="mt-1" />
            <div class="text-sm text-slate-600">
              <p class="font-semibold text-slate-900">{{ address.street }}</p>
              <p>{{ address.city }}, {{ address.postalCode }}</p>
              <p>{{ address.country }}</p>
            </div>
          </label>
        </div>

        <div v-else class="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
          Add your first address below to continue.
        </div>

        <div class="mt-10 rounded-3xl bg-slate-50 p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">New address</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900">Save an address</h2>

          <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="handleAddAddress">
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Street</span>
            <input v-model="form.street" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">City</span>
            <input v-model="form.city" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Postal code</span>
            <input v-model="form.postalCode" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label class="block md:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Country</span>
            <input v-model="form.country" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <button
            type="submit"
            class="md:col-span-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Save address
          </button>
          </form>
        </div>
      </div>

      <aside class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
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
import { useSession } from '../../composables/useSession'
import { getCart } from '../../services/cartService'
import { checkoutCart } from '../../services/orderService'
import { addAddress, listAddresses } from '../../services/userService'
import { formatCurrency } from '../../utils/format'

const router = useRouter()
const { authUser } = useSession()

const cart = ref({ items: [], totalAmount: 0 })
const addresses = ref([])
const selectedAddressId = ref('')
const message = ref('')

const form = reactive({
  street: '',
  city: '',
  postalCode: '',
  country: '',
})

const loadCheckout = async () => {
  if (!authUser.value) {
    return
  }

  cart.value = await getCart(authUser.value.uid)
  addresses.value = await listAddresses(authUser.value.uid)
  selectedAddressId.value = addresses.value[0]?.id || ''
}

const handleAddAddress = async () => {
  await addAddress(authUser.value.uid, form)
  form.street = ''
  form.city = ''
  form.postalCode = ''
  form.country = ''
  await loadCheckout()
}

const handleCheckout = async () => {
  try {
    const orderId = await checkoutCart({
      uid: authUser.value.uid,
      addressId: selectedAddressId.value || null,
    })

    message.value = `Order ${orderId} created successfully.`
    router.push('/account/orders')
  } catch (error) {
    message.value = error.message || 'Checkout failed.'
  }
}

onMounted(loadCheckout)
</script>
