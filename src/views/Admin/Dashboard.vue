<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1">
      <header class="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p class="text-gray-500">Overview of products, users, and ecommerce orders</p>
        </div>

        <router-link to="/" class="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition">
          Back to Home
        </router-link>
      </header>

      <main class="p-8">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Total Products</p>
            <h2 class="text-4xl font-bold text-gray-800">{{ totalProducts }}</h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Registered Users</p>
            <h2 class="text-4xl font-bold text-blue-600">{{ totalUsers }}</h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Total Orders</p>
            <h2 class="text-4xl font-bold text-yellow-500">{{ totalOrders }}</h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Paid Revenue</p>
            <h2 class="text-4xl font-bold text-green-600">₱{{ formatCurrency(totalRevenue) }}</h2>
          </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Recieved</p>
            <h2 class="text-4xl font-bold text-gray-800">{{ statusCounts.recieved }}</h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">Processing</p>
            <h2 class="text-4xl font-bold text-yellow-500">{{ statusCounts.processing }}</h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <p class="text-sm text-gray-500 mb-2">On The Way / Delivered</p>
            <h2 class="text-4xl font-bold text-blue-600">{{ statusCounts.otw + statusCounts.delivered }}</h2>
          </div>
        </section>

        <section class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Recent Orders</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b">
                  <th class="py-4 px-3">Order ID</th>
                  <th class="py-4 px-3">User ID</th>
                  <th class="py-4 px-3">Product</th>
                  <th class="py-4 px-3">Color</th>
                  <th class="py-4 px-3">Size</th>
                  <th class="py-4 px-3">Quantity</th>
                  <th class="py-4 px-3">Status</th>
                  <th class="py-4 px-3">Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id" class="border-b hover:bg-gray-50">
                  <td class="py-4 px-3">{{ order.orderId || order.id }}</td>
                  <td class="py-4 px-3">{{ order.userId }}</td>
                  <td class="py-4 px-3">{{ productName(order.productId) }}</td>
                  <td class="py-4 px-3">{{ order.color }}</td>
                  <td class="py-4 px-3">{{ order.size }}</td>
                  <td class="py-4 px-3">{{ order.quantity }}</td>
                  <td class="py-4 px-3">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-medium',
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-blue-100 text-blue-600'
                      ]"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="py-4 px-3">{{ order.paid ? 'Yes' : 'No' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Sidebar from '../../components/Sidebar.vue'
import { watchOrders, watchProducts, watchUsers } from '../../services/store'

const totalProducts = ref(0)
const totalUsers = ref(0)
const totalOrders = ref(0)
const totalRevenue = ref(0)
const products = ref([])
const orders = ref([])
const users = ref([])

const productMap = computed(() =>
  products.value.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {})
)

const statusCounts = computed(() =>
  orders.value.reduce(
    (counts, order) => {
      const status = order.status || 'recieved'
      counts[status] = (counts[status] || 0) + 1
      return counts
    },
    { recieved: 0, processing: 0, otw: 0, delivered: 0 }
  )
)

const recentOrders = computed(() => orders.value.slice(0, 8))

const productName = (productId) => productMap.value[productId]?.productName || 'Unknown Product'

const formatCurrency = (value) => Number(value || 0).toFixed(2)

let stopProducts = null
let stopUsers = null
let stopOrders = null

onMounted(() => {
  stopProducts = watchProducts((items) => {
    products.value = items
    totalProducts.value = items.length
    totalRevenue.value = orders.value.reduce((sum, order) => {
      if (!order.paid) return sum
      const price = Number(productMap.value[order.productId]?.price || 0)
      return sum + price * Number(order.quantity || 0)
    }, 0)
  })

  stopUsers = watchUsers((items) => {
    users.value = items
    totalUsers.value = items.length
  })

  stopOrders = watchOrders((items) => {
    orders.value = items
    totalOrders.value = items.length
    totalRevenue.value = items.reduce((sum, order) => {
      if (!order.paid) return sum
      const price = Number(productMap.value[order.productId]?.price || 0)
      return sum + price * Number(order.quantity || 0)
    }, 0)
  })
})

onUnmounted(() => {
  stopProducts?.()
  stopUsers?.()
  stopOrders?.()
})
</script>