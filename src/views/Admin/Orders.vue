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
            class="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md"
          >
            <p class="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1">{{ summary.label }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ summary.value }}</span>
              <span class="text-[10px] font-medium text-slate-400 dark:text-neutral-500">orders</span>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="space-y-4">
          <div class="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row items-center gap-4">
            <div class="relative flex-1 w-full">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" :size="18" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search by ID, name, email, or reference..." 
                class="w-full pl-12 pr-10 py-3 rounded-xl border-none bg-slate-50 dark:bg-neutral-800/50 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-amber-400/20 transition-all"
              >
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
              >
                <X :size="16" />
              </button>
            </div>

            <div class="flex items-center gap-3 w-full lg:w-auto">
              <div class="flex items-center bg-slate-50 dark:bg-neutral-800/50 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-slate-200 dark:focus-within:border-neutral-700 transition-all flex-1 lg:flex-none">
                <Calendar :size="14" class="text-slate-400 dark:text-neutral-500 mr-2" />
                <input 
                  v-model="startDate"
                  type="date" 
                  class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-neutral-300 focus:ring-0"
                >
                <span class="mx-2 text-slate-300 dark:text-neutral-700">—</span>
                <input 
                  v-model="endDate"
                  type="date" 
                  class="bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-neutral-300 focus:ring-0"
                >
              </div>
              
              <button 
                v-if="startDate || endDate || searchQuery || statusFilter !== 'all'"
                @click="resetFilters"
                class="p-3 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700 hover:text-slate-700 dark:hover:text-neutral-200 transition-all"
                title="Reset Filters"
              >
                <RotateCcw :size="18" />
              </button>
            </div>
          </div>

          <!-- Status Quick Filters & Bulk Actions -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="status in ['all', 'received', 'processing', 'shipped', 'completed']" 
                :key="status"
                @click="statusFilter = status"
                class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                :class="statusFilter === status 
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-neutral-950 border-slate-900 dark:border-amber-400 shadow-md' 
                  : 'bg-white dark:bg-neutral-900 text-slate-400 dark:text-neutral-500 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700'"
              >
                {{ status }}
                <span 
                  class="ml-2 px-1.5 py-0.5 rounded-md text-[8px]"
                  :class="statusFilter === status ? 'bg-white/20 dark:bg-black/10' : 'bg-slate-100 dark:bg-neutral-800'"
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
              <div v-if="selectedOrders.length" class="flex items-center gap-2 bg-slate-900 dark:bg-amber-400 p-1.5 pl-4 rounded-2xl shadow-lg border border-slate-800 dark:border-amber-500">
                <span class="text-[10px] font-black uppercase tracking-wider text-white dark:text-neutral-950 mr-2">
                  {{ selectedOrders.length }} Selected
                </span>
                <div class="h-6 w-px bg-white/10 dark:bg-neutral-950/10 mx-1"></div>
                <div class="flex items-center gap-1">
                  <button 
                    v-for="status in ['received', 'processing', 'shipped', 'completed']"
                    :key="status"
                    @click="handleBulkUpdate(status)"
                    class="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-white/10 dark:hover:bg-black/10 text-white dark:text-neutral-950"
                  >
                    {{ status }}
                  </button>
                </div>
                <button 
                  @click="selectedOrders = []"
                  class="p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 text-white dark:text-neutral-950 ml-1"
                >
                  <X :size="14" />
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- Orders List (Compact Table View) -->
      <section class="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div class="admin-card-table-wrap overflow-x-auto">
          <table class="admin-card-table w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800">
                <th class="pl-6 py-4 w-10">
                  <div class="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="h-4 w-4 rounded border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-amber-400 focus:ring-amber-400/20 dark:bg-neutral-800"
                    >
                  </div>
                </th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap">Order ID</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap">Status</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap">Customer</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap">Product</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap">Date</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap text-right">Total</th>
                <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-neutral-800">
              <tr v-if="loading">
                <td colspan="8" class="py-20 text-center">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400 dark:border-neutral-800 dark:border-t-amber-400"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">Retrieving order data...</p>
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr
                  v-for="order in pagedOrders"
                  :key="order.id"
                  class="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer group"
                  :class="selectedOrders.includes(order.id) ? 'bg-slate-50/80 dark:bg-neutral-800/50' : ''"
                  @click="openDetails(order)"
                >
                  <td class="pl-6 py-4" data-label="Select" @click.stop>
                    <div class="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        :value="order.id"
                        v-model="selectedOrders"
                        class="h-4 w-4 rounded border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-amber-400 focus:ring-amber-400/20 dark:bg-neutral-800"
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap" data-label="Order ID">
                    <div class="flex items-center gap-2">
                      <span 
                        v-if="!order.seenByAdmin" 
                        class="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        title="New Order"
                      ></span>
                      <span class="bg-slate-900 dark:bg-amber-400 text-white dark:text-neutral-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                        #{{ order.id.slice(0, 8) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap" data-label="Status">
                    <span 
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                      :class="getStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap" data-label="Customer">
                    <div class="max-w-50">
                      <div class="flex items-center gap-2 mb-0.5">
                        <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ order.customerDetails?.firstName }} {{ order.customerDetails?.lastName }}</p>
                        <span v-if="order.isGuest" class="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500 border border-slate-200 dark:border-neutral-700">Guest</span>
                        <span v-else class="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">Customer</span>
                      </div>
                      <p class="text-[10px] font-medium text-slate-400 dark:text-neutral-500 truncate">{{ order.customerDetails?.email }}</p>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap" data-label="Product">
                    <div class="flex items-center gap-2 max-w-50">
                      <span class="text-xs font-bold text-slate-700 dark:text-neutral-300 truncate">
                        {{ order.firstItemName || 'No Items' }}
                      </span>
                      <span v-if="order.itemCount > 1" class="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[8px] font-black text-slate-400 dark:text-neutral-500 shrink-0">
                        +{{ order.itemCount - 1 }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap" data-label="Date">
                    <p class="text-xs font-semibold text-slate-400 dark:text-neutral-500">{{ formatDate(order.createdAt) }}</p>
                  </td>
                  <td class="px-6 py-4 text-right whitespace-nowrap" data-label="Total">
                    <p class="text-sm font-black text-slate-900 dark:text-white">{{ formatCurrency(order.totalAmount) }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap" data-label="Action">
                    <div class="flex items-center justify-center gap-2">
                      <button 
                        @click.stop="openDetails(order)"
                        class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye :size="16" />
                      </button>
                      <button 
                        @click.stop="handleDeleteOrder(order.id)"
                        class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete Order"
                      >
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          
          <div v-if="!loading && !filteredOrders.length" class="flex flex-col items-center justify-center py-20 text-center px-6">
            <div class="w-12 h-12 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-slate-200 dark:text-neutral-700 mb-3">
              <PackageSearch :size="24" />
            </div>
            <p class="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">No matching orders found</p>
          </div>
          <Pagination :page="page" :total-pages="totalPages" :total-items="totalFilteredOrders" @update:page="goToPage" />
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
        <div class="absolute inset-0 bg-slate-900/40 dark:bg-black/60" @click="selectedOrder = null"></div>
        
        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-2xl flex flex-col">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between bg-slate-50/30 dark:bg-neutral-800/30 shrink-0">
            <div class="flex items-center gap-4">
              <div class="bg-slate-900 dark:bg-amber-400 text-white dark:text-neutral-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                #{{ selectedOrder.id.slice(0, 12) }}
              </div>
              <span v-if="selectedOrder.isGuest" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-slate-50 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700">
                Guest Order
              </span>
              <span v-else class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20">
                Registered Customer
              </span>
              <span :class="getStatusClass(selectedOrder.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                {{ selectedOrder.status }}
              </span>
            </div>
            <button @click="selectedOrder = null" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X :size="20" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 overflow-y-auto scrollbar-hide flex-1">
            <div class="grid lg:grid-cols-2 gap-10">
              <!-- Left: Customer & Payment -->
              <div class="space-y-8">
                <div>
                  <h3 class="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User :size="12" /> Customer Information
                  </h3>
                  <div class="bg-slate-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-slate-100 dark:border-neutral-800 space-y-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center text-slate-400 dark:text-neutral-600 border border-slate-100 dark:border-neutral-800">
                        <User :size="24" />
                      </div>
                      <div>
                        <p class="text-base font-bold text-slate-900 dark:text-white">{{ selectedOrder.customerDetails?.firstName }} {{ selectedOrder.customerDetails?.lastName }}</p>
                        <p class="text-xs font-medium text-slate-500 dark:text-neutral-400">{{ selectedOrder.customerDetails?.email }}</p>
                      </div>
                    </div>
                    <div class="pt-4 border-t border-slate-200/50 dark:border-neutral-700 space-y-3">
                      <div class="flex items-center gap-3">
                        <Phone :size="14" class="text-slate-400 dark:text-neutral-500" />
                        <span class="text-xs font-bold text-slate-700 dark:text-neutral-300">{{ selectedOrder.customerDetails?.contactNo || selectedOrder.customerDetails?.contact }}</span>
                      </div>
                      <div class="flex items-start gap-3">
                        <MapPin :size="14" class="text-slate-400 dark:text-neutral-500 mt-0.5" />
                        <span class="text-xs font-medium text-slate-600 dark:text-neutral-400 leading-relaxed">{{ selectedOrder.customerDetails?.completeAddress }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard :size="12" /> Payment Details
                  </h3>
                  <div class="bg-slate-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-slate-100 dark:border-neutral-800 space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-500 dark:text-neutral-400">Method</span>
                      <span class="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase border border-amber-200 dark:border-amber-500/20">
                        {{ selectedOrder.paymentMethod }}
                      </span>
                    </div>
                    
                    <!-- GCash Info -->
                    <div v-if="selectedOrder.paymentMethod === 'gcash'" class="pt-4 border-t border-slate-200/50 dark:border-neutral-700 space-y-4">
                      <div>
                        <p class="text-[8px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Reference Number</p>
                        <p class="text-xs font-black text-slate-900 dark:text-white">{{ selectedOrder.referenceNo || 'N/A' }}</p>
                      </div>
                      <div v-if="selectedOrder.receiptUrl" class="space-y-2">
                        <p class="text-[8px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Receipt Screenshot</p>
                        <div class="relative group aspect-video rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-800 shadow-md bg-white dark:bg-neutral-900 cursor-pointer" @click="viewFullImage(selectedOrder.receiptUrl)">
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
                    <h3 class="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <Package :size="12" /> Order Manifest
                    </h3>
                    <span class="text-[10px] font-bold text-slate-400 dark:text-neutral-500">{{ selectedOrder.items?.length || 0 }} items</span>
                  </div>
                  <div class="space-y-3">
                    <div 
                      v-for="item in selectedOrder.items" 
                      :key="item.id" 
                      class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800"
                    >
                      <div class="min-w-0 pr-4">
                        <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item.productName }}</p>
                        <p class="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-tight mt-0.5">
                          {{ item.color }} • {{ item.size }}
                        </p>
                      </div>
                      <div class="text-right shrink-0">
                        <p class="text-xs font-black text-slate-900 dark:text-white">x{{ item.quantity }}</p>
                        <p class="text-[10px] font-medium text-slate-500 dark:text-neutral-400">{{ formatCurrency(item.priceAtPurchase) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 pt-6 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between px-2">
                    <span class="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Grand Total</span>
                    <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{{ formatCurrency(selectedOrder.totalAmount) }}</span>
                  </div>
                </div>

                <div>
                  <h3 class="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck :size="12" /> Fulfillment Action
                  </h3>
                  <div class="bg-slate-900 dark:bg-amber-400 p-6 rounded-3xl text-white dark:text-neutral-950 space-y-4">
                    <div>
                      <p class="text-[9px] font-bold text-slate-400 dark:text-neutral-700 uppercase tracking-widest mb-2">Update Order Status</p>
                      <select
                        class="w-full rounded-xl bg-white/10 dark:bg-black/10 border-none px-4 py-3 text-xs font-bold text-white dark:text-neutral-950 focus:ring-2 focus:ring-amber-400 dark:focus:ring-neutral-950 transition-all cursor-pointer"
                        :value="selectedOrder.status"
                        @change="handleUpdateStatus(selectedOrder.id, $event.target.value)"
                      >
                        <option class="text-slate-900" value="received">Received</option>
                        <option class="text-slate-900" value="processing">Processing</option>
                        <option class="text-slate-900" value="shipped">Shipped</option>
                        <option class="text-slate-900" value="completed">Completed</option>
                      </select>
                    </div>
                    <p class="text-[8px] font-medium text-slate-400 dark:text-neutral-700 leading-relaxed italic">
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
  Maximize2,
  Bell
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
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
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-enter-to { opacity: 1; transform: scale(1) translateY(0); }
.fade-enter-from { opacity: 0; }
.fade-enter-to { opacity: 1; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@media (max-width: 767px) {
  .admin-card-table-wrap {
    overflow-x: visible;
  }

  .admin-card-table,
  .admin-card-table thead,
  .admin-card-table tbody,
  .admin-card-table tr,
  .admin-card-table td {
    display: block;
    width: 100%;
  }

  .admin-card-table thead {
    display: none;
  }

  .admin-card-table tbody {
    display: grid;
    gap: 12px;
    padding: 12px;
  }

  .admin-card-table tbody tr {
    border: 1px solid rgb(226 232 240);
    border-radius: 18px;
    background: white;
    box-shadow: 0 10px 24px rgb(15 23 42 / 0.06);
    overflow: hidden;
  }

  .dark .admin-card-table tbody tr {
    border-color: rgb(38 38 38);
    background: rgb(23 23 23);
    box-shadow: none;
  }

  .admin-card-table tbody tr > td:not([colspan]) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    text-align: right;
    white-space: normal;
    border-bottom: 1px solid rgb(241 245 249);
  }

  .dark .admin-card-table tbody tr > td:not([colspan]) {
    border-bottom-color: rgb(38 38 38 / 0.75);
  }

  .admin-card-table tbody tr > td:not([colspan])::before {
    content: attr(data-label);
    flex: 0 0 auto;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgb(148 163 184);
  }

  .admin-card-table tbody tr > td:nth-child(2),
  .admin-card-table tbody tr > td:nth-child(4),
  .admin-card-table tbody tr > td:nth-child(5) {
    align-items: flex-start;
  }

  .admin-card-table tbody tr > td:last-child {
    border-bottom: 0;
  }
}
</style>

