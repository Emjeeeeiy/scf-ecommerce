<template>
  <AdminPanelLayout subtitle="Track and update customer order statuses">
    <section class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div class="space-y-6">
        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Fulfillment summary</p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">Manage orders</h1>
          <p class="mt-3 text-sm text-slate-500">
            Review order intake and update status as items move through fulfillment.
          </p>

          <div class="mt-6 grid gap-3">
            <div
              v-for="summary in summaries"
              :key="summary.label"
              class="rounded-2xl bg-slate-50 p-4"
            >
              <div class="flex items-center justify-between">
                <p class="font-semibold text-slate-900">{{ summary.label }}</p>
                <span class="text-lg font-bold text-slate-900">{{ summary.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Workflow note</p>
          <p class="mt-3 text-sm text-slate-600">
            `received` for new orders, `processing` while preparing items, `shipped` after dispatch, and `completed` when fulfillment is done.
          </p>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Order queue</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ orders.length }} orders</h2>
          </div>
        </div>

        <div class="mt-8 space-y-4">
          <article
            v-for="order in orders"
            :key="order.id"
            class="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Order ID</p>
                <h2 class="text-lg font-semibold text-slate-900">{{ order.id }}</h2>
                <p class="text-sm text-slate-500">
                  Customer: {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                </p>
                <p class="text-sm text-slate-500">
                  {{ order.customerDetails?.email }} | {{ order.customerDetails?.contactNo || order.customerDetails?.contact }}
                </p>
                <p class="text-sm text-slate-500">
                  {{ order.customerDetails?.completeAddress || 'No address provided' }}
                </p>
                <p class="text-sm text-slate-500">
                  Payment: {{ order.paymentMethod || order.customerDetails?.paymentMethod || 'Not set' }}
                </p>
                <p class="mt-2 text-sm font-semibold text-slate-900">{{ formatCurrency(order.totalAmount) }}</p>
              </div>

              <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ order.items?.length || 0 }} items
                </span>
                <select
                  class="rounded-2xl border border-slate-200 px-4 py-2"
                  :value="order.status"
                  @change="handleUpdateStatus(order.id, $event.target.value)"
                >
                  <option value="received">received</option>
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            </div>

            <div class="mt-4 space-y-2 text-sm text-slate-600">
              <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between gap-4">
                <span>{{ item.productName }} / {{ item.color }} / {{ item.size }} x{{ item.quantity }}</span>
                <span>{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
              </div>
            </div>
          </article>

          <div v-if="!orders.length" class="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            No orders found.
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
