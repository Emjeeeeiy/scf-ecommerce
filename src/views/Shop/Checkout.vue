<template>
  <AppShell subtitle="Finalize your order">
    <!-- Delivery Area Notice -->
    <div
      v-if="showExclusiveNotice"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-md"
    >
      <div class="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800">
        <div class="bg-amber-400 p-6 text-neutral-900">
           <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-4 shadow-inner">
             <MapPin :size="20" />
           </div>
           <h2 class="text-xl font-bold tracking-tight">Delivery Area Notice</h2>
           <p class="mt-1 text-[10px] font-bold opacity-60 uppercase tracking-wider">Service Advisory</p>
        </div>
        <div class="p-6">
          <p class="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            We currently only support orders within <span class="font-bold text-neutral-900 dark:text-white">Oriental Mindoro</span>. Please ensure your delivery address is within this region.
          </p>
          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-sm dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
            @click="dismissExclusiveNotice"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <section class="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
      <!-- Customer Details Form -->
      <div v-if="!isAuthenticated" class="rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col h-fit dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex items-center gap-3 border-b border-neutral-100 p-6 sm:px-8 dark:border-neutral-800">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
            <User :size="16" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Step 1 of 2</p>
            <h1 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Customer Details</h1>
          </div>
        </div>

        <form class="p-6 sm:p-8 grid gap-5 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <User :size="10" stroke-width="1.5" />
              <span>First Name</span>
            </label>
            <input
              v-model="form.firstName"
              placeholder="John"
              class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-800"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <User :size="10" stroke-width="1.5" />
              <span>Last Name</span>
            </label>
            <input
              v-model="form.lastName"
              placeholder="Doe"
              class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-800"
              required
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <Mail :size="10" stroke-width="1.5" />
              <span>Email Address</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-800"
              required
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <Phone :size="10" stroke-width="1.5" />
              <span>Contact Number</span>
            </label>
            <input
              v-model="form.contactNo"
              placeholder="0912 345 6789"
              class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-800"
              required
            />
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <MapPin :size="10" stroke-width="1.5" />
              <span>Address</span>
            </label>
            <textarea
              v-model="form.addressLine"
              rows="2"
              placeholder="Street, Barangay, Municipality"
              class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:border-neutral-600 dark:focus:ring-neutral-800"
              required
            ></textarea>
          </div>
          <div class="space-y-1.5 md:col-span-2">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <Globe :size="10" stroke-width="1.5" />
              <span>Province</span>
            </label>
            <div class="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-5 py-3 shadow-inner dark:border-neutral-700 dark:bg-neutral-800">
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider dark:text-neutral-500">Oriental Mindoro</span>
              <Lock :size="12" class="text-neutral-300 dark:text-neutral-600" />
            </div>
          </div>

          <!-- Payment Method -->
          <div class="md:col-span-2 mt-4 space-y-3">
            <label class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <CreditCard :size="10" stroke-width="1.5" />
              <span>Payment Method</span>
            </label>
            <div class="grid gap-3 sm:grid-cols-3">
              <label
                v-for="method in ['cod', 'gcash', 'bank']"
                :key="method"
                class="relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition-all duration-200"
                :class="form.paymentMethod === method
                  ? 'border-neutral-900 bg-neutral-950 text-white shadow-sm dark:border-amber-400 dark:bg-neutral-950 dark:text-white dark:ring-1 dark:ring-amber-400/30'
                  : 'border-neutral-100 bg-neutral-50/50 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-800'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <div class="flex items-center justify-between">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg shadow-inner" :class="form.paymentMethod === method ? 'bg-white/10' : 'bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-700'">
                    <HandCoins v-if="method === 'cod'" :size="16" />
                    <Wallet v-if="method === 'gcash'" :size="16" />
                    <Landmark v-if="method === 'bank'" :size="16" />
                  </div>
                  <div v-if="form.paymentMethod === method" class="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-neutral-950">
                    <Check :size="10" stroke-width="3" />
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider">{{ method === 'cod' ? 'COD' : method.toUpperCase() }}</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Logged In Order Summary -->
      <div v-else class="rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col h-fit dark:border-neutral-800 dark:bg-neutral-900">
        <div class="flex items-center gap-3 border-b border-neutral-100 p-6 sm:px-8 dark:border-neutral-800">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
            <CreditCard :size="16" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Step 2 of 2</p>
            <h1 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Payment Details</h1>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="mb-8 rounded-xl bg-neutral-50/50 p-6 border border-neutral-100 dark:bg-neutral-800/50 dark:border-neutral-800">
            <div class="flex items-center justify-between mb-6">
               <h3 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Shipping Information</h3>
               <router-link to="/account/profile" class="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Edit Profile</router-link>
            </div>
            <div class="grid gap-6 sm:grid-cols-2">
              <div>
                <p class="text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1 dark:text-neutral-500">Recipient Name</p>
                <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ profile.firstName }} {{ profile.lastName }}</p>
              </div>
              <div>
                <p class="text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1 dark:text-neutral-500">Contact No.</p>
                <p class="text-sm font-semibold text-neutral-900 dark:text-white">{{ profile.contact }}</p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-1 dark:text-neutral-500">Delivery Address</p>
                <p class="text-sm font-semibold text-neutral-900 leading-relaxed dark:text-white">{{ profile.address }}</p>
                <p class="mt-1 text-[10px] font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">Oriental Mindoro</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <label class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Select Payment Method
            </label>
            <div class="grid gap-3 sm:grid-cols-3">
              <label
                v-for="method in ['cod', 'gcash', 'bank']"
                :key="method"
                class="relative flex cursor-pointer flex-col gap-4 rounded-xl border-2 p-5 transition-all duration-200"
                :class="form.paymentMethod === method
                  ? 'border-neutral-900 bg-neutral-950 text-white shadow-md dark:border-amber-400 dark:bg-neutral-950 dark:text-white dark:ring-1 dark:ring-amber-400/30'
                  : 'border-neutral-100 bg-neutral-50/50 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-800'"
              >
                <input v-model="form.paymentMethod" type="radio" :value="method" class="sr-only" />
                <div class="flex items-center justify-between">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl shadow-inner" :class="form.paymentMethod === method ? 'bg-white/10' : 'bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-700'">
                    <HandCoins v-if="method === 'cod'" :size="20" />
                    <Wallet v-if="method === 'gcash'" :size="20" />
                    <Landmark v-if="method === 'bank'" :size="20" />
                  </div>
                  <div v-if="form.paymentMethod === method" class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-neutral-950 shadow-sm">
                    <Check :size="12" stroke-width="3" />
                  </div>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold uppercase tracking-wider">{{ method === 'cod' ? 'COD' : method.toUpperCase() }}</span>
                  <span class="mt-0.5 text-[9px] font-medium opacity-60">
                    {{ method === 'cod' ? 'Cash on Delivery' : method === 'gcash' ? 'E-Wallet' : 'Bank Transfer' }}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Review Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 h-fit">
        <div class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
          <div class="flex items-center gap-2.5 mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <Eye :size="14" class="text-neutral-400 dark:text-neutral-500" />
            <h2 class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Review Selection</h2>
          </div>

          <div class="max-h-[40vh] overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            <div
              v-for="item in cartItems"
              :key="item.cartKey || item.id"
              class="group flex items-center justify-between gap-4 rounded-xl border border-neutral-50 bg-neutral-50/30 p-3 transition-colors hover:border-neutral-100 hover:bg-white dark:border-neutral-800/50 dark:bg-neutral-800/20 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/40"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <img
                    v-if="item.base64Image"
                    :src="item.base64Image"
                    :alt="item.productName"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div v-else class="flex h-full items-center justify-center text-[8px] text-neutral-300 font-bold uppercase dark:text-neutral-600">
                    N/A
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="truncate text-xs font-bold text-neutral-900 tracking-tight dark:text-white">{{ item.productName }}</p>
                  <p class="mt-0.5 text-[9px] font-semibold text-neutral-400 uppercase tracking-wider dark:text-neutral-500">
                    {{ item.color || 'Standard' }} <span class="mx-1">·</span> x{{ item.quantity }}
                  </p>
                </div>
              </div>
              <span class="text-xs font-bold text-neutral-900 tracking-tight dark:text-white">{{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="mt-8 space-y-3.5 border-t border-neutral-100 pt-6 dark:border-neutral-800">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-neutral-500 dark:text-neutral-400">Order Subtotal</span>
              <span class="font-bold text-neutral-900 dark:text-white">{{ formatCurrency(cartTotalAmount) }}</span>
            </div>

            <div class="mt-5 border-t border-neutral-100 pt-5 flex items-end justify-between dark:border-neutral-800">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Total Payable</p>
                <p class="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {{ formatCurrency(cartTotalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            :disabled="isProcessing"
            class="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
            @click="handleCheckout"
          >
            <span v-if="!isProcessing">Place Order</span>
            <span v-else>Processing...</span>
            <CheckCircle v-if="!isProcessing" :size="16" />
            <Loader2 v-else :size="16" class="animate-spin" />
          </button>

          <div v-if="message" class="mt-4 flex items-start gap-2 rounded-lg p-3 text-[10px] font-bold uppercase tracking-wider" :class="message.includes('success') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'">
             <InfoIcon :size="12" class="shrink-0 mt-0.5" />
             <p>{{ message }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/50">
           <div class="items-start gap-3 flex">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-400 border border-neutral-100 shadow-sm dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-700">
                <ShieldCheck :size="14" />
              </div>
              <p class="text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                Your order will be verified manually by our team. <span class="text-neutral-900 font-bold dark:text-white">100% of proceeds</span> go to missions.
              </p>
           </div>
        </div>
      </aside>
    </section>

    <!-- GCash Payment Modal -->
    <Transition name="fade">
      <div v-if="showGcashModal" class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-neutral-900/60 transition-opacity" 
          @click="!isProcessing && (showGcashModal = false)"
        ></div>
        
        <!-- Modal Container -->
        <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-neutral-100 p-5 sm:p-6 bg-white shrink-0 dark:border-neutral-800 dark:bg-neutral-900">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                <Wallet :size="20" />
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-neutral-900 truncate dark:text-white">GCash Payment</h3>
                <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate dark:text-neutral-500">Settle your balance</p>
              </div>
            </div>
            <button
              v-if="!isProcessing"
              @click="showGcashModal = false"
              class="rounded-full p-2 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shrink-0 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="overflow-y-auto p-5 sm:p-6 custom-scrollbar">

            <!-- Step 1: Pay -->
            <div class="mb-8 flex flex-col items-center">
              <div class="mb-5 inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                Step 1: Scan or Copy Info
              </div>

              <!-- QR Code Section -->
              <div class="relative mb-6 flex h-44 w-44 items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 p-2 shadow-inner dark:bg-neutral-800 dark:border-neutral-700">
                <img
                  v-if="paymentSettings.gcash.qrCodeBase64"
                  :src="paymentSettings.gcash.qrCodeBase64"
                  alt="GCash QR Code"
                  class="h-full w-full object-contain rounded-lg"
                />
                <div v-else class="text-center text-neutral-300 dark:text-neutral-600">
                  <QrCode :size="32" class="mx-auto mb-2" />
                  <p class="text-[10px] uppercase font-bold tracking-widest">No QR Code</p>
                </div>
              </div>

              <!-- Account Details -->
              <div class="w-full space-y-3">
                <div class="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 p-4 border border-neutral-100 dark:bg-neutral-800 dark:border-neutral-700">
                  <div class="min-w-0">
                    <p class="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 dark:text-neutral-500">Account Details</p>
                    <p class="font-bold text-neutral-800 truncate dark:text-white">{{ paymentSettings.gcash.accountName || 'N/A' }}</p>
                    <p class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{{ paymentSettings.gcash.accountNumber || 'N/A' }}</p>
                  </div>
                  <button
                    @click="copyToClipboard(paymentSettings.gcash.accountNumber)"
                    class="rounded-lg bg-white p-2.5 text-blue-600 shadow-sm border border-neutral-200 hover:bg-neutral-50 active:scale-90 transition-all dark:bg-neutral-900 dark:text-blue-400 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    title="Copy Number"
                  >
                    <Copy :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <div class="relative mb-8">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-neutral-100 dark:border-neutral-800"></div>
              </div>
              <div class="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span class="bg-white px-3 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-600">Verification</span>
              </div>
            </div>

            <!-- Step 2: Proof -->
            <div class="space-y-6">
              <div class="text-center">
                <div class="mb-5 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                  Step 2: Upload Proof
                </div>
              </div>

              <!-- Reference Number -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 ml-1 dark:text-neutral-500">Reference Number</label>
                <input
                  v-model="form.referenceNo"
                  type="text"
                  placeholder="Enter 13-digit number"
                  class="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm font-medium focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:focus:bg-neutral-900 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/10 dark:placeholder:text-neutral-600"
                />
              </div>

              <!-- File Upload -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 ml-1 dark:text-neutral-500">Screenshot of Receipt</label>
                <div class="relative overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:bg-neutral-100 group dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-800/70">
                  <input
                    type="file"
                    accept="image/*"
                    class="absolute inset-0 z-10 cursor-pointer opacity-0"
                    @change="handleFileChange"
                  />
                  <div v-if="!receiptPreview" class="flex flex-col items-center py-8">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-400 border border-neutral-100 shadow-sm transition-transform group-hover:scale-110 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-700">
                      <Upload :size="18" />
                    </div>
                    <p class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider dark:text-neutral-400">Tap to upload image</p>
                    <p class="mt-1 text-[8px] text-neutral-400 uppercase dark:text-neutral-500">JPG, PNG up to 5MB</p>
                  </div>
                  <div v-else class="p-2">
                    <img :src="receiptPreview" class="aspect-video w-full rounded-lg object-cover shadow-sm" />
                    <div class="mt-3 text-center text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white/80 py-2 rounded-lg backdrop-blur-sm dark:text-blue-400 dark:bg-neutral-900/80">Change Receipt Image</div>
                  </div>
                </div>
              </div>

              <!-- Status Indicator -->
              <div v-if="isVerifying || receiptStatus" class="flex items-center gap-3 rounded-xl p-4 text-[11px] font-bold uppercase tracking-wider border transition-all animate-in fade-in slide-in-from-top-2"
                :class="{
                  'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400': isVerifying,
                  'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400': receiptStatus === 'legit',
                  'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400': receiptStatus === 'fake'
                }"
              >
                <template v-if="isVerifying">
                  <Loader2 :size="14" class="animate-spin" />
                  <span>Checking receipt...</span>
                </template>
                <template v-else-if="receiptStatus === 'legit'">
                  <CheckCircle :size="14" />
                  <span>Receipt verified!</span>
                </template>
                <template v-else-if="receiptStatus === 'fake'">
                  <AlertCircle :size="14" />
                  <span>Invalid receipt image</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-neutral-100 p-5 sm:p-6 bg-white shrink-0 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              @click="confirmGcashPayment"
              :disabled="isProcessing || receiptStatus !== 'legit' || !form.referenceNo"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed dark:shadow-blue-500/10 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
            >
              <span v-if="!isProcessing">Confirm Payment</span>
              <Loader2 v-else :size="16" class="animate-spin" />
            </button>
            <p class="mt-4 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-widest dark:text-neutral-500">
              Need Help? <span class="text-neutral-600 ml-1 dark:text-neutral-300">Contact Support</span>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </AppShell>
</template>>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../../components/AppShell.vue'
import { useCartStore } from '../../stores/cartStore'
import { checkoutCart } from '../../services/orderService'
import { getPaymentSettings, DEFAULT_PAYMENT_SETTINGS } from '../../services/settingsService'
import { useSession } from '../../composables/useSession'
import { formatCurrency } from '../../utils/format'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Lock, 
  CreditCard, 
  HandCoins, 
  Wallet, 
  Landmark, 
  Check, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck,
  QrCode,
  X,
  Info as InfoIcon,
  ArrowRight,
  Hash,
  Camera,
  Upload,
  Loader2,
  Copy
} from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated, profile } = useSession()
const { items: cartItems, totalAmount: cartTotalAmount, refresh: refreshCart } = useCartStore()
const message = ref('')
const showExclusiveNotice = ref(false)
const showGcashModal = ref(false)
const isProcessing = ref(false)
const isVerifying = ref(false)
const receiptStatus = ref(null) // null, 'verifying', 'legit', 'fake'
const receiptFile = ref(null)
const receiptPreview = ref(null)
const paymentSettings = ref(DEFAULT_PAYMENT_SETTINGS)
const CHECKOUT_NOTICE_KEY = 'scf_checkout_oriental_mindoro_notice_seen'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  addressLine: '',
  completeAddress: '',
  paymentMethod: '',
  referenceNo: '',
  receiptUrl: '',
})

// Sync form with profile if authenticated
watch(profile, (newProfile) => {
  if (newProfile && isAuthenticated.value) {
    form.firstName = newProfile.firstName || ''
    form.lastName = newProfile.lastName || ''
    form.email = newProfile.email || ''
    form.contactNo = newProfile.contact || ''
    form.addressLine = newProfile.address || ''
  }
}, { immediate: true })

const loadCheckout = async () => {
  const [, pSettings] = await Promise.all([
    refreshCart(),
    getPaymentSettings()
  ])
  paymentSettings.value = pSettings

  const hasSeenNotice = localStorage.getItem(CHECKOUT_NOTICE_KEY)
  showExclusiveNotice.value = !hasSeenNotice
}

const dismissExclusiveNotice = () => {
  showExclusiveNotice.value = false
  localStorage.setItem(CHECKOUT_NOTICE_KEY, 'true')
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  receiptFile.value = file
  receiptPreview.value = URL.createObjectURL(file)
  verifyReceipt(file)
}

const verifyReceipt = async (file) => {
  isVerifying.value = true
  receiptStatus.value = 'verifying'
  
  // Simulate AI/OCR verification logic
  setTimeout(() => {
    isVerifying.value = false
    const isBigEnough = file.size > 20000 // > 20KB
    const isImage = file.type.startsWith('image/')
    
    if (isBigEnough && isImage) {
      receiptStatus.value = 'legit'
    } else {
      receiptStatus.value = 'fake'
    }
  }, 2500)
}

const copyToClipboard = (text) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  // In a real app, you'd show a "Copied!" toast here
}

const handleCheckout = async () => {
  if (!cartItems.value.length) {
    message.value = 'Your cart is empty.'
    return
  }
  if (!form.paymentMethod) {
    message.value = 'Please select a payment method.'
    return
  }
  if (!form.firstName || !form.lastName || !form.contactNo || !form.addressLine) {
    message.value = 'Please fill in all delivery details.'
    return
  }

  if (form.paymentMethod === 'gcash') {
    showGcashModal.value = true
    return
  }

  await processOrder()
}

const confirmGcashPayment = async () => {
  if (!form.referenceNo || form.referenceNo.length < 10) {
    message.value = 'Invalid reference number.'
    return
  }
  if (!receiptFile.value || receiptStatus.value !== 'legit') {
    message.value = 'Please upload a valid GCash receipt.'
    return
  }

  await processOrder()
}

const processOrder = async () => {
  isProcessing.value = true
  message.value = 'Finalizing your order...'
  
  try {
    if (form.paymentMethod === 'gcash' && receiptFile.value) {
      message.value = 'Processing receipt...'
      const reader = new FileReader()
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(receiptFile.value)
      })
      form.receiptUrl = await base64Promise
    }

    const customerDetails = {
      ...form,
      completeAddress: `${form.addressLine.trim()}, Oriental Mindoro`,
    }

    const orderId = await checkoutCart({
      customerDetails,
      userId: isAuthenticated.value ? profile.value.id : null
    })

    message.value = `Order created successfully! Redirecting...`
    showGcashModal.value = false
    await refreshCart()

    setTimeout(() => {
      router.push('/shop')
    }, 2000)
  } catch (error) {
    isProcessing.value = false
    message.value = error.message || 'Checkout failed. Please try again.'
  }
}

onMounted(loadCheckout)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404040; }

input:focus, textarea:focus { outline: none; }
</style>
