<template>
  <AppShell subtitle="A clean cart, ready for checkout">
    <section class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <div class="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Your cart</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">Shopping cart</h1>
          </div>
          <button
            v-if="cart.items.length"
            type="button"
            class="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
            @click="handleClearCart"
          >
            Clear cart
          </button>
        </div>

        <div v-if="!cart.items.length" class="mt-8 rounded-3xl bg-slate-50 p-8 text-center text-slate-600">
          <p class="text-lg font-semibold text-slate-900">Your cart is empty</p>
          <p class="mt-2 text-sm text-slate-500">Browse the catalog and add your first product.</p>
          <router-link
            to="/shop"
            class="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </router-link>
        </div>

        <div v-else class="mt-8 space-y-4">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="flex min-w-0 items-center gap-4">
                <div class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
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
                  <h2 class="truncate text-lg font-semibold text-slate-900">{{ item.productName }}</h2>
                  <p class="text-sm text-slate-500">
                    {{ item.color || 'Standard' }} / {{ item.size || 'Free size' }}
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ formatCurrency(item.basePrice) }} each
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <input
                  :value="item.quantity"
                  type="number"
                  min="1"
                  class="w-20 rounded-xl border border-slate-200 px-3 py-2"
                  @change="updateQuantity(item, $event)"
                />
                <button
                  type="button"
                  class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  @click="handleRemove(item.id)"
                >
                  Remove
                </button>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-slate-500">Line total</span>
              <span class="font-semibold text-slate-900">
                {{ formatCurrency(item.basePrice * item.quantity) }}
              </span>
            </div>
          </article>
        </div>
      </div>

      <aside class="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Summary</p>
        <div class="mt-6 space-y-3 text-sm text-slate-600">
          <div class="flex items-center justify-between">
            <span>Total items</span>
            <span>{{ cart.totalItems || 0 }}</span>
          </div>
          <div class="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total amount</span>
            <span>{{ formatCurrency(cart.totalAmount) }}</span>
          </div>
        </div>

        <router-link
          to="/checkout"
          class="mt-6 inline-flex w-full justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :class="cart.items.length ? '' : 'pointer-events-none opacity-60'"
        >
          Proceed to checkout
        </router-link>
      </aside>
    </section>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { clearCart, getCart, removeCartItem, updateCartItemQuantity } from '../../services/cartService'
import { formatCurrency } from '../../utils/format'

const cart = ref({
  items: [],
  totalItems: 0,
  totalAmount: 0,
})

const loadCart = async () => {
  cart.value = await getCart()
}

const updateQuantity = async (item, event) => {
  await updateCartItemQuantity({
    variantId: item.id,
    quantity: Number(event.target.value),
  })
  await loadCart()
}

const handleRemove = async (variantId) => {
  await removeCartItem({ variantId })
  await loadCart()
}

const handleClearCart = async () => {
  await clearCart()
  await loadCart()
}

onMounted(loadCart)
</script>
