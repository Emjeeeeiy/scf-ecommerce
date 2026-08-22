<template>
  <AppShell subtitle="Order Details">
    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-40 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800"></div>
      <div class="h-64 w-full animate-pulse rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"></div>
    </div>

    <section v-else-if="order" class="space-y-6">
      <router-link
        to="/account/orders"
        class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <ArrowLeft :size="14" />
        <span>Back to Order History</span>
      </router-link>

      <div class="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex flex-col gap-3 border-b border-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-neutral-800">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
              <Hash :size="16" stroke-width="1.5" />
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Reference ID</p>
              <h1 class="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">{{ order.id }}</h1>
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

        <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <!-- Items -->
          <div>
            <div class="mb-4 flex items-center gap-2">
              <Package :size="14" class="text-neutral-400 dark:text-neutral-500" />
              <h2 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Items ({{ order.items?.length || 0 }})</h2>
            </div>
            <div class="space-y-2">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between gap-4 rounded-lg border border-neutral-100 bg-neutral-50/30 p-3 dark:border-neutral-800 dark:bg-neutral-800/30"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white text-neutral-400 border border-neutral-100 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-700">
                    <ShoppingBag :size="14" stroke-width="1.5" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-xs font-medium text-neutral-900 dark:text-white">{{ item.productName }}</p>
                    <p class="text-[9px] font-medium text-neutral-400 uppercase tracking-wide dark:text-neutral-500">
                      {{ [item.color, item.size].filter(Boolean).join(' • ') }}<span v-if="item.color || item.size"> • </span>Qty: {{ item.quantity }}
                    </p>
                  </div>
                </div>
                <span class="shrink-0 text-xs font-semibold text-neutral-900 dark:text-white">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Total Amount</p>
              <p class="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Shipping & Payment -->
          <div class="space-y-6">
            <div>
              <div class="mb-3 flex items-center gap-2">
                <MapPin :size="14" class="text-neutral-400 dark:text-neutral-500" />
                <h2 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Delivery Details</h2>
              </div>
              <div class="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50/30 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                <p class="text-xs font-semibold text-neutral-900 dark:text-white">
                  {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                </p>
                <div class="flex items-center gap-2">
                  <Phone :size="12" class="shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span class="text-xs text-neutral-600 dark:text-neutral-400">{{ order.customerDetails?.contactNo || order.customerDetails?.contact }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <Home :size="12" class="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{{ order.customerDetails?.completeAddress }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="mb-3 flex items-center gap-2">
                <CreditCard :size="14" class="text-neutral-400 dark:text-neutral-500" />
                <h2 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Payment</h2>
              </div>
              <div class="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50/30 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Method</span>
                  <span class="rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {{ order.paymentMethod }}
                  </span>
                </div>
                <div v-if="order.paymentMethod === 'gcash'" class="space-y-3 border-t border-neutral-200/60 pt-3 dark:border-neutral-700">
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">Reference Number</p>
                    <p class="text-xs font-semibold text-neutral-900 dark:text-white">{{ order.referenceNo || 'N/A' }}</p>
                  </div>
                  <div v-if="order.receiptUrl" class="space-y-1.5">
                    <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Receipt</p>
                    <img :src="order.receiptUrl" class="aspect-video w-full rounded-lg border border-neutral-100 object-cover dark:border-neutral-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm sm:p-16 dark:border-neutral-800 dark:bg-neutral-900">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <PackageX :size="24" stroke-width="1.5" />
      </div>
      <h2 class="text-lg font-bold text-neutral-900 tracking-tight dark:text-white">Order Not Found</h2>
      <p class="mt-1 text-xs text-neutral-500 max-w-xs mx-auto dark:text-neutral-400">This order doesn't exist or isn't associated with your account.</p>

      <router-link
        to="/account/orders"
        class="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <ArrowLeft :size="14" />
        Back to Order History
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
  ArrowLeft,
  Hash,
  Calendar,
  Package,
  ShoppingBag,
  MapPin,
  Phone,
  Home,
  CreditCard,
  PackageX
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
