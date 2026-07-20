<template>
  <AppShell subtitle="Order History">
    <section class="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div class="flex items-center gap-3 border-b border-neutral-100 p-6 sm:px-8 dark:border-neutral-800">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
          <Package :size="16" stroke-width="1.5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Your Purchases</p>
          <h1 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Order History</h1>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-4">
        <article
          v-for="order in orders"
          :key="order.id"
          class="group overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50/30 transition-all duration-200 hover:border-neutral-200 hover:bg-white hover:shadow-md hover:shadow-neutral-200/20 dark:border-neutral-800 dark:bg-neutral-800/30 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:shadow-none"
        >
          <div class="flex flex-col p-5 sm:p-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4 mb-4 dark:border-neutral-800">
              <div class="flex items-center gap-2.5">
                <div class="flex h-7 w-7 items-center justify-center rounded-md bg-white text-neutral-400 border border-neutral-100 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-700">
                  <Hash :size="12" stroke-width="1.5" />
                </div>
                <div>
                  <p class="text-[8px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Reference ID</p>
                  <h2 class="text-xs font-bold text-neutral-900 tracking-wide uppercase dark:text-white">{{ order.id }}</h2>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  :class="[getOrderStatusClasses(order.status), {
                    'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20': order.status === 'received',
                    'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20': order.status === 'processing',
                    'dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20': order.status === 'shipped',
                    'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20': order.status === 'completed',
                  }]"
                >
                  {{ order.status }}
                </span>
                <div class="flex items-center gap-1 rounded bg-neutral-50 border border-neutral-100 px-2.5 py-0.5 text-[9px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300">
                  <Calendar :size="10" stroke-width="1.5" class="text-neutral-400 dark:text-neutral-500" />
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between gap-4 rounded-lg border border-neutral-100/80 bg-white p-3 dark:border-neutral-800/80 dark:bg-neutral-900"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-neutral-50 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                    <ShoppingBag :size="14" stroke-width="1.5" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-xs font-medium text-neutral-900 dark:text-white">{{ item.productName }}</p>
                    <p class="text-[9px] font-medium text-neutral-400 uppercase tracking-wide dark:text-neutral-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-neutral-900 dark:text-white">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-neutral-100 mt-4 pt-4 dark:border-neutral-800">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total Amount</p>
                <p class="text-base font-extrabold tracking-tight text-neutral-950 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
              </div>
              <router-link
                :to="`/account/orders/${order.id}`"
                class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <FileText :size="12" />
                <span>Details</span>
              </router-link>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-50 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-600">
            <Inbox :size="28" stroke-width="1.5" />
          </div>
          <h2 class="text-lg font-bold text-neutral-900 tracking-tight dark:text-white">No orders yet</h2>
          <p class="mt-1 text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed dark:text-neutral-400">
            Your purchases will appear here once you've completed your first order.
          </p>
          <router-link
            to="/shop"
            class="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
          >
            <Store :size="14" />
            <span>Go to Shop</span>
          </router-link>
        </div>
      </div>
    </section>
  </AppShell>
</template>

<script setup>
import { onMounted } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { useSession } from '../../composables/useSession'
import { useOrderStore } from '../../stores/orderStore'
import { formatCurrency, formatDate, getOrderStatusClasses } from '../../utils/format'
import {
  Package,
  Hash,
  Calendar,
  ShoppingBag,
  FileText,
  Inbox,
  Store
} from 'lucide-vue-next'

const { authUser } = useSession()
const { userOrders: orders, fetchUserOrders } = useOrderStore()

onMounted(() => {
  if (authUser.value) fetchUserOrders(authUser.value.uid)
})
</script>