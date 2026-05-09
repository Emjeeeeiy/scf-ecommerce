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

    <!-- Metrics Cards -->
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

    <!-- Charts and Low Stock Section -->
    <section class="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <!-- Sales Chart -->
      <div class="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Performance</p>
            <h3 class="mt-0.5 text-lg font-black text-slate-900 dark:text-white tracking-tight">Sales Trends</h3>
          </div>
          <div class="flex items-center gap-1 rounded-lg bg-slate-50 dark:bg-slate-800 p-1">
            <button 
              v-for="f in filters" 
              :key="f.id"
              @click="activeFilter = f.id"
              class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all rounded-md"
              :class="activeFilter === f.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
        
        <div class="h-[280px] w-full">
          <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
          <div v-else class="flex h-full items-center justify-center text-xs text-slate-400 font-medium">
            Generating chart data...
          </div>
        </div>
      </div>

      <!-- Low Stock Warnings -->
      <div class="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col">
        <div class="flex items-center justify-between mb-5">
          <div>
            <p class="text-[9px] font-bold uppercase tracking-[0.25em] text-rose-500">Inventory Alert</p>
            <h3 class="mt-0.5 text-lg font-black text-slate-900 dark:text-white tracking-tight">Low Stock Products</h3>
          </div>
          <span class="rounded-full bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
            {{ lowStockItems.length }} alerts
          </span>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
          <div 
            v-for="item in lowStockItems" 
            :key="item.variantKey"
            class="group flex items-center gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 transition hover:border-rose-200 dark:hover:border-rose-900/30 hover:bg-rose-50/30 dark:hover:bg-rose-500/5"
          >
            <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
              <img v-if="item.image" :src="item.image" class="h-full w-full object-cover" />
              <div v-else class="flex h-full items-center justify-center text-slate-300"><Package :size="16" /></div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[11px] font-bold text-slate-900 dark:text-white">{{ item.name }}</p>
              <p class="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ item.color }} / {{ item.size }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs font-black" :class="item.stock === 0 ? 'text-rose-600' : 'text-amber-600'">{{ item.stock }}</p>
              <p class="text-[8px] font-bold uppercase tracking-widest text-slate-400">Left</p>
            </div>
          </div>

          <div v-if="!lowStockItems.length" class="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
            <ShieldCheck :size="24" class="opacity-20 mb-2" />
            <p class="text-[10px] font-bold uppercase tracking-widest">Stock levels healthy</p>
          </div>
        </div>
        
        <router-link to="/admin/products" class="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800">
          Manage Inventory
        </router-link>
      </div>
    </section>

    <!-- Operational Workspaces & Pipeline -->
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

    <!-- Recent Activity -->
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
import { computed, onMounted, ref, watch } from 'vue'
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingCart, 
  Package, 
  Briefcase,
  ShieldCheck,
  User,
  PackageSearch,
  TrendingUp,
  AlertTriangle
} from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { listCategories, listProducts } from '../../services/catalogService'
import { listAllOrders } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
)

const categories = ref([])
const products = ref([])
const orders = ref([])
const activeFilter = ref('week')

const filters = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
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

const lowStockItems = computed(() => {
  const items = []
  products.value.forEach(product => {
    product.variants?.forEach(variant => {
      if (variant.stock <= 5) {
        items.push({
          variantKey: `${product.id}-${variant.id}`,
          name: product.name,
          image: product.base64Image,
          color: variant.color || 'Std',
          size: variant.size || 'Std',
          stock: variant.stock
        })
      }
    })
  })
  return items.sort((a, b) => a.stock - b.stock)
})

const chartData = computed(() => {
  const labels = []
  const values = []
  const now = new Date()
  
  if (activeFilter.value === 'today') {
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}:00`)
      const hourStart = new Date(now).setHours(i, 0, 0, 0)
      const hourEnd = new Date(now).setHours(i, 59, 59, 999)
      const total = orders.value
        .filter(o => o.createdAt >= hourStart && o.createdAt <= hourEnd)
        .reduce((sum, o) => sum + o.totalAmount, 0)
      values.push(total)
    }
  } else if (activeFilter.value === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }))
      const start = new Date(d).setHours(0, 0, 0, 0)
      const end = new Date(d).setHours(23, 59, 59, 999)
      const total = orders.value
        .filter(o => o.createdAt >= start && o.createdAt <= end)
        .reduce((sum, o) => sum + o.totalAmount, 0)
      values.push(total)
    }
  } else if (activeFilter.value === 'month') {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    for (let i = 1; i <= daysInMonth; i++) {
      labels.push(`Day ${i}`)
      const start = new Date(now.getFullYear(), now.getMonth(), i, 0, 0, 0, 0).getTime()
      const end = new Date(now.getFullYear(), now.getMonth(), i, 23, 59, 59, 999).getTime()
      const total = orders.value
        .filter(o => o.createdAt >= start && o.createdAt <= end)
        .reduce((sum, o) => sum + o.totalAmount, 0)
      values.push(total)
    }
  } else if (activeFilter.value === 'year') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach((m, idx) => {
      labels.push(m)
      const start = new Date(now.getFullYear(), idx, 1, 0, 0, 0, 0).getTime()
      const end = new Date(now.getFullYear(), idx + 1, 0, 23, 59, 59, 999).getTime()
      const total = orders.value
        .filter(o => o.createdAt >= start && o.createdAt <= end)
        .reduce((sum, o) => sum + o.totalAmount, 0)
      values.push(total)
    })
  }

  return {
    labels,
    datasets: [{
      label: 'Sales Revenue',
      data: values,
      borderColor: '#0f172a',
      backgroundColor: 'rgba(15, 23, 42, 0.05)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#0f172a',
      tension: 0.4,
      fill: true
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#0f172a',
      titleFont: { size: 10, weight: 'bold' },
      bodyFont: { size: 12 },
      callbacks: {
        label: (context) => ` ${formatCurrency(context.raw)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.03)' },
      ticks: { 
        font: { size: 9 },
        callback: (value) => formatCurrency(value)
      }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 9 } }
    }
  }
}

const metrics = computed(() => [
  {
    label: 'Revenue',
    value: formatCurrency(orders.value.reduce((sum, o) => sum + o.totalAmount, 0)),
    icon: TrendingUp,
    caption: 'Total lifetime sales',
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
    label: 'Low Stock',
    value: lowStockItems.value.length,
    icon: AlertTriangle,
    caption: 'Items requiring attention',
  },
])

const statusCards = computed(() => [
  { label: 'Received', value: orders.value.filter(o => o.status === 'received').length },
  { label: 'Processing', value: orders.value.filter(o => o.status === 'processing').length },
  { label: 'Shipped', value: orders.value.filter(o => o.status === 'shipped').length },
  { label: 'Completed', value: orders.value.filter(o => o.status === 'completed').length },
])

onMounted(loadDashboard)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>