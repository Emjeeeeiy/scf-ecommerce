<template>
  <AdminPanelLayout subtitle="Manage and track customer order fulfillment">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Section: Stats & Filters -->
      <section class="space-y-6">
        <!-- Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="summary in summaries" 
            :key="summary.label"
            class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ summary.label }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900">{{ summary.value }}</span>
              <span class="text-[10px] font-medium text-slate-400">orders</span>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by ID, name, email, or reference..." 
              class="w-full pl-12 pr-10 py-3 rounded-xl border-none bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
            >
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X :size="16" />
            </button>
          </div>

          <div class="flex items-center gap-3 w-full lg:w-auto">
            <div class="flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-slate-200 transition-all flex-1 lg:flex-none">
              <Calendar :size="14" class="text-slate-400 mr-2" />
              <input 
                v-model="startDate"
                type="date" 
                class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 focus:ring-0"
              >
              <span class="mx-2 text-slate-300">—</span>
              <input 
                v-model="endDate"
                type="date" 
                class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 focus:ring-0"
              >
            </div>
            
            <button 
              v-if="startDate || endDate || searchQuery"
              @click="resetFilters"
              class="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
              title="Reset Filters"
            >
              <RotateCcw :size="18" />
            </button>
          </div>
        </div>
      </section>

      <!-- Orders List (Compact Table View) -->
      <section class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Order ID</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Customer</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Product</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Date</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-right">Total</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                @click="openDetails(order)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                    #{{ order.id.slice(0, 8) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="max-w-50">
                    <div class="flex items-center gap-2 mb-0.5">
                      <p class="text-xs font-bold text-slate-900 truncate">{{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}</p>
                      <span v-if="order.isGuest" class="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">Guest</span>
                      <span v-else class="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100">Customer</span>
                    </div>
                    <p class="text-[10px] font-medium text-slate-400 truncate">{{ order.customerDetails?.email }}</p>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 max-w-50">
                    <span class="text-xs font-bold text-slate-700 truncate">
                      {{ order.items?.[0]?.productName || 'No Items' }}
                    </span>
                    <span v-if="order.items?.length > 1" class="px-1.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-black text-slate-400 shrink-0">
                      +{{ order.items.length - 1 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-xs font-semibold text-slate-400">{{ formatDate(order.createdAt, true) }}</p>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <p class="text-sm font-black text-slate-900">{{ formatCurrency(order.totalAmount) }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      @click.stop="openDetails(order)"
                      class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye :size="16" />
                    </button>
                    <button 
                      @click.stop="handleDeleteOrder(order.id)"
                      class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Order"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!filteredOrders.length" class="flex flex-col items-center justify-center py-20 text-center px-6">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-3">
              <PackageSearch :size="24" />
            </div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching orders found</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Order Detail Modal -->
    <Transition 
      name="modal"
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-95"
    >
      <div v-if="selectedOrder" class="fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-md">
        <div class="absolute inset-0 bg-slate-900/40" @click="selectedOrder = null"></div>
        
        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 shrink-0">
            <div class="flex items-center gap-4">
              <div class="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                #{{ selectedOrder.id.slice(0, 12) }}
              </div>
              <span v-if="selectedOrder.isGuest" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-200">
                Guest Order
              </span>
              <span v-else class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-blue-50 text-blue-600 border-blue-100">
                Registered Customer
              </span>
              <span :class="getStatusClass(selectedOrder.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                {{ selectedOrder.status }}
              </span>
            </div>
            <button @click="selectedOrder = null" class="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <X :size="20" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 overflow-y-auto scrollbar-hide flex-1">
            <div class="grid lg:grid-cols-2 gap-10">
              <!-- Left: Customer & Payment -->
              <div class="space-y-8">
                <div>
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User :size="12" /> Customer Information
                  </h3>
                  <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                        <User :size="24" />
                      </div>
                      <div>
                        <p class="text-base font-bold text-slate-900">{{ selectedOrder.customerDetails?.firstName }} {{ selectedOrder.customerDetails?.lastName }}</p>
                        <p class="text-xs font-medium text-slate-500">{{ selectedOrder.customerDetails?.email }}</p>
                      </div>
                    </div>
                    <div class="pt-4 border-t border-slate-200/50 space-y-3">
                      <div class="flex items-center gap-3">
                        <Phone :size="14" class="text-slate-400" />
                        <span class="text-xs font-bold text-slate-700">{{ selectedOrder.customerDetails?.contactNo || selectedOrder.customerDetails?.contact }}</span>
                      </div>
                      <div class="flex items-start gap-3">
                        <MapPin :size="14" class="text-slate-400 mt-0.5" />
                        <span class="text-xs font-medium text-slate-600 leading-relaxed">{{ selectedOrder.customerDetails?.completeAddress }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard :size="12" /> Payment Details
                  </h3>
                  <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-500">Method</span>
                      <span class="px-3 py-1 rounded-xl bg-amber-100 text-amber-700 text-[10px] font-black uppercase border border-amber-200">
                        {{ selectedOrder.paymentMethod }}
                      </span>
                    </div>
                    
                    <!-- GCash Info -->
                    <div v-if="selectedOrder.paymentMethod === 'gcash'" class="pt-4 border-t border-slate-200/50 space-y-4">
                      <div>
                        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference Number</p>
                        <p class="text-xs font-black text-slate-900">{{ selectedOrder.referenceNo || 'N/A' }}</p>
                      </div>
                      <div v-if="selectedOrder.receiptUrl" class="space-y-2">
                        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Receipt Screenshot</p>
                        <div class="relative group aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white cursor-pointer" @click="viewFullImage(selectedOrder.receiptUrl)">
                          <img :src="selectedOrder.receiptUrl" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                            <Maximize2 :size="20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Order Items & Actions -->
              <div class="space-y-8">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Package :size="12" /> Order Manifest
                    </h3>
                    <span class="text-[10px] font-bold text-slate-400">{{ selectedOrder.items?.length || 0 }} items</span>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="item in selectedOrder.items" 
                      :key="item.id" 
                      class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div class="min-w-0 pr-4">
                        <p class="text-xs font-bold text-slate-900">{{ item.productName }}</p>
                        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">
                          {{ item.color }} • {{ item.size }}
                        </p>
                      </div>
                      <div class="text-right shrink-0">
                        <p class="text-xs font-black text-slate-900">x{{ item.quantity }}</p>
                        <p class="text-[10px] font-medium text-slate-500">{{ formatCurrency(item.priceAtPurchase) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between px-2">
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Grand Total</span>
                    <span class="text-xl font-black text-slate-900 tracking-tighter">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
                  </div>
                </div>

                <div>
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck :size="12" /> Fulfillment Action
                  </h3>
                  <div class="bg-slate-900 p-6 rounded-3xl text-white space-y-4">
                    <div>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Update Order Status</p>
                      <select
                        class="w-full rounded-xl bg-white/10 border-none px-4 py-3 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
                        :value="selectedOrder.status"
                        @change="handleUpdateStatus(selectedOrder.id, $event.target.value)"
                      >
                        <option class="text-slate-900" value="received">Received</option>
                        <option class="text-slate-900" value="processing">Processing</option>
                        <option class="text-slate-900" value="shipped">Shipped</option>
                        <option class="text-slate-900" value="completed">Completed</option>
                      </select>
                    </div>
                    <p class="text-[8px] font-medium text-slate-400 leading-relaxed italic">
                      * Updating status will immediately notify the customer via their profile page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full Image Preview (for Receipt) - FIXED SCALING -->
    <Transition name="fade">
      <div v-if="previewImage" class="fixed inset-0 z-110 flex items-center justify-center p-6 backdrop-blur-2xl">
        <!-- Backdrop Backdrop -->
        <div class="absolute inset-0 bg-slate-950/90" @click="previewImage = null"></div>
        
        <!-- Image Container -->
        <div class="relative w-full h-full flex flex-col items-center justify-center">
          <div class="relative group max-w-full max-h-full">
            <!-- Close Button (Always visible on top) -->
            <button 
              @click="previewImage = null" 
              class="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full backdrop-blur-md"
            >
              <X :size="24" />
            </button>
            
            <!-- The Image itself -->
            <div class="overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 bg-slate-900 flex items-center justify-center">
              <img 
                :src="previewImage" 
                class="max-w-[90vw] max-h-[80vh] object-contain block" 
                alt="Receipt Full Preview"
              />
            </div>
            
            <p class="mt-4 text-center text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
              Tap outside to close
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
import { listAllOrders, updateOrderStatus, deleteOrder } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'

const orders = ref([])
const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')
const selectedOrder = ref(null)
const previewImage = ref(null)

const { confirm } = useConfirm()
const toast = useToast()

const loadOrders = async () => {
  try {
    orders.value = await listAllOrders()
  } catch (error) {
    toast.error('Failed to load orders')
    console.error(error)
  }
}

const handleUpdateStatus = async (orderId, status) => {
  try {
    await updateOrderStatus(orderId, status)
    toast.success('Order status updated')
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      selectedOrder.value.status = status
    }
    await loadOrders()
  } catch (error) {
    toast.error('Failed to update status')
  }
}

const handleDeleteOrder = async (orderId) => {
  const confirmed = await confirm('This action cannot be undone. Are you sure you want to delete this order?', 'Delete Order')
  if (!confirmed) return

  try {
    await deleteOrder(orderId)
    toast.success('Order deleted successfully')
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      selectedOrder.value = null
    }
    await loadOrders()
  } catch (error) {
    toast.error('Failed to delete order')
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  startDate.value = ''
  endDate.value = ''
}

const openDetails = (order) => {
  selectedOrder.value = order
}

const viewFullImage = (url) => {
  previewImage.value = url
}

const getStatusClass = (status) => {
  switch (status) {
    case 'received': return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    default: return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

const formatDate = (timestamp, compact = false) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  if (compact) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = !searchQuery.value || 
      order.id.toLowerCase().includes(searchLower) ||
      `${order.customerDetails?.firstName} ${order.customerDetails?.lastName}`.toLowerCase().includes(searchLower) ||
      order.customerDetails?.email?.toLowerCase().includes(searchLower) ||
      order.referenceNo?.toLowerCase().includes(searchLower)

    const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
    const start = startDate.value ? new Date(startDate.value) : null
    const end = endDate.value ? new Date(endDate.value) : null
    
    if (start) start.setHours(0, 0, 0, 0)
    if (end) end.setHours(23, 59, 59, 999)

    const matchesStartDate = !start || orderDate >= start
    const matchesEndDate = !end || orderDate <= end

    return matchesSearch && matchesStartDate && matchesEndDate
  })
})

const countByStatus = (status) => orders.value.filter((order) => order.status === status).length

const summaries = computed(() => [
  { label: 'Received', value: countByStatus('received') },
  { label: 'Processing', value: countByStatus('processing') },
  { label: 'Shipped', value: countByStatus('shipped') },
  { label: 'Completed', value: countByStatus('completed') },
])

onMounted(loadOrders)
</script>

<style scoped>
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-enter-to { opacity: 1; transform: scale(1) translateY(0); }
.fade-enter-from { opacity: 0; }
.fade-enter-to { opacity: 1; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
