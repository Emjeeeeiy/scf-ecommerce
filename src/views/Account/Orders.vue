<template>
  <AppShell subtitle="Order History">
    <section class="rounded-2xl bg-white p-6 shadow-xl shadow-blue-100/50 ring-1 ring-blue-50 sm:p-8">
      <div class="flex items-center gap-4 border-b border-blue-50 pb-6 mb-6">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
          <Package :size="20" />
        </div>
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-blue-400 leading-none mb-1">Your Purchases</p>
          <h1 class="text-2xl font-black tracking-tighter text-blue-900 sm:text-3xl">Order History</h1>
        </div>
      </div>

      <div class="space-y-4">
        <article
          v-for="order in orders"
          :key="order.id"
          class="group overflow-hidden rounded-xl border border-blue-50 bg-blue-50/10 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-lg"
        >
          <div class="flex flex-col gap-4 p-5 sm:p-6">
            <!-- Order Header -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-blue-50 pb-4">
              <div class="flex items-center gap-3">
                 <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-400 ring-1 ring-blue-50">
                    <Hash :size="14" />
                 </div>
                 <div>
                    <p class="text-[8px] font-black uppercase tracking-widest text-blue-400">Ref</p>
                    <h2 class="text-xs font-black text-blue-900 truncate max-w-[120px]">{{ order.id }}</h2>
                 </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span 
                  class="rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest"
                  :class="statusClasses(order.status)"
                >
                  {{ order.status }}
                </span>
                <div class="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[8px] font-black text-white">
                   <Calendar :size="10" class="text-yellow-400" />
                   {{ formatDate(order.createdAt) }}
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-3">
              <div 
                v-for="item in order.items" 
                :key="item.id" 
                class="flex items-center justify-between gap-4 rounded-xl bg-white/50 p-3 ring-1 ring-blue-50"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                   <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-400">
                      <ShoppingBag :size="14" />
                   </div>
                   <div class="min-w-0">
                      <p class="truncate text-xs font-black text-blue-900">{{ item.productName }}</p>
                      <p class="text-[9px] font-bold text-blue-400 uppercase tracking-widest">x{{ item.quantity }}</p>
                   </div>
                </div>
                <span class="text-xs font-black text-blue-900">{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="flex items-end justify-between border-t border-blue-50 pt-4">
               <div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Total</p>
                  <p class="text-xl font-black text-blue-900">{{ formatCurrency(order.totalAmount) }}</p>
               </div>
               <button class="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600 transition-all hover:bg-blue-100">
                  <FileText :size="14" />
                  Details
               </button>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50/50 text-blue-200">
            <Inbox :size="40" />
          </div>
          <h2 class="text-lg font-black text-blue-900">No orders yet</h2>
          <p class="mt-1 text-xs font-medium text-blue-400">Your purchases will appear here.</p>
          <router-link
            to="/shop"
            class="mt-6 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-black text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Store :size="16" />
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