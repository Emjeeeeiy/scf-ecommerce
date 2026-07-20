<template>
  <AppShell subtitle="Shopping Cart">
    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
      <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
              <ShoppingCart :size="16" stroke-width="1.5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Your Selection</p>
              <h1 class="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">Shopping Cart</h1>
            </div>
          </div>
          <button
            v-if="items.length"
            type="button"
            class="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            @click="handleClearCart"
          >
            <Trash2 :size="14" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div v-if="!items.length" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-600">
            <ShoppingBag :size="24" stroke-width="1.5" />
          </div>
          <h2 class="text-lg font-bold text-neutral-900 tracking-tight dark:text-white">Your cart is empty</h2>
          <p class="mt-1 max-w-xs text-xs text-neutral-500 mx-auto leading-relaxed dark:text-neutral-400">
            Looks like you haven't added anything to your cart yet. Let's find something beautiful for you.
          </p>
          <router-link
            to="/shop"
            class="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
          >
            <ArrowLeft :size="14" />
            <span>Continue Shopping</span>
          </router-link>
        </div>

        <div v-else class="mt-6 divide-y divide-neutral-100 dark:divide-neutral-800">
          <article
            v-for="item in items"
            :key="item.cartKey || item.id"
            class="group py-6 first:pt-0 last:pb-0"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div v-else class="flex h-full items-center justify-center text-[9px] text-neutral-400 font-bold uppercase tracking-wider dark:text-neutral-500">
                  No Image
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div class="space-y-1">
                    <h2 class="truncate text-sm font-semibold text-neutral-950 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-300">{{ item.productName }}</h2>
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span v-if="item.isStudentPrice" class="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-100 px-1.5 py-0.5 text-[8px] font-black uppercase text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                        Student Price
                      </span>
                      <span v-else class="inline-flex items-center gap-1 rounded bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 text-[8px] font-black uppercase text-neutral-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                        Regular Price
                      </span>
                      <span class="inline-flex items-center gap-1 rounded bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                        <Palette :size="8" />
                        {{ item.color || 'Standard' }}
                      </span>
                      <span class="inline-flex items-center gap-1 rounded bg-neutral-50 border border-neutral-100 px-1.5 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                        <Maximize :size="8" />
                        {{ item.size || 'Free size' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-left sm:text-right">
                    <p class="text-sm font-bold text-neutral-950 dark:text-white">{{ formatCurrency(item.price) }}</p>
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Each</p>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
                    <button
                      @click="updateQuantity(item, { target: { value: Math.max(1, item.quantity - 1) } })"
                      class="flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition hover:bg-neutral-50 hover:text-neutral-900 active:scale-90 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <Minus :size="12" />
                    </button>
                    <span class="w-4 text-center text-xs font-semibold text-neutral-900 dark:text-white">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item, { target: { value: item.quantity + 1 } })"
                      class="flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition hover:bg-neutral-50 hover:text-neutral-900 active:scale-90 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <Plus :size="12" />
                    </button>
                  </div>

                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500 transition hover:text-rose-600 active:scale-95 dark:text-rose-400 dark:hover:text-rose-300"
                    @click="handleRemove(item)"
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
        <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-center gap-2.5 mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <ReceiptText :size="14" class="text-neutral-400 dark:text-neutral-500" />
            <h2 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Order Summary</h2>
          </div>

          <div class="space-y-3.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span class="font-bold text-neutral-900 dark:text-white">{{ formatCurrency(totalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-neutral-500 dark:text-neutral-400">Total Items</span>
              <span class="font-bold text-neutral-900 dark:text-white">{{ totalItems || 0 }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-neutral-500 dark:text-neutral-400">Shipping</span>
              <span class="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">Calculated Next</span>
            </div>

            <div class="mt-5 border-t border-neutral-100 pt-5 flex items-end justify-between dark:border-neutral-800">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Grand Total</p>
                <p class="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {{ formatCurrency(totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <router-link
            to="/checkout"
            class="group mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-6 py-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99] dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
            :class="items.length ? '' : 'pointer-events-none opacity-40'"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-0.5" />
          </router-link>
        </div>

        <div class="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div class="flex items-start gap-2.5">
            <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              <Info :size="12" />
            </div>
            <p class="text-[11px] leading-relaxed text-neutral-500 font-medium dark:text-neutral-400">
              By proceeding, you agree to our terms. <span class="text-neutral-800 font-semibold dark:text-neutral-200">100% of proceeds</span> support SCF missions.
            </p>
          </div>
        </div>
      </aside>
    </section>
  </AppShell>
</template>
<script setup>
import { onMounted } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { useCartStore } from '../../stores/cartStore'
import { formatCurrency } from '../../utils/format'
import { useConfirmAction } from '../../composables/useConfirmAction'
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

const { confirmAndRun } = useConfirmAction()
const { items, totalItems, totalAmount, refresh, updateItemQuantity, removeItem, clear } = useCartStore()

const updateQuantity = (item, event) => {
  const newQty = Number(event.target.value)
  if (newQty < 1) return

  updateItemQuantity({
    variantId: item.id,
    cartKey: item.cartKey,
    quantity: newQty,
  })
}

const handleRemove = (item) => {
  removeItem({
    variantId: item.id,
    cartKey: item.cartKey,
  })
}

const handleClearCart = () =>
  confirmAndRun('Are you sure you want to clear your cart?', clear)

onMounted(refresh)
</script>
