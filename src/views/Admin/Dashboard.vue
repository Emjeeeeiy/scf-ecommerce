<template>
  <AdminPanelLayout>
  <div class="space-y-4 sm:space-y-5">
    <AdminPageHead
      :eyebrow="today"
      :title="`${greeting}, ${displayName}`"
      description="Here's what's happening across your store today."
    />

    <!-- Metrics -->
    <section>
  <div class="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
    <article
      v-for="metric in metrics"
      :key="metric.label"
      class="admin-card p-4 sm:p-5"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="admin-eyebrow">{{ metric.label }}</p>
          <p class="mt-1.5 truncate font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-[1.7rem]">{{ metric.value }}</p>
        </div>

        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-md ring-1" :class="metric.iconClass">
          <component :is="metric.icon" :size="17" />
        </div>
      </div>

      <p class="mt-2 truncate text-xs text-neutral-500 dark:text-neutral-400">{{ metric.caption }}</p>
    </article>
  </div>
</section>

    <!-- Charts and Low Stock -->
    <section class="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] sm:gap-5">
      <!-- Sales Chart -->
      <div class="admin-card p-4 sm:p-5">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="admin-eyebrow">Performance</p>
            <h3 class="admin-card-title mt-0.5">Sales trends</h3>
          </div>
          <div class="flex items-center gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              v-for="f in filters"
              :key="f.id"
              @click="activeFilter = f.id"
              class="rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition"
              :class="activeFilter === f.id ? 'bg-white text-neutral-900  dark:bg-neutral-700 dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="h-70 w-full">
          <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
          <div v-else class="flex h-full items-center justify-center text-xs font-medium text-neutral-400">
            Generating chart data...
          </div>
        </div>
      </div>

      <!-- Low Stock Warnings -->
      <div class="admin-card flex flex-col p-4 sm:p-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="admin-eyebrow text-rose-500">Inventory alert</p>
            <h3 class="admin-card-title mt-0.5">Low stock</h3>
          </div>
          <span class="admin-pill border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            {{ lowStockItems.length }}
          </span>
        </div>

        <div class="max-h-75 flex-1 space-y-2.5 overflow-y-auto pr-1">
          <div
            v-for="item in lowStockItems"
            :key="item.variantKey"
            class="flex items-center gap-3 rounded-lg border border-neutral-100 p-2.5 transition hover:border-rose-200 hover:bg-rose-50/40 dark:border-neutral-800 dark:hover:border-rose-500/20 dark:hover:bg-rose-500/5"
          >
            <div class="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800">
              <img v-if="item.image" :src="item.image" loading="lazy" decoding="async" class="h-full w-full object-cover" />
              <div v-else class="flex h-full items-center justify-center text-neutral-300 dark:text-neutral-600"><Package :size="16" /></div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-bold text-neutral-900 dark:text-white">{{ item.name }}</p>
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                {{ item.color }} / {{ item.size }}
              </p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-sm font-bold" :class="item.stock === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-white'">{{ item.stock }}</p>
              <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">left</p>
            </div>
          </div>

          <div v-if="!lowStockItems.length" class="flex flex-col items-center justify-center py-12 text-neutral-300 dark:text-neutral-600">
            <ShieldCheck :size="24" class="mb-2 opacity-40" />
            <p class="text-[10px] font-bold uppercase tracking-[0.14em]">Stock levels healthy</p>
          </div>
        </div>

        <router-link to="/admin/products" class="admin-btn admin-btn-quiet mt-4 w-full">
          Manage inventory
        </router-link>
      </div>
    </section>

    <!-- Order pipeline -->
    <section class="admin-card p-4 sm:p-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="admin-eyebrow">Status breakdown</p>
          <h3 class="admin-card-title mt-0.5">Order pipeline</h3>
        </div>
        <router-link to="/admin/orders" class="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 transition hover:text-neutral-900 dark:hover:text-white">
          View all
        </router-link>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <div
          v-for="statusCard in statusCards"
          :key="statusCard.label"
          class="rounded-lg bg-neutral-100/70 p-3 dark:bg-neutral-800/50"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">{{ statusCard.label }}</p>
            <span class="font-heading text-lg font-bold text-neutral-900 dark:text-white">{{ statusCard.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent activity -->
    <section class="admin-card p-4 sm:p-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="admin-eyebrow">Recent orders</p>
          <h3 class="admin-card-title mt-0.5">Latest activity</h3>
        </div>
        <router-link to="/admin/orders" class="admin-btn admin-btn-quiet px-3.5 py-1.5">
          View all
        </router-link>
      </div>

      <div class="mt-4 grid gap-2.5">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="rounded-lg border border-neutral-100 bg-white p-3.5 transition hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                <User :size="14" />
              </div>
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-neutral-900 dark:text-white">
                  #{{ order.id.slice(0, 8) }}
                  <span class="font-semibold text-neutral-400"> · {{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}</span>
                </p>
                <p class="mt-0.5 truncate text-[11px] text-neutral-400 dark:text-neutral-500">{{ order.customerDetails?.email }}</p>
              </div>
            </div>

            <div class="flex shrink-0 items-center justify-between gap-5 border-t border-neutral-100 pt-2.5 dark:border-neutral-800 sm:justify-end sm:border-t-0 sm:pt-0">
              <span :class="getStatusClass(order.status)" class="admin-pill">
                {{ order.status }}
              </span>
              <span class="text-sm font-bold text-neutral-900 dark:text-white">{{ formatCurrency(order.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <div v-if="!recentOrders.length" class="flex flex-col items-center justify-center rounded-lg bg-neutral-50 py-10 text-neutral-300 dark:bg-neutral-800/50 dark:text-neutral-600">
          <PackageSearch :size="28" stroke-width="1.5" class="mb-2 opacity-50" />
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em]">No orders yet</p>
        </div>
      </div>
    </section>
  </div>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ShoppingCart,
  Package,
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
import AdminPageHead from '../../components/AdminPageHead.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useOrderStore } from '../../stores/orderStore'
import { useSession } from '../../composables/useSession'
import { formatCurrency, getOrderStatusClasses } from '../../utils/format'

import { useAdminTheme } from '../../composables/useAdminTheme'

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

const { isDarkMode } = useAdminTheme()
const { profile } = useSession()
const { products, loadCatalog, lowStockVariants } = useCatalogStore()
const { orders, subscribeOrders, unsubscribeOrders, countByStatus } = useOrderStore()
const activeFilter = ref('week')

const displayName = computed(() =>
  profile.value?.username || profile.value?.email?.split('@')[0] || 'Admin',
)
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5) return 'Good evening'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})
const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const filters = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

// Orders arrive pre-sorted (createdAt desc) from the shared realtime subscription.
const recentOrders = computed(() => orders.value.slice(0, 5))

const getStatusClass = getOrderStatusClasses

const lowStockItems = computed(() => lowStockVariants(5))

const chartData = computed(() => {
  const labels = []
  const values = []
  const now = new Date()

  // Helper to get ms from firestore timestamp or date
  const getMs = (timestamp) => {
    if (!timestamp) return 0
    if (typeof timestamp.toMillis === 'function') return timestamp.toMillis()
    if (timestamp.seconds) return timestamp.seconds * 1000
    return new Date(timestamp).getTime()
  }
  
  if (activeFilter.value === 'today') {
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}:00`)
      const hourStart = new Date(now).setHours(i, 0, 0, 0)
      const hourEnd = new Date(now).setHours(i, 59, 59, 999)
      const total = orders.value
        .filter(o => {
          const ms = getMs(o.createdAt)
          return ms >= hourStart && ms <= hourEnd
        })
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
        .filter(o => {
          const ms = getMs(o.createdAt)
          return ms >= start && ms <= end
        })
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
        .filter(o => {
          const ms = getMs(o.createdAt)
          return ms >= start && ms <= end
        })
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
        .filter(o => {
          const ms = getMs(o.createdAt)
          return ms >= start && ms <= end
        })
        .reduce((sum, o) => sum + o.totalAmount, 0)
      values.push(total)
    })
  }

  const primaryColor = isDarkMode.value ? '#e5e5e5' : '#171717'
  const bgColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.04)' : 'rgba(23, 23, 23, 0.05)'

  return {
    labels,
    datasets: [{
      label: 'Sales Revenue',
      data: values,
      borderColor: primaryColor,
      backgroundColor: bgColor,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: primaryColor,
      tension: 0.4,
      fill: true
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#171717',
      titleColor: '#fff',
      titleFont: { size: 11, weight: 'bold' },
      bodyFont: { size: 12 },
      callbacks: {
        label: (context) => ` ${formatCurrency(context.raw)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: isDarkMode.value ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
      ticks: { 
        font: { size: 10 },
        color: isDarkMode.value ? '#737373' : '#a3a3a3',
        callback: (value) => formatCurrency(value)
      }
    },
    x: {
      grid: { display: false },
      ticks: { 
        font: { size: 10 },
        color: isDarkMode.value ? '#737373' : '#a3a3a3'
      }
    }
  }
}))

const metrics = computed(() => [
  {
    label: 'Revenue',
    value: formatCurrency(orders.value.reduce((sum, o) => sum + o.totalAmount, 0)),
    icon: TrendingUp,
    caption: 'Total lifetime sales',
    iconClass: 'bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  },
  {
    label: 'Products',
    value: products.value.length,
    icon: Package,
    caption: 'Total catalog entries',
    iconClass: 'bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  },
  {
    label: 'Orders',
    value: orders.value.length,
    icon: ShoppingCart,
    caption: 'Lifetime order count',
    iconClass: 'bg-neutral-100 text-neutral-600 ring-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-400 dark:ring-neutral-500/20',
  },
  {
    label: 'Low Stock',
    value: lowStockItems.value.length,
    icon: AlertTriangle,
    caption: 'Items requiring attention',
    iconClass: 'bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
  },
])

const statusCards = computed(() => [
  { label: 'Received', value: countByStatus('received') },
  { label: 'Processing', value: countByStatus('processing') },
  { label: 'Shipped', value: countByStatus('shipped') },
  { label: 'Completed', value: countByStatus('completed') },
])

onMounted(() => {
  loadCatalog(true)
  subscribeOrders()
})
onUnmounted(unsubscribeOrders)
</script>
