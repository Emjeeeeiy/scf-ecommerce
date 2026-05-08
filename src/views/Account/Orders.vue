<template>
  <AppShell subtitle="Order History">
    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center gap-3 border-b border-slate-100 p-6 sm:px-8">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
          <Package :size="16" stroke-width="1.5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Your Purchases</p>
          <h1 class="text-xl font-bold tracking-tight text-slate-900">Order History</h1>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-4">
        <article
          v-for="order in orders"
          :key="order.id"
          class="group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/30 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-md hover:shadow-slate-200/20"
        >
          <div class="flex flex-col p-5 sm:p-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
              <div class="flex items-center gap-2.5">
                <div class="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-400 border border-slate-100">
                  <Hash :size="12" stroke-width="1.5" />
                </div>
                <div>
                  <p class="text-[8px] font-bold uppercase tracking-wider text-slate-400">Reference ID</p>
                  <h2 class="text-xs font-bold text-slate-900 tracking-wide uppercase">{{ order.id }}</h2>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-2">
                <span 
                  class="rounded px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  :class="statusClasses(order.status)"
                >
                  {{ order.status }}
                </span>
                <div class="flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[9px] font-semibold text-slate-600">
                  <Calendar :size="10" stroke-width="1.5" class="text-slate-400" />
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div 
                v-for="item in order.items" 
                :key="item.id" 
                class="flex items-center justify-between gap-4 rounded-lg border border-slate-100/80 bg-white p-3"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-50 text-slate-400">
                    <ShoppingBag :size="14" stroke-width="1.5" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-xs font-medium text-slate-900">{{ item.productName }}</p>
                    <p class="text-[9px] font-medium text-slate-400 uppercase tracking-wide">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-slate-900">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 mt-4 pt-4">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                <p class="text-base font-extrabold tracking-tight text-slate-950">{{ formatCurrency(order.totalAmount) }}</p>
              </div>
              <router-link 
                :to="`/account/orders/${order.id}`"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 hover:text-slate-905"
              >
                <FileText :size="12" />
                <span>Details</span>
              </router-link>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
            <Inbox :size="28" stroke-width="1.5" />
          </div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">No orders yet</h2>
          <p class="mt-1 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your purchases will appear here once you've completed your first order.
          </p>
          <router-link
            to="/shop"
            class="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
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
import { onMounted, ref } from 'vue'
import AppShell from '../../components/AppShell.vue'
import { useSession } from '../../composables/useSession'
import { listUserOrders } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'
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
const orders = ref([])

const loadOrders = async () => {
  if (!authUser.value) {
    return
  }

  orders.value = await listUserOrders(authUser.value.uid)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusClasses = (status) => {
  const s = status?.toLowerCase()
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
  if (s === 'completed' || s === 'delivered') return 'bg-green-100 text-green-700 ring-1 ring-green-200'
  if (s === 'cancelled') return 'bg-red-100 text-red-700 ring-1 ring-red-200'
  return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
}

onMounted(loadOrders)
</script>