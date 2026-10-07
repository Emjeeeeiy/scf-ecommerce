<template>
  <AppShell subtitle="Shopping Cart">
    <section class="mx-auto grid w-full max-w-5xl gap-10 px-2 sm:px-6 lg:grid-cols-[1.3fr_0.8fr]">
      <div class="border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Your selection</p>
            <h1 class="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-white">Shopping cart</h1>
          </div>
          <button
            v-if="items.length"
            type="button"
            class="text-xs text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-900 dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-white"
            @click="handleClearCart"
          >
            Clear cart
          </button>
        </div>

        <div v-if="!items.length" class="py-16 text-center">
          <h2 class="text-xl font-medium tracking-tight text-neutral-900 dark:text-white">Your cart is empty</h2>
          <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
          <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Looks like you haven't added anything yet. Let's find something for you.
          </p>
          <router-link
            to="/shop"
            class="mt-8 inline-flex items-center gap-1.5 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <ArrowLeft :size="14" />
            <span>Continue shopping</span>
          </router-link>
        </div>

        <div v-else class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <article
            v-for="item in items"
            :key="item.cartKey || item.id"
            class="group py-6"
          >
            <div class="flex gap-4">
              <div class="h-16 w-16 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  v-if="item.base64Image"
                  :src="item.base64Image"
                  :alt="item.productName"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-[10px] uppercase tracking-wider text-neutral-400">
                  No image
                </div>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h2 class="truncate text-sm font-medium text-neutral-900 dark:text-white">{{ item.productName }}</h2>
                    <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.isStudentPrice ? 'Student' : 'Regular' }} · {{ item.color || 'Standard' }} · {{ item.size || 'Free size' }}</p>
                  </div>
                  <p class="text-sm font-medium tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(item.price) }}</p>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-3 border border-neutral-200 px-1 py-1 dark:border-neutral-700">
                    <button
                      @click="updateQuantity(item, { target: { value: Math.max(1, item.quantity - 1) } })"
                      class="flex h-6 w-6 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Minus :size="12" />
                    </button>
                    <span class="w-4 text-center text-sm tabular-nums text-neutral-900 dark:text-white">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item, { target: { value: item.quantity + 1 } })"
                      class="flex h-6 w-6 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Plus :size="12" />
                    </button>
                  </div>

                  <button
                    type="button"
                    class="text-xs text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    @click="handleRemove(item)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="h-fit space-y-6 lg:sticky lg:top-24">
        <div class="border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">Order summary</h2>

          <div class="mt-5 space-y-3 border-b border-neutral-200 pb-5 text-sm dark:border-neutral-800">
            <div class="flex items-center justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span class="tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(totalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">Total items</span>
              <span class="tabular-nums text-neutral-900 dark:text-white">{{ totalItems || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-neutral-500 dark:text-neutral-400">Shipping</span>
              <span class="text-xs text-neutral-500">Calculated next</span>
            </div>
          </div>

          <div class="flex items-end justify-between pt-5">
            <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Total</p>
            <p class="text-2xl font-medium tabular-nums tracking-tight text-neutral-900 dark:text-white">
              {{ formatCurrency(totalAmount) }}
            </p>
          </div>

          <router-link
            to="/checkout"
            class="group mt-6 flex w-full items-center justify-center gap-1.5 bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            :class="items.length ? '' : 'pointer-events-none opacity-40'"
          >
            <span>Proceed to checkout</span>
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-0.5" />
          </router-link>
        </div>

        <p class="border-t border-neutral-200 pt-5 text-xs leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          By proceeding, you agree to our terms. 100% of proceeds support SCF missions.
        </p>
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
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus
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
