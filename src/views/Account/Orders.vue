<template>
  <AppShell subtitle="Review your checkout history">
    <section class="rounded-3xl bg-white p-8 shadow-sm">
      <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Orders</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Order history</h1>

      <div class="mt-8 space-y-4">
        <article
          v-for="order in orders"
          :key="order.id"
          class="rounded-2xl border border-slate-200 p-5"
        >
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm text-slate-500">Order ID</p>
              <h2 class="text-lg font-semibold text-slate-900">{{ order.id }}</h2>
            </div>
            <div class="flex items-center gap-3">
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {{ order.status }}
              </span>
              <span class="text-sm font-semibold text-slate-900">
                {{ formatCurrency(order.totalAmount) }}
              </span>
            </div>
          </div>

          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between gap-4">
              <span>{{ item.productName }} x{{ item.quantity }}</span>
              <span>{{ formatCurrency(item.priceAtPurchase * item.quantity) }}</span>
            </div>
          </div>
        </article>

        <div v-if="!orders.length" class="rounded-2xl bg-slate-100 p-6 text-sm text-slate-600">
          No orders yet.
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

const { authUser } = useSession()
const orders = ref([])

const loadOrders = async () => {
  if (!authUser.value) {
    return
  }

  orders.value = await listUserOrders(authUser.value.uid)
}

onMounted(loadOrders)
</script>
