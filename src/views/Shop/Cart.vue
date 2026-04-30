<template>
  <AppShell subtitle="Shopping Cart">
    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
      <!-- Cart Items Section -->
      <div class="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-6 border-b border-slate-50 pb-8">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShoppingCart :size="24" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Your Selection</p>
              <h1 class="text-2xl font-black tracking-tighter text-slate-900 sm:text-3xl">Shopping Cart</h1>
            </div>
          </div>
          <button
            v-if="cart.items.length"
            type="button"
            class="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-600 transition-all hover:bg-rose-100 active:scale-95"
            @click="handleClearCart"
          >
            <Trash2 :size="16" />
            Clear
          </button>
        </div>

        <div v-if="!cart.items.length" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-200">
            <ShoppingBag :size="40" />
          </div>
          <h2 class="text-xl font-black text-slate-900">Your cart is empty</h2>
          <p class="mt-2 max-w-xs text-sm font-medium text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <router-link
            to="/shop"
            class="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <ArrowLeft :size="16" />
            Continue Shopping
          </router-link>
        </div>

        <div v-else class="mt-8 space-y-4">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-xl"
          >
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
              <!-- Item Image -->
              <div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-inner">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div v-else class="flex h-full items-center justify-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  No Image
                </div>
              </div>

              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 class="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg">{{ item.productName }}</h2>
                    <div class="mt-1 flex items-center gap-2">
                      <span class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400 ring-1 ring-slate-100">
                        <Palette :size="10" />
                        {{ item.color || 'Standard' }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400 ring-1 ring-slate-100">
                        <Maximize :size="10" />
                        {{ item.size || 'Free size' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-base font-black text-slate-900">{{ formatCurrency(item.basePrice) }}</p>
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Unit Price</p>
                  </div>
                </div>

                <!-- Item Actions -->
                <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:mt-4 sm:border-0 sm:pt-0">
                  <div class="flex items-center gap-3 rounded-lg bg-white p-1 ring-1 ring-slate-100">
                    <button 
                      @click="updateQuantity(item, { target: { value: Math.max(1, item.quantity - 1) } })"
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Minus :size="12" />
                    </button>
                    <span class="w-6 text-center text-xs font-black text-slate-900">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item, { target: { value: item.quantity + 1 } })"
                      class="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Plus :size="12" />
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    class="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black text-rose-500 transition-all hover:bg-rose-50 active:scale-95"
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
        <div class="overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-2xl">
          <div class="flex items-center gap-3 mb-8">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400">
              <ReceiptText :size="20" />
            </div>
            <h2 class="text-xs font-black uppercase tracking-widest text-white">Summary</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-400">Subtotal</span>
              <span class="font-black">{{ formatCurrency(cart.totalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-400">Items</span>
              <span class="font-black">{{ cart.totalItems || 0 }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-400">Shipping</span>
              <span class="font-black text-emerald-400 uppercase tracking-widest text-[9px]">Calculated Next</span>
            </div>

            <div class="mt-6 border-t border-white/10 pt-6">
              <div class="flex items-end justify-between">
                <div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total</p>
                  <p class="text-3xl font-black text-amber-400 leading-none">
                    {{ formatCurrency(cart.totalAmount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <router-link
            to="/checkout"
            class="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-4 text-xs font-black text-slate-900 shadow-lg transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            :class="cart.items.length ? '' : 'pointer-events-none opacity-60'"
          >
            <span>Checkout</span>
            <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>
        
        <div class="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
           <p class="flex items-start gap-3 text-[11px] font-medium leading-relaxed text-slate-500">
             <Info :size="14" class="shrink-0 text-amber-500" />
             By proceeding, you agree to our terms. 100% of proceeds support SCF missions.
           </p>
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
  ShieldCheck, 
  Truck, 
  Info,
  ChevronRight
} from 'lucide-vue-next'

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
  if (confirm('Are you sure you want to clear your cart?')) {
    await clearCart()
    await loadCart()
  }
}

onMounted(loadCart)
</script>
