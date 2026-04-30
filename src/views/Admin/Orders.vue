<template>
  <AdminPanelLayout subtitle="Track and update customer order statuses">
    <section class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div class="space-y-6">
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            <ClipboardList :size="14" />
            <span>Fulfillment summary</span>
          </div>
          <h1 class="mt-2 text-2xl font-black text-slate-900 tracking-tight">Manage orders</h1>
          <p class="mt-2 text-xs font-medium text-slate-500 leading-relaxed">
            Review order intake and update status as items move through fulfillment.
          </p>

          <div class="mt-6 grid gap-2">
            <div
              v-for="summary in summaries"
              :key="summary.label"
              class="flex items-center justify-between rounded-xl bg-slate-50/50 p-4 border border-transparent transition hover:border-slate-100"
            >
              <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{{ summary.label }}</p>
              <span class="text-lg font-black text-slate-900">{{ summary.value }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-slate-900 p-6 shadow-xl text-white">
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
            <Info :size="14" />
            <span>Workflow note</span>
          </div>
          <p class="mt-3 text-xs font-medium text-slate-300 leading-relaxed">
            Update statuses promptly to keep customers informed via their profile page.
          </p>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              <ShoppingCart :size="14" />
              <span>Order queue</span>
            </div>
            <h2 class="mt-1 text-xl font-black text-slate-900 tracking-tight">{{ orders.length }} orders</h2>
          </div>
        </div>

        <div class="mt-8 space-y-4">
          <article
            v-for="order in orders"
            :key="order.id"
            class="rounded-2xl border border-slate-50 bg-white p-5 transition-all hover:border-slate-200 hover:shadow-md"
          >
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="rounded-lg bg-slate-900 px-2 py-1 text-[9px] font-black text-white uppercase tracking-tighter">Order ID</span>
                    <h2 class="text-sm font-black tracking-tight text-slate-950">#{{ order.id.slice(0, 12) }}</h2>
                  </div>
                  <div class="mt-4 flex items-start gap-3">
                    <div class="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                      <User :size="16" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-black text-slate-950">
                        {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                      </p>
                      <p class="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail :size="10" />
                        {{ order.customerDetails?.email }}
                      </p>
                      <p class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Phone :size="10" />
                        {{ order.customerDetails?.contactNo || order.customerDetails?.contact }}
                      </p>
                      <p class="mt-2 text-[11px] font-medium leading-relaxed text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                        <MapPin :size="10" class="inline mr-1" />
                        {{ order.customerDetails?.completeAddress || 'No address provided' }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span class="rounded-lg bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-600 uppercase tracking-wider border border-amber-100">
                    {{ order.paymentMethod || order.customerDetails?.paymentMethod || 'COD' }}
                  </span>
                  <span class="rounded-lg bg-slate-50 px-2.5 py-1 text-[9px] font-bold text-slate-600 uppercase tracking-wider border border-slate-100">
                    {{ order.items?.length || 0 }} items
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50">
                <div class="flex-1 lg:min-w-[180px]">
                  <p class="mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Update Status</p>
                  <select
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2.5 text-xs font-bold text-slate-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                    :value="order.status"
                    @change="handleUpdateStatus(order.id, $event.target.value)"
                  >
                    <option value="received">Received</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div class="text-right">
                  <p class="mb-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Grand Total</p>
                  <p class="text-xl font-black text-slate-950 tracking-tight">{{ formatCurrency(order.totalAmount) }}</p>
                </div>
              </div>
            </div>

            <!-- Items Breakdown -->
            <div class="mt-6 border-t border-slate-50 pt-5">
              <div class="flex items-center gap-2 mb-3">
                <Package :size="12" class="text-slate-300" />
                <p class="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300">Manifest</p>
              </div>
              <div class="grid gap-1.5">
                <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between rounded-xl bg-slate-50/30 p-3 border border-slate-50">
                  <div class="min-w-0">
                    <p class="truncate text-xs font-black text-slate-950">{{ item.productName }}</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ item.color }} • {{ item.size }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-[11px] font-black text-slate-950">x{{ item.quantity }}</p>
                    <p class="text-[10px] font-bold text-slate-500">{{ formatCurrency(item.priceAtPurchase) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div v-if="!orders.length" class="flex flex-col items-center justify-center rounded-2xl bg-slate-50/20 py-16 text-slate-300 border border-dashed border-slate-200">
            <PackageSearch :size="40" class="opacity-20 mb-3" />
            <p class="text-sm font-medium">No orders in queue</p>
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { 
  ClipboardList, 
  Info, 
  ShoppingCart, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  PackageSearch 
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { listAllOrders, updateOrderStatus } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

const orders = ref([])

const loadOrders = async () => {
  orders.value = await listAllOrders()
}

const handleUpdateStatus = async (orderId, status) => {
  await updateOrderStatus(orderId, status)
  await loadOrders()
}

const countByStatus = (status) => orders.value.filter((order) => order.status === status).length

const summaries = computed(() => [
  { label: 'Received', value: countByStatus('received') },
  { label: 'Processing', value: countByStatus('processing') },
  { label: 'Shipped', value: countByStatus('shipped') },
  { label: 'Completed', value: countByStatus('completed') },
])

onMounted(loadOrders)
</script>