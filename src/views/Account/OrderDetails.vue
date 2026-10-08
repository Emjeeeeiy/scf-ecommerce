<template>
  <AppShell subtitle="Order Details">
    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-40 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800"></div>
      <div class="h-64 w-full animate-pulse rounded-2xl border border-neutral-100 bg-white  dark:border-neutral-800 dark:bg-neutral-900"></div>
    </div>

    <section v-else-if="order" class="mx-auto w-full max-w-5xl space-y-6 px-2 sm:px-6">
      <router-link
        to="/account/orders"
        class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <ArrowLeft :size="14" />
        <span>Back to order history</span>
      </router-link>

      <div class="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-neutral-800">
          <div>
            <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Reference ID</p>
            <h1 class="mt-1 text-lg font-medium tracking-tight text-neutral-900 dark:text-white">{{ order.id }}</h1>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <span
              class="text-[11px] font-semibold uppercase tracking-[0.18em]"
              :class="[getOrderStatusClasses(order.status), {
                'dark:text-blue-400': order.status === 'received',
                'dark:text-blue-400': order.status === 'processing',
                'dark:text-indigo-400': order.status === 'shipped',
                'dark:text-emerald-400': order.status === 'completed',
              }]"
            >
              {{ order.status }}
            </span>
            <span class="text-xs tabular-nums text-neutral-500">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>

        <div class="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <!-- Items -->
          <div>
            <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Items ({{ order.items?.length || 0 }})</h2>
            <div class="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between gap-4 py-3"
              >
                <div class="min-w-0">
                  <p class="truncate text-sm text-neutral-900 dark:text-white">{{ item.productName }}</p>
                  <p class="mt-0.5 text-xs text-neutral-500">
                    {{ [item.color, item.size].filter(Boolean).join(' · ') }}<span v-if="item.color || item.size"> · </span>Qty: {{ item.quantity }}
                  </p>
                </div>
                <span class="shrink-0 text-sm tabular-nums text-neutral-900 dark:text-white">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Total amount</p>
              <p class="text-lg font-medium tabular-nums tracking-tight text-neutral-900 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Shipping & Payment -->
          <div class="space-y-8">
            <div>
              <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Delivery details</h2>
              <div class="mt-3 space-y-2 border border-neutral-200 p-4 text-sm dark:border-neutral-800">
                <p class="text-neutral-900 dark:text-white">
                  {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                </p>
                <p class="text-neutral-600 dark:text-neutral-400">{{ order.customerDetails?.contactNo || order.customerDetails?.contact }}</p>
                <p class="leading-relaxed text-neutral-600 dark:text-neutral-400">{{ order.customerDetails?.completeAddress }}</p>
              </div>
            </div>

            <div>
              <h2 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Payment</h2>
              <div class="mt-3 space-y-3 border border-neutral-200 p-4 dark:border-neutral-800">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Method</span>
                  <span class="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
                    {{ order.paymentMethod }}
                  </span>
                </div>
                <div v-if="order.paymentMethod === 'gcash'" class="space-y-3 border-t border-neutral-200 pt-3 dark:border-neutral-700">
                  <div>
                    <p class="mb-1 text-[11px] uppercase tracking-[0.18em] text-neutral-400">Reference number</p>
                    <p class="text-sm tabular-nums text-neutral-900 dark:text-white">{{ order.referenceNo || 'N/A' }}</p>
                  </div>
                  <div v-if="order.receiptUrl" class="space-y-1.5">
                    <p class="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Receipt</p>
                    <img :src="order.receiptUrl" class="aspect-video w-full border border-neutral-200 object-cover dark:border-neutral-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="mx-auto w-full max-w-3xl border border-neutral-200 bg-white p-12 text-center sm:p-16 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 class="text-xl font-medium tracking-tight text-neutral-900 dark:text-white">Order not found</h2>
      <div class="mx-auto mt-5 h-px w-12 bg-neutral-300 dark:bg-neutral-700"></div>
      <p class="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">This order doesn't exist or isn't associated with your account.</p>

      <router-link
        to="/account/orders"
        class="mt-8 inline-flex items-center gap-1.5 border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-colors hover:border-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300"
      >
        <ArrowLeft :size="14" />
        Back to order history
      </router-link>
    </div>
  </AppShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { useSession } from '../../composables/useSession'
import { useOrderStore } from '../../stores/orderStore'
import { formatCurrency, formatDate, getOrderStatusClasses } from '../../utils/format'
import {
  ArrowLeft
} from 'lucide-vue-next'

const route = useRoute()
const { authUser } = useSession()
const { fetchOrder, fetchOrderItems } = useOrderStore()

const loading = ref(true)
const order = ref(null)

const loadOrder = async () => {
  loading.value = true
  try {
    const found = await fetchOrder(route.params.id)

    // Only the order's owner may view it; treat a mismatch the same as "not found"
    // rather than leaking that the order exists under a different account.
    if (!found || found.userId !== authUser.value?.uid) {
      order.value = null
      return
    }

    const items = await fetchOrderItems(found.id)
    order.value = { ...found, items }
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
</script>
