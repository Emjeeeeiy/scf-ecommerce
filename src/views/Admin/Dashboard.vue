<template>
  <AdminPanelLayout subtitle="Admin overview for catalog and order operations">
    <section class="rounded-4xl bg-slate-950 p-8 text-white shadow-lg">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-2xl">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-300">Control center</p>
          <h2 class="mt-3 text-4xl font-bold leading-tight">
            Keep products, categories, and order flow aligned from one dashboard.
          </h2>
          <p class="mt-4 text-sm text-slate-300">
            Use this page as the starting point for daily operations. Review current storefront health, jump into high-priority tasks, and monitor recent order activity.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <router-link
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {{ action.label }}
          </router-link>
        </div>
      </div>
    </section>

    <section class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <p class="text-sm uppercase tracking-[0.2em] text-slate-500">{{ metric.label }}</p>
        <h3 class="mt-3 text-3xl font-bold text-slate-900">{{ metric.value }}</h3>
        <p class="mt-2 text-sm text-slate-500">{{ metric.caption }}</p>
      </article>
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Management areas</p>
            <h3 class="mt-2 text-2xl font-bold text-slate-900">Operational workspaces</h3>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <router-link
            v-for="workspace in workspaces"
            :key="workspace.to"
            :to="workspace.to"
            class="rounded-3xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">{{ workspace.tag }}</p>
            <h4 class="mt-3 text-lg font-semibold text-slate-900">{{ workspace.title }}</h4>
            <p class="mt-2 text-sm text-slate-600">{{ workspace.description }}</p>
          </router-link>
        </div>
      </div>

      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Status breakdown</p>
        <h3 class="mt-2 text-2xl font-bold text-slate-900">Order pipeline</h3>

        <div class="mt-6 space-y-4">
          <div
            v-for="statusCard in statusCards"
            :key="statusCard.label"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-900">{{ statusCard.label }}</p>
              <span class="text-lg font-bold text-slate-900">{{ statusCard.value }}</span>
            </div>
            <p class="mt-2 text-sm text-slate-500">{{ statusCard.caption }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Recent orders</p>
          <h3 class="mt-2 text-2xl font-bold text-slate-900">Latest activity</h3>
        </div>
        <router-link to="/admin/orders" class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Open orders
        </router-link>
      </div>

      <div class="mt-6 grid gap-4">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="rounded-2xl border border-slate-200 p-5"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm text-slate-500">Order</p>
              <p class="font-semibold text-slate-900">{{ order.id }}</p>
              <p class="text-sm text-slate-500">
                {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
              </p>
              <p class="text-sm text-slate-500">{{ order.customerDetails?.email }}</p>
              <p class="text-sm text-slate-500">
                {{ order.paymentMethod || order.customerDetails?.paymentMethod || 'Payment not set' }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {{ order.status }}
              </span>
              <span class="text-sm font-semibold text-slate-900">{{ formatCurrency(order.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div v-if="!recentOrders.length" class="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
          Orders will appear here once customers begin checking out.
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { listCategories, listProducts } from '../../services/catalogService'
import { listAllOrders } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

const categories = ref([])
const products = ref([])
const orders = ref([])

const quickActions = [
  { to: '/admin/products', label: 'Add product' },
  { to: '/admin/categories', label: 'Organize categories' },
  { to: '/admin/orders', label: 'Review fulfillment' },
]

const workspaces = [
  {
    to: '/admin/categories',
    tag: 'Structure',
    title: 'Categories',
    description: 'Control the storefront taxonomy customers use to browse the catalog.',
  },
  {
    to: '/admin/products',
    tag: 'Catalog',
    title: 'Products',
    description: 'Create products, manage pricing, and maintain variant inventory.',
  },
  {
    to: '/admin/orders',
    tag: 'Fulfillment',
    title: 'Orders',
    description: 'Track incoming orders and move them through the processing pipeline.',
  },
]

const loadDashboard = async () => {
  categories.value = await listCategories()
  products.value = await listProducts()
  orders.value = await listAllOrders()
}

const recentOrders = computed(() => orders.value.slice(0, 5))

const statusCount = (status) => orders.value.filter((order) => order.status === status).length

const metrics = computed(() => [
  {
    label: 'Categories',
    value: categories.value.length,
    caption: 'Storefront browse groups',
  },
  {
    label: 'Products',
    value: products.value.length,
    caption: 'Published catalog entries',
  },
  {
    label: 'Orders',
    value: orders.value.length,
    caption: 'Total recorded orders',
  },
  {
    label: 'Active variants',
    value: products.value.reduce((sum, product) => sum + (product.variants?.length || 0), 0),
    caption: 'Shoppable size and color options',
  },
])

const statusCards = computed(() => [
  {
    label: 'Received',
    value: statusCount('received'),
    caption: 'Orders waiting for first review.',
  },
  {
    label: 'Processing',
    value: statusCount('processing'),
    caption: 'Orders currently being prepared.',
  },
  {
    label: 'Shipped',
    value: statusCount('shipped'),
    caption: 'Orders already dispatched to customers.',
  },
  {
    label: 'Completed',
    value: statusCount('completed'),
    caption: 'Orders marked as fulfilled.',
  },
])

onMounted(loadDashboard)
</script>