<template>
  <AdminPanelLayout subtitle="Admin overview for catalog and order operations">
    <section class="rounded-2xl bg-slate-950 p-6 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <LayoutDashboard :size="120" />
      </div>
      <div class="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between relative z-10">
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
            <ShieldCheck :size="14" />
            <span>Control center</span>
          </div>
          <h2 class="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
            Keep products, categories, and order flow aligned.
          </h2>
          <p class="mt-3 text-sm text-slate-300 font-medium leading-relaxed">
            Review storefront health, jump into high-priority tasks, and monitor recent order activity from one central hub.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{{ metric.label }}</p>
            <div class="p-2 rounded-lg bg-slate-50 text-slate-400">
              <component :is="metric.icon" :size="16" />
            </div>
          </div>
          <h3 class="mt-2 text-2xl font-black text-slate-900 tracking-tight">{{ metric.value }}</h3>
        </div>
        <p class="mt-3 text-[11px] font-medium text-slate-500">{{ metric.caption }}</p>
      </article>
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Management areas</p>
            <h3 class="mt-1 text-xl font-black text-slate-900 tracking-tight">Operational workspaces</h3>
          </div>
        </div>

        <div class="mt-6 grid gap-3 md:grid-cols-3">
          <router-link
            v-for="workspace in workspaces"
            :key="workspace.to"
            :to="workspace.to"
            class="group rounded-2xl border border-slate-100 p-5 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{{ workspace.tag }}</p>
              <component :is="workspace.icon" :size="14" class="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
            <h4 class="mt-3 text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">{{ workspace.title }}</h4>
            <p class="mt-2 text-xs font-medium text-slate-500 leading-relaxed">{{ workspace.description }}</p>
          </router-link>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Status breakdown</p>
        <h3 class="mt-1 text-xl font-black text-slate-900 tracking-tight">Order pipeline</h3>

        <div class="mt-6 grid gap-3 grid-cols-2">
          <div
            v-for="statusCard in statusCards"
            :key="statusCard.label"
            class="rounded-xl bg-slate-50 p-4 border border-transparent transition hover:border-slate-200"
          >
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-slate-600">{{ statusCard.label }}</p>
              <span class="text-lg font-black text-slate-950">{{ statusCard.value }}</span>
            </div>
          </div>
        </div>
        <p class="mt-4 text-[10px] font-medium text-slate-400 italic">Live count from fulfillment status pipeline.</p>
      </div>
    </section>

    <section class="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Recent orders</p>
          <h3 class="mt-1 text-xl font-black text-slate-900 tracking-tight">Latest activity</h3>
        </div>
        <router-link to="/admin/orders" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95">
          <ShoppingCart :size="14" />
          View all
        </router-link>
      </div>

      <div class="mt-6 grid gap-3">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="rounded-xl border border-slate-100 bg-white p-4 transition hover:border-slate-200 hover:shadow-sm"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-4">
              <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User :size="16" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-black text-slate-950">#{{ order.id.slice(0, 8) }}</p>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">•</span>
                  <p class="text-xs font-bold text-slate-600">
                    {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                  </p>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                   <p class="text-[11px] font-medium text-slate-400">{{ order.customerDetails?.email }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-50">
              <div class="flex flex-col items-end">
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <span 
                  class="mt-0.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-amber-50 text-amber-600': order.status === 'received',
                    'bg-slate-50 text-slate-600': order.status === 'processing',
                    'bg-purple-50 text-purple-600': order.status === 'shipped',
                    'bg-emerald-50 text-emerald-600': order.status === 'completed'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="flex flex-col items-end">
                <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</p>
                <span class="mt-0.5 text-sm font-black text-slate-950">{{ formatCurrency(order.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!recentOrders.length" class="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-12 text-slate-400">
          <PackageSearch :size="40" class="opacity-20 mb-3" />
          <p class="text-sm font-medium">No orders recorded yet</p>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { 
  LayoutDashboard, 
  Plus, 
  Layers, 
  ShoppingCart, 
  Package, 
  Briefcase,
  Users,
  ShieldCheck,
  User,
  PackageSearch
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { listCategories, listProducts } from '../../services/catalogService'
import { listAllOrders } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

const categories = ref([])
const products = ref([])
const orders = ref([])

const quickActions = [
  { to: '/admin/products', label: 'Add product' },
  { to: '/admin/categories', label: 'Edit categories' },
  { to: '/admin/orders', label: 'Review orders' },
]

const workspaces = [
  {
    to: '/admin/categories',
    tag: 'Structure',
    title: 'Categories',
    icon: Layers,
    description: 'Control the storefront taxonomy customers use to browse.',
  },
  {
    to: '/admin/products',
    tag: 'Catalog',
    title: 'Products',
    icon: Package,
    description: 'Create products, manage pricing, and inventory.',
  },
  {
    to: '/admin/orders',
    tag: 'Fulfillment',
    title: 'Orders',
    icon: ShoppingCart,
    description: 'Track incoming orders and processing pipeline.',
  },
]

const loadDashboard = async () => {
  categories.value = await listCategories()
  products.value = await listProducts()
  orders.value = await listAllOrders()
}

const recentOrders = computed(() => [...orders.value].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5))

const statusCount = (status) => orders.value.filter((order) => order.status === status).length

const metrics = computed(() => [
  {
    label: 'Categories',
    value: categories.value.length,
    icon: Layers,
    caption: 'Active browse groups',
  },
  {
    label: 'Products',
    value: products.value.length,
    icon: Package,
    caption: 'Total catalog entries',
  },
  {
    label: 'Orders',
    value: orders.value.length,
    icon: ShoppingCart,
    caption: 'Lifetime order count',
  },
  {
    label: 'Variants',
    value: products.value.reduce((sum, product) => sum + (product.variants?.length || 0), 0),
    icon: Briefcase,
    caption: 'Total shoppable SKUs',
  },
])

const statusCards = computed(() => [
  {
    label: 'Received',
    value: statusCount('received'),
  },
  {
    label: 'Processing',
    value: statusCount('processing'),
  },
  {
    label: 'Shipped',
    value: statusCount('shipped'),
  },
  {
    label: 'Completed',
    value: statusCount('completed'),
  },
])

onMounted(loadDashboard)
</script>