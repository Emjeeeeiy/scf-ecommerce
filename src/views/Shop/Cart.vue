<template>
  <AppShell subtitle="Shopping Cart">
    <section class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <!-- Cart Items Section -->
      <div class="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-6 border-b border-slate-50 pb-8">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
              <ShoppingCart :size="20" />
            </div>
            <div>
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Your Selection</p>
              <h1 class="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Shopping Cart</h1>
            </div>
          </div>
          <button
            v-if="cart.items.length"
            type="button"
            class="flex items-center gap-2.5 rounded-xl bg-rose-50 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-500 hover:text-white active:scale-95 shadow-sm"
            @click="handleClearCart"
          >
            <Trash2 :size="16" />
            Clear
          </button>
        </div>

        <div v-if="!cart.items.length" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-200 shadow-inner">
            <ShoppingBag :size="32" />
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
          <p class="mt-2 max-w-xs text-xs font-medium text-slate-400 mx-auto">
            Looks like you haven't added anything to your cart yet. Let's find something for you!
          </p>
          <router-link
            to="/shop"
            class="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <ArrowLeft :size="16" />
            Continue Shopping
          </router-link>
        </div>

        <div v-else class="mt-8 space-y-4">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="group relative overflow-hidden rounded-2xl border border-slate-50 bg-slate-50/30 p-4 transition-all duration-500 hover:border-slate-200 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50"
          >
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
              <!-- Item Image -->
              <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-inner">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div v-else class="flex h-full items-center justify-center text-[8px] text-slate-400 font-black uppercase tracking-widest">
                  NA
                </div>
              </div>

              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div class="space-y-1">
                    <h2 class="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg">{{ item.productName }}</h2>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-100 shadow-sm">
                        <Palette :size="8" />
                        {{ item.color || 'Standard' }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-100 shadow-sm">
                        <Maximize :size="8" />
                        {{ item.size || 'Free size' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-black text-slate-900 tracking-tighter">{{ formatCurrency(item.basePrice) }}</p>
                    <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Per Item</p>
                  </div>
                </div>

                <!-- Item Actions -->
                <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:mt-4 sm:border-0 sm:pt-0">
                  <div class="flex items-center gap-3 rounded-lg bg-white p-1 ring-1 ring-slate-100 shadow-sm">
                    <button 
                      @click="updateQuantity(item, { target: { value: Math.max(1, item.quantity - 1) } })"
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-900 active:scale-90"
                    >
                      <Minus :size="14" />
                    </button>
                    <span class="w-6 text-center text-xs font-black text-slate-900">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item, { target: { value: item.quantity + 1 } })"
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-900 active:scale-90"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 transition-all hover:bg-rose-50 active:scale-95"
                    @click="handleRemove(item.id)"
                  >
                    <X :size="14" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <aside class="lg:sticky lg:top-24 h-fit">
        <div class="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
          <div class="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400 shadow-inner">
              <ReceiptText :size="20" />
            </div>
            <h2 class="text-[9px] font-black uppercase tracking-[0.2em] text-white">Order Summary</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
              <span class="font-black text-base tracking-tighter">{{ formatCurrency(cart.totalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-bold text-slate-500 uppercase tracking-widest">Total Items</span>
              <span class="font-black text-base tracking-tighter">{{ cart.totalItems || 0 }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] pt-1">
              <span class="font-bold text-slate-500 uppercase tracking-widest">Shipping</span>
              <span class="font-black text-[8px] text-emerald-400 uppercase tracking-[0.2em] bg-emerald-400/10 px-2.5 py-1 rounded-full ring-1 ring-emerald-400/20">Calculated Next</span>
            </div>

            <div class="mt-6 border-t border-white/10 pt-6">
              <div class="flex items-end justify-between">
                <div>
                  <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1.5">Grand Total</p>
                  <p class="text-3xl font-black text-amber-400 leading-none tracking-tighter">
                    {{ formatCurrency(cart.totalAmount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <router-link
            to="/checkout"
            class="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            :class="cart.items.length ? '' : 'pointer-events-none opacity-60'"
          >
            <span>Checkout</span>
            <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1.5" />
          </router-link>
        </div>
        
        <div class="mt-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
           <div class="flex items-start gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500 shadow-inner">
                <Info :size="14" />
              </div>
              <p class="text-[10px] font-bold leading-relaxed text-slate-500">
                By proceeding, you agree to our terms. <span class="text-slate-900">100% of proceeds</span> support SCF missions.
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
