<template>
  <AppShell subtitle="Shopping Cart">
    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
              <ShoppingCart :size="16" stroke-width="1.5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Your Selection</p>
              <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Shopping Cart</h1>
            </div>
          </div>
          <button
            v-if="cart.items.length"
            type="button"
            class="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95"
            @click="handleClearCart"
          >
            <Trash2 :size="14" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div v-if="!cart.items.length" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
            <ShoppingBag :size="24" stroke-width="1.5" />
          </div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Your cart is empty</h2>
          <p class="mt-1 max-w-xs text-xs text-slate-500 mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Let's find something beautiful for you.
          </p>
          <router-link
            to="/shop"
            class="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            <ArrowLeft :size="14" />
            <span>Continue Shopping</span>
          </router-link>
        </div>

        <div v-else class="mt-6 divide-y divide-slate-100">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="group py-6 first:pt-0 last:pb-0"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div v-else class="flex h-full items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  No Image
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div class="space-y-1">
                    <h2 class="truncate text-sm font-semibold text-slate-950 transition-colors group-hover:text-slate-700">{{ item.productName }}</h2>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                        <Palette :size="8" />
                        {{ item.color || 'Standard' }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                        <Maximize :size="8" />
                        {{ item.size || 'Free size' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-left sm:text-right">
                    <p class="text-sm font-bold text-slate-950">{{ formatCurrency(item.basePrice) }}</p>
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Each</p>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-1">
                    <button 
                      @click="updateQuantity(item, { target: { value: Math.max(1, item.quantity - 1) } })"
                      class="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-50 hover:text-slate-900 active:scale-90"
                    >
                      <Minus :size="12" />
                    </button>
                    <span class="w-4 text-center text-xs font-semibold text-slate-900">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item, { target: { value: item.quantity + 1 } })"
                      class="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-50 hover:text-slate-900 active:scale-90"
                    >
                      <Plus :size="12" />
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500 transition hover:text-rose-600 active:scale-95"
                    @click="handleRemove(item.id)"
                  >
                    <X :size="12" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
            <ReceiptText :size="14" class="text-slate-400" />
            <h2 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Summary</h2>
          </div>

          <div class="space-y-3.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-500">Subtotal</span>
              <span class="font-bold text-slate-900">{{ formatCurrency(cart.totalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-500">Total Items</span>
              <span class="font-bold text-slate-900">{{ cart.totalItems || 0 }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-500">Shipping</span>
              <span class="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-emerald-700">Calculated Next</span>
            </div>

            <div class="mt-5 border-t border-slate-100 pt-5 flex items-end justify-between">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Grand Total</p>
                <p class="text-2xl font-extrabold tracking-tight text-slate-950">
                  {{ formatCurrency(cart.totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <router-link
            to="/checkout"
            class="group mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
            :class="cart.items.length ? '' : 'pointer-events-none opacity-40'"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-0.5" />
          </router-link>
        </div>
        
        <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div class="flex items-start gap-2.5">
            <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-100">
              <Info :size="12" />
            </div>
            <p class="text-[11px] leading-relaxed text-slate-500 font-medium">
              By proceeding, you agree to our terms. <span class="text-slate-800 font-semibold">100% of proceeds</span> support SCF missions.
            </p>
          </div>
        </div>
      </aside>
    </section>
  </AppShell>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { clearCart, getCart, removeCartItem, updateCartItemQuantity } from '../../services/cartService'
import { formatCurrency } from '../../utils/format'
import { useConfirm } from '../../composables/useConfirm'
import { 
  ShoppingCart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Minus, 
  X, 
  Palette, 
  Maximize, 
  ReceiptText, 
  Info
} from 'lucide-vue-next'

const { confirm } = useConfirm()
const cart = ref({
  items: [],
  totalItems: 0,
  totalAmount: 0,
})

const loadCart = async () => {
  cart.value = await getCart()
}

const updateQuantity = async (item, event) => {
  const newQty = Number(event.target.value)
  if (newQty < 1) return
  
  await updateCartItemQuantity({
    variantId: item.id,
    quantity: newQty,
  })
  await loadCart()
}

const handleRemove = async (variantId) => {
  await removeCartItem({ variantId })
  await loadCart()
}

const handleClearCart = async () => {
  if (await confirm('Are you sure you want to clear your cart?')) {
    await clearCart()
    await loadCart()
  }
}

onMounted(loadCart)
</script>
