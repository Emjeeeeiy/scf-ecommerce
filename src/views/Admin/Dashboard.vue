<template>
  <AdminPanelLayout subtitle="Admin overview for catalog and order operations">
    <section class="rounded-xl bg-slate-950 p-5 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <LayoutDashboard :size="80" />
      </div>
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between relative z-10">
        <div class="max-w-2xl">
          <div class="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-amber-400">
            <ShieldCheck :size="12" />
            <span>Control center</span>
          </div>
          <h2 class="mt-2 text-xl font-black leading-tight tracking-tight sm:text-2xl">
            Keep products, categories, and order flow aligned.
          </h2>
          <p class="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
            Review storefront health, jump into high-priority tasks, and monitor recent order activity from one central hub.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{{ metric.label }}</p>
            <div class="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <component :is="metric.icon" :size="14" />
            </div>
          </div>
          <h3 class="mt-1.5 text-xl font-black text-slate-900 dark:text-white tracking-tight">{{ metric.value }}</h3>
        </div>
        <p class="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">{{ metric.caption }}</p>
      </article>
    </section>

    <section class="mt-5 grid gap-5 xl:grid-cols-[1fr_0.7fr]">
      <div class="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Management areas</p>
            <h3 class="mt-0.5 text-lg font-black text-slate-900 dark:text-white tracking-tight">Operational workspaces</h3>
          </div>
        </div>

        <div class="mt-5 grid gap-2.5 md:grid-cols-3">
          <router-link
            v-for="workspace in workspaces"
            :key="workspace.to"
            :to="workspace.to"
            class="group rounded-xl border border-slate-100 dark:border-slate-800 p-4 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98]"
          >
            <div class="flex items-center justify-between">
              <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{{ workspace.tag }}</p>
              <component :is="workspace.icon" :size="12" class="text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </div>
            <h4 class="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-amber-400 transition-colors">{{ workspace.title }}</h4>
            <p class="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{{ workspace.description }}</p>
          </router-link>
        </div>
      </div>

      <div class="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <p class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Status breakdown</p>
        <h3 class="mt-0.5 text-lg font-black text-slate-900 dark:text-white tracking-tight">Order pipeline</h3>

        <div class="mt-5 grid gap-2.5 grid-cols-2">
          <div
            v-for="statusCard in statusCards"
            :key="statusCard.label"
            class="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-transparent transition hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400">{{ statusCard.label }}</p>
              <span class="text-base font-black text-slate-950 dark:text-white">{{ statusCard.value }}</span>
            </div>
          </div>
        </div>
        <p class="mt-3 text-[9px] font-medium text-slate-400 dark:text-slate-500 italic">Live count from fulfillment status pipeline.</p>
      </div>
    </section>

    <section class="mt-5 rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Recent orders</p>
          <h3 class="mt-0.5 text-lg font-black text-slate-900 dark:text-white tracking-tight">Latest activity</h3>
        </div>
        <router-link to="/admin/orders" class="flex items-center gap-1.5 rounded-lg bg-slate-950 dark:bg-amber-400 px-3.5 py-1.5 text-[10px] font-bold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-amber-300 active:scale-95">
          <ShoppingCart :size="12" />
          View all
        </router-link>
      </div>

      <div class="mt-5 grid gap-2.5">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 transition hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User :size="14" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-xs font-black text-slate-950 dark:text-white">#{{ order.id.slice(0, 8) }}</p>
                  <span class="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">•</span>
                  <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}
                  </p>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                   <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500">{{ order.customerDetails?.email }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-2.5 lg:pt-0 border-slate-50 dark:border-slate-800">
              <div class="flex flex-col items-end">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</p>
                <span 
                  class="mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400': order.status === 'received',
                    'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400': order.status === 'processing',
                    'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400': order.status === 'shipped',
                    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': order.status === 'completed'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="flex flex-col items-end">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Amount</p>
                <span class="mt-0.5 text-xs font-black text-slate-950 dark:text-white">{{ formatCurrency(order.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!recentOrders.length" class="flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 py-10 text-slate-400 dark:text-slate-600">
          <PackageSearch :size="32" class="opacity-20 mb-2" />
          <p class="text-xs font-medium">No orders recorded yet</p>
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