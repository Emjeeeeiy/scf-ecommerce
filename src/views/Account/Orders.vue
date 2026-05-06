<template>
  <AppShell subtitle="Order History">
    <section class="rounded-3xl bg-white border border-slate-300 ring-1 ring-slate-100">
      <div class="flex items-center gap-4 border-b border-slate-100 p-6 sm:px-8">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
          <Package :size="20" />
        </div>
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Your Purchases</p>
          <h1 class="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Order History</h1>
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-5">
        <article
          v-for="order in orders"
          :key="order.id"
          class="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40"
        >
          <div class="flex flex-col p-5 sm:p-6">
            <!-- Order Header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5 mb-5">
              <div class="flex items-center gap-3">
                 <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-100">
                    <Hash :size="14" />
                 </div>
                 <div>
                    <p class="text-[7px] font-black uppercase tracking-widest text-slate-400">Reference ID</p>
                    <h2 class="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{{ order.id }}</h2>
                 </div>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  class="rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest"
                  :class="statusClasses(order.status)"
                >
                  {{ order.status }}
                </span>
                <div class="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[8px] font-black text-white">
                   <Calendar :size="10" class="text-amber-400" />
                   {{ formatDate(order.createdAt) }}
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-2">
              <div 
                v-for="item in order.items" 
                :key="item.id" 
                class="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 ring-1 ring-slate-50"
              >
                <div class="flex items-center gap-3 min-w-0">
                   <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <ShoppingBag :size="16" />
                   </div>
                   <div class="min-w-0">
                      <p class="truncate text-xs font-black text-slate-900">{{ item.productName }}</p>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qty: {{ item.quantity }}</p>
                   </div>
                </div>
                <span class="text-xs font-black text-slate-900">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="flex items-center justify-between border-t border-slate-100 mt-5 pt-5">
               <div>
                  <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                  <p class="text-lg font-black text-slate-900 tracking-tight">{{ formatCurrency(order.totalAmount) }}</p>
               </div>
               <router-link 
                 :to="`/account/orders/${order.id}`"
                 class="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-900 hover:text-white"
               >
                  <FileText :size="12" />
                  Details
               </router-link>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="flex flex-col items-center justify-center py-24 text-center">
          <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-4xl bg-slate-50 text-slate-200 shadow-inner">
            <Inbox :size="48" />
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">No orders yet</h2>
          <p class="mt-2 text-sm font-medium text-slate-400 max-w-xs">Your purchases will appear here once you've made your first order.</p>
          <router-link
            to="/shop"
            class="mt-10 flex items-center gap-3 rounded-full bg-slate-900 px-10 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <Store :size="18" />
            Go to Shop
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