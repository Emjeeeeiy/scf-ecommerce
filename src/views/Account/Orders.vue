<template>
  <AppShell subtitle="Order History">
    <section class="mx-auto w-full max-w-5xl px-2 sm:px-6">
      <div class="max-w-2xl pt-4 sm:pt-8">
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Your purchases</p>
        <h1 class="mt-3 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl dark:text-white">Order history</h1>
        <div class="mt-5 h-px w-12 bg-neutral-900 dark:bg-white"></div>
      </div>

      <div class="mt-10 space-y-6">
        <article
          v-for="order in orders"
          :key="order.id"
          class="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div class="flex flex-col p-5 sm:p-6">
            <div class="mb-4 flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
              <div>
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Reference ID</p>
                <h2 class="mt-1 text-sm font-medium uppercase tracking-wide text-neutral-900 dark:text-white">{{ order.id }}</h2>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  :class="[getOrderStatusClasses(order.status), {
                    'dark:text-blue-400': order.status === 'received',
                    'dark:text-amber-400': order.status === 'processing',
                    'dark:text-indigo-400': order.status === 'shipped',
                    'dark:text-emerald-400': order.status === 'completed',
                  }]"
                >
                  {{ order.status }}
                </span>
                <span class="text-xs tabular-nums text-neutral-500">{{ formatDate(order.createdAt) }}</span>
              </div>
            </div>

            <div class="divide-y divide-neutral-200 dark:divide-neutral-800">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between gap-4 py-3"
              >
                <div class="min-w-0">
                  <p class="truncate text-sm text-neutral-900 dark:text-white">{{ item.productName }}</p>
                  <p class="mt-0.5 text-xs text-neutral-500">Qty: {{ item.quantity }}</p>
                </div>
                <span class="shrink-0 text-sm tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <div>
                <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Total amount</p>
                <p class="mt-1 text-lg font-medium tabular-nums tracking-tight text-neutral-900 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
              </div>
              <router-link
                :to="`/account/orders/${order.id}`"
                class="border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
              >
                Details
              </router-link>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="border border-neutral-200 bg-white p-12 text-center sm:p-16 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 class="text-xl font-medium tracking-tight text-neutral-900 dark:text-white">No orders yet</h2>
          <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
          <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Your purchases will appear here once you've completed your first order.
          </p>
          <router-link
            to="/shop"
            class="mt-8 inline-flex items-center gap-1.5 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Go to shop
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
const { authUser } = useSession()
const { userOrders: orders, fetchUserOrders } = useOrderStore()

onMounted(() => {
  if (authUser.value) fetchUserOrders(authUser.value.uid)
})
</script>