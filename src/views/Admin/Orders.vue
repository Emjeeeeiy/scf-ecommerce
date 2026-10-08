<template>
  <AdminPanelLayout>
    <div class="mx-auto max-w-7xl space-y-4 sm:space-y-5">
      <AdminPageHead
        eyebrow="Sales"
        title="Orders"
        description="Track fulfillment and keep every order moving."
      />

      <!-- Stats -->
      <section class="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
        <div
          v-for="summary in summaries"
          :key="summary.label"
          class="admin-card p-4"
        >
          <p class="admin-eyebrow">{{ summary.label }}</p>
          <p class="mt-1 font-heading text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ summary.value }}</p>
        </div>
      </section>

      <!-- Filters -->
      <section class="space-y-3">
        <div class="admin-card flex flex-col items-stretch gap-2.5 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" :size="16" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by ID, name, email, or reference..."
              class="admin-search"
            >
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              title="Clear search"
              aria-label="Clear search"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X :size="15" />
            </button>
          </div>

          <div class="flex items-center gap-2.5">
            <div class="flex flex-1 items-center rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800 lg:flex-none">
              <Calendar :size="14" class="mr-2 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <input
                v-model="startDate"
                type="date"
                aria-label="Start date"
                class="border-none bg-transparent p-0 text-xs font-semibold text-neutral-700 focus:ring-0 dark:text-neutral-300"
              >
              <span class="mx-2 text-neutral-300 dark:text-neutral-600">—</span>
              <input
                v-model="endDate"
                type="date"
                aria-label="End date"
                class="border-none bg-transparent p-0 text-xs font-semibold text-neutral-700 focus:ring-0 dark:text-neutral-300"
              >
            </div>

            <button
              v-if="startDate || endDate || searchQuery || statusFilter !== 'all'"
              @click="resetFilters"
              title="Reset filters"
              aria-label="Reset filters"
              class="admin-icon-btn border border-neutral-200 dark:border-neutral-700"
            >
              <RotateCcw :size="16" />
            </button>
          </div>
        </div>

          <!-- Status quick filters & bulk actions -->
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="status in ['all', 'received', 'processing', 'shipped', 'completed']"
                :key="status"
                @click="statusFilter = status"
                class="inline-flex items-center rounded-lg border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition"
                :class="statusFilter === status
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-200 bg-white text-neutral-400 hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200'"
              >
                {{ status }}
                <span
                  class="ml-1.5 rounded-md px-1.5 py-0.5 text-[10px]"
                  :class="statusFilter === status ? 'bg-white/20 dark:bg-black/10' : 'bg-neutral-100 dark:bg-neutral-800'"
                >
                  {{ status === 'all' ? orders.length : countByStatus(status) }}
                </span>
              </button>
            </div>

            <!-- Bulk Actions Bar -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div v-if="selectedOrders.length" class="flex items-center gap-1 rounded-lg bg-neutral-900 p-1.5 pl-3.5 dark:bg-white">
                <span class="mr-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white dark:text-neutral-900">
                  {{ selectedOrders.length }} selected
                </span>
                <div class="mx-1 h-5 w-px bg-white/15 dark:bg-neutral-900/10"></div>
                <div class="flex items-center">
                  <button
                    v-for="status in ['received', 'processing', 'shipped', 'completed']"
                    :key="status"
                    @click="handleBulkUpdate(status)"
                    class="rounded-md px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10 dark:text-neutral-900 dark:hover:bg-black/10"
                  >
                    {{ status }}
                  </button>
                </div>
                <button
                  @click="selectedOrders = []"
                  title="Clear selection"
                  aria-label="Clear selection"
                  class="ml-1 rounded-md p-1.5 text-white transition hover:bg-white/10 dark:text-neutral-900 dark:hover:bg-black/10"
                >
                  <X :size="14" />
                </button>
              </div>
            </Transition>
          </div>
      </section>

      <!-- Orders table -->
      <section class="admin-card overflow-hidden">
        <div class="admin-card-table-wrap overflow-x-auto">
          <table class="admin-card-table w-full border-collapse border-spacing-0 text-left">
            <thead>
              <tr class="border-b border-neutral-100 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/40">
                <th class="w-10 py-3 pl-5">
                  <div class="flex items-center justify-center">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      aria-label="Select all orders"
                      class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400/30 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                    >
                  </div>
                </th>
                <th class="admin-th">Order ID</th>
                <th class="admin-th">Status</th>
                <th class="admin-th">Customer</th>
                <th class="admin-th">Product</th>
                <th class="admin-th">Date</th>
                <th class="admin-th text-right">Total</th>
                <th class="admin-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr v-if="loading">
                <td colspan="8" class="py-20 text-center">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-400 dark:border-neutral-800 dark:border-t-neutral-400"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Retrieving order data...</p>
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr
                  v-for="order in pagedOrders"
                  :key="order.id"
                  class="cursor-pointer transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30"
                  :class="selectedOrders.includes(order.id) ? 'bg-neutral-50 dark:bg-neutral-800/40' : ''"
                  @click="openDetails(order)"
                >
                  <td class="py-4 pl-5" data-label="Select" @click.stop>
                    <div class="flex items-center justify-center">
                      <input
                        type="checkbox"
                        :value="order.id"
                        v-model="selectedOrders"
                        :aria-label="`Select order ${order.id.slice(0, 8)}`"
                        class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400/30 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                      >
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4" data-label="Order ID">
                    <div class="flex items-center gap-2">
                      <span
                        v-if="!order.seenByAdmin"
                        class="flex h-2 w-2 shrink-0 rounded-full bg-blue-500"
                        title="New order"
                      ></span>
                      <span class="rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white dark:bg-white dark:text-neutral-900">
                        #{{ order.id.slice(0, 8) }}
                      </span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4" data-label="Status">
                    <span
                      class="admin-pill"
                      :class="getStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4" data-label="Customer">
                    <div class="max-w-50">
                      <div class="mb-0.5 flex items-center gap-2">
                        <p class="truncate text-xs font-bold text-neutral-900 dark:text-white">{{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}</p>
                        <span v-if="order.isGuest" class="admin-pill border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">Guest</span>
                        <span v-else class="admin-pill border-blue-100 bg-blue-50 text-blue-500 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">Customer</span>
                      </div>
                      <p class="truncate text-[11px] text-neutral-400 dark:text-neutral-500">{{ order.customerDetails?.email }}</p>
                    </div>
                  </td>

                  <td class="whitespace-nowrap px-5 py-4" data-label="Product">
                    <div class="flex max-w-50 items-center gap-2">
                      <span class="truncate text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {{ order.firstItemName || 'No items' }}
                      </span>
                      <span v-if="order.itemCount > 1" class="shrink-0 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                        +{{ order.itemCount - 1 }}
                      </span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4" data-label="Date">
                    <p class="text-xs text-neutral-400 dark:text-neutral-500">{{ formatDate(order.createdAt) }}</p>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 text-right" data-label="Total">
                    <p class="text-sm font-bold text-neutral-900 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
                  </td>
                  <td class="whitespace-nowrap px-5 py-4" data-label="Actions">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click.stop="openDetails(order)"
                        class="admin-icon-btn h-8 w-8"
                        title="View details"
                        aria-label="View order details"
                      >
                        <Eye :size="15" />
                      </button>
                      <button
                        @click.stop="handleDeleteOrder(order.id)"
                        class="admin-icon-btn h-8 w-8 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                        title="Delete order"
                        aria-label="Delete order"
                      >
                        <Trash2 :size="15" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          
          <div v-if="!loading && !filteredOrders.length" class="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-600">
              <PackageSearch :size="22" />
            </div>
            <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">No matching orders</p>
          </div>
          <Pagination :page="page" :total-pages="totalPages" :total-items="totalFilteredOrders" @update:page="goToPage" />
        </div>
      </section>
    </div>

    <!-- Order detail modal -->
    <Transition
      name="modal"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="selectedOrder" class="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm dark:bg-black/60" @click="selectedOrder = null"></div>

        <div class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white dark:bg-neutral-900">
          <!-- Modal header -->
          <div class="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
            <div class="flex min-w-0 flex-wrap items-center gap-1.5">
              <span class="rounded-md bg-neutral-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white dark:bg-white dark:text-neutral-900">
                #{{ selectedOrder.id.slice(0, 12) }}
              </span>
              <span v-if="selectedOrder.isGuest" class="admin-pill border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                Guest
              </span>
              <span v-else class="admin-pill border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                Customer
              </span>
              <span :class="getStatusClass(selectedOrder.status)" class="admin-pill">
                {{ selectedOrder.status }}
              </span>
            </div>
            <button @click="selectedOrder = null" title="Close" aria-label="Close details" class="admin-icon-btn">
              <X :size="18" />
            </button>
          </div>

          <!-- Modal body -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <!-- Left: Customer & Payment -->
              <div class="space-y-6">
                <div>
                  <h3 class="admin-eyebrow mb-3 flex items-center gap-1.5">
                    <User :size="12" /> Customer
                  </h3>
                  <div class="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40 sm:p-5">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
                        <User :size="18" />
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-bold text-neutral-900 dark:text-white">{{ selectedOrder.customerDetails?.firstName }} {{ selectedOrder.customerDetails?.lastName }}</p>
                        <p class="truncate text-xs text-neutral-500 dark:text-neutral-400">{{ selectedOrder.customerDetails?.email }}</p>
                      </div>
                    </div>
                    <div class="space-y-2.5 border-t border-neutral-200/60 pt-4 dark:border-neutral-700">
                      <div class="flex items-center gap-2.5">
                        <Phone :size="14" class="shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{{ selectedOrder.customerDetails?.contactNo || selectedOrder.customerDetails?.contact }}</span>
                      </div>
                      <div class="flex items-start gap-2.5">
                        <MapPin :size="14" class="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <span class="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{{ selectedOrder.customerDetails?.completeAddress }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="admin-eyebrow mb-3 flex items-center gap-1.5">
                    <CreditCard :size="12" /> Payment
                  </h3>
                  <div class="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40 sm:p-5">
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Method</span>
                      <span class="admin-pill border-neutral-200 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                        {{ selectedOrder.paymentMethod }}
                      </span>
                    </div>

                    <!-- GCash Info -->
                    <div v-if="selectedOrder.paymentMethod === 'gcash'" class="space-y-4 border-t border-neutral-200/60 pt-4 dark:border-neutral-700">
                      <div>
                        <p class="admin-eyebrow mb-1">Reference number</p>
                        <p class="text-xs font-bold text-neutral-900 dark:text-white">{{ selectedOrder.referenceNo || 'N/A' }}</p>
                      </div>
                      <div v-if="selectedOrder.receiptUrl" class="space-y-2">
                        <p class="admin-eyebrow">Receipt</p>
                        <div class="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900" @click="viewFullImage(selectedOrder.receiptUrl)">
                          <img :src="selectedOrder.receiptUrl" class="h-full w-full object-cover" />
                          <div class="absolute inset-0 flex items-center justify-center bg-neutral-950/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <Maximize2 :size="18" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Order Items & Actions -->
              <div class="space-y-6">
                <div>
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <h3 class="admin-eyebrow flex items-center gap-1.5">
                      <Package :size="12" /> Items
                    </h3>
                    <span class="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">{{ selectedOrder.items?.length || 0 }} items</span>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="item in selectedOrder.items"
                      :key="item.id"
                      class="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div class="min-w-0">
                        <p class="truncate text-xs font-bold text-neutral-900 dark:text-white">{{ item.productName }}</p>
                        <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                          {{ item.color }} • {{ item.size }}
                        </p>
                      </div>
                      <div class="shrink-0 text-right">
                        <p class="text-xs font-bold text-neutral-900 dark:text-white">x{{ item.quantity }}</p>
                        <p class="text-[11px] text-neutral-500 dark:text-neutral-400">{{ formatCurrency(item.priceAtPurchase) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Total</span>
                    <span class="font-heading text-xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
                  </div>
                </div>

                <div>
                  <h3 class="admin-eyebrow mb-3 flex items-center gap-1.5">
                    <ShieldCheck :size="12" /> Fulfillment
                  </h3>
                  <div class="space-y-3 rounded-lg bg-neutral-900 p-4 text-white dark:bg-white dark:text-neutral-900 sm:p-5">
                    <label class="admin-eyebrow text-neutral-400 dark:text-neutral-500" for="order-status-select">Update status</label>
                    <select
                      id="order-status-select"
                      class="w-full cursor-pointer rounded-lg border-none bg-white/10 px-4 py-2.5 text-xs font-bold text-white outline-none transition focus:ring-2 focus:ring-white/30 dark:bg-black/10 dark:text-neutral-900 dark:focus:ring-black/20"
                      :value="selectedOrder.status"
                      @change="handleUpdateStatus(selectedOrder.id, $event.target.value)"
                    >
                      <option class="text-neutral-900" value="received">Received</option>
                      <option class="text-neutral-900" value="processing">Processing</option>
                      <option class="text-neutral-900" value="shipped">Shipped</option>
                      <option class="text-neutral-900" value="completed">Completed</option>
                    </select>
                    <p class="text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                      Status changes notify the customer on their profile page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full image preview (receipt) -->
    <Transition name="fade">
      <div v-if="previewImage" class="fixed inset-0 z-110 flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-neutral-950/90" @click="previewImage = null"></div>

        <div class="relative flex h-full w-full flex-col items-center justify-center">
          <div class="relative max-h-full max-w-full">
            <button
              @click="previewImage = null"
              title="Close preview"
              aria-label="Close preview"
              class="absolute -top-11 right-0 rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-md transition hover:text-white"
            >
              <X :size="20" />
            </button>

            <div class="flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
              <img
                :src="previewImage"
                class="block max-h-[80vh] max-w-[90vw] object-contain"
                alt="Receipt preview"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  User,
  MapPin,
  Package,
  PackageSearch,
  Search,
  Trash2,
  Calendar,
  X,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  Eye,
  Phone,
  Maximize2
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import AdminPageHead from '../../components/AdminPageHead.vue'
import Pagination from '../../components/Pagination.vue'
import { useOrderStore } from '../../stores/orderStore'
import { formatCurrency, formatDate, getOrderStatusClasses } from '../../utils/format'
import { useSearchFilter } from '../../composables/useSearchFilter'
import { useSelection } from '../../composables/useSelection'
import { usePagination } from '../../composables/usePagination'
import { useConfirmAction } from '../../composables/useConfirmAction'
import { useToast } from '../../composables/useToast'

const {
  orders,
  ordersLoading: loading,
  subscribeOrders,
  unsubscribeOrders,
  countByStatus,
  updateStatus,
  bulkUpdateStatus,
  remove,
  markSeen,
  fetchOrderItems,
} = useOrderStore()

const statusFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const selectedOrder = ref(null)
const previewImage = ref(null)

const { confirmAndRun } = useConfirmAction()
const toast = useToast()

const statusDateFiltered = computed(() => orders.value.filter((order) => {
  const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value

  const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null

  if (start) start.setHours(0, 0, 0, 0)
  if (end) end.setHours(23, 59, 59, 999)

  const matchesStartDate = !start || orderDate >= start
  const matchesEndDate = !end || orderDate <= end

  return matchesStatus && matchesStartDate && matchesEndDate
}))

const { query: searchQuery, filtered: filteredOrders } = useSearchFilter(statusDateFiltered, (order) => [
  order.id,
  `${order.customerDetails?.firstName} ${order.customerDetails?.lastName}`,
  order.customerDetails?.email,
  order.referenceNo,
  order.firstItemName,
])

const { selected: selectedOrders, isAllSelected, toggleAll: toggleSelectAll, clear: clearSelection } = useSelection(filteredOrders)

const { page, totalPages, totalItems: totalFilteredOrders, paged: pagedOrders, goToPage, resetPage } = usePagination(filteredOrders, 20)
watch([searchQuery, statusFilter, startDate, endDate], resetPage)

// Keep an open detail modal in sync with the realtime order list (e.g. status
// changed from another tab), while preserving the already-fetched item lines.
watch(orders, (newOrders) => {
  if (!selectedOrder.value) return
  const updated = newOrders.find((o) => o.id === selectedOrder.value.id)
  if (updated) {
    selectedOrder.value = { ...updated, items: selectedOrder.value.items }
  }
})

const handleBulkUpdate = (status) => {
  const count = selectedOrders.value.length
  if (!count) return

  return confirmAndRun(
    `Are you sure you want to update ${count} orders to ${status}?`,
    async () => {
      await bulkUpdateStatus(selectedOrders.value, status)
      clearSelection()
    },
    { title: 'Bulk Update', successMessage: `${count} orders updated to ${status}`, errorMessage: 'Failed to update orders' },
  )
}

const handleUpdateStatus = async (orderId, status) => {
  try {
    await updateStatus(orderId, status)
    toast.success('Order status updated')
  } catch (error) {
    toast.error('Failed to update status')
  }
}

const handleDeleteOrder = (orderId) =>
  confirmAndRun(
    'This action cannot be undone. Are you sure you want to delete this order?',
    async () => {
      await remove(orderId)
      if (selectedOrder.value?.id === orderId) selectedOrder.value = null
    },
    { title: 'Delete Order', successMessage: 'Order deleted successfully', errorMessage: 'Failed to delete order' },
  )

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  startDate.value = ''
  endDate.value = ''
}

const openDetails = async (order) => {
  // Set basic info first for immediate UI feedback
  selectedOrder.value = { ...order, items: [] }

  try {
    // Fetch full items only when needed
    const items = await fetchOrderItems(order.id)
    selectedOrder.value = { ...order, items }

    if (!order.seenByAdmin) {
      await markSeen(order.id)
    }
  } catch (error) {
    console.error('Failed to load order details:', error)
    toast.error('Could not load order items')
  }
}

const viewFullImage = (url) => {
  previewImage.value = url
}

const getStatusClass = getOrderStatusClasses

const summaries = computed(() => [
  { label: 'Total Volume', value: orders.value.length },
  { label: 'Pending', value: countByStatus('received') },
  { label: 'Processing', value: countByStatus('processing') },
  { label: 'Unread', value: orders.value.filter(o => !o.seenByAdmin).length },
])

onMounted(subscribeOrders)
onUnmounted(unsubscribeOrders)
</script>

<style scoped>
/* Table-to-card responsive rules live in style.css (.admin-card-table). */
.modal-enter-from { opacity: 0; transform: scale(0.96); }
.modal-enter-to { opacity: 1; transform: scale(1); }
.fade-enter-from { opacity: 0; }
.fade-enter-to { opacity: 1; }
</style>

