<template>
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />

    <div class="flex-1 p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Products and Orders</h1>
          <p class="text-gray-500">Manage `products` and update ecommerce order progress</p>
        </div>
      </div>

      <section class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ editingProductId ? 'Edit Product' : 'Add Product' }}</h2>

        <form @submit.prevent="saveProduct" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input v-model.trim="productForm.productName" type="text" placeholder="Product name" class="px-4 py-3 border rounded-xl" required />
          <input v-model.number="productForm.price" type="number" min="0" step="0.01" placeholder="Price" class="px-4 py-3 border rounded-xl" required />
          <input v-model.trim="productForm.category" type="text" placeholder="Category" class="px-4 py-3 border rounded-xl" required />
          <select v-model="productForm.status" class="px-4 py-3 border rounded-xl bg-white">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>

          <div class="md:col-span-4 flex gap-3">
            <button class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              {{ savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product' }}
            </button>
            <button
              v-if="editingProductId"
              type="button"
              @click="resetProductForm"
              class="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl"
            >
              Cancel Edit
            </button>
          </div>
        </form>
      </section>

      <section class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Products</h2>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="border-b">
              <tr>
                <th class="py-4 px-3">Product ID</th>
                <th class="py-4 px-3">Product Name</th>
                <th class="py-4 px-3">Price</th>
                <th class="py-4 px-3">Status</th>
                <th class="py-4 px-3">Category</th>
                <th class="py-4 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="border-b hover:bg-gray-50">
                <td class="py-4 px-3">{{ product.id }}</td>
                <td class="py-4 px-3">{{ product.productName }}</td>
                <td class="py-4 px-3">₱{{ formatCurrency(product.price) }}</td>
                <td class="py-4 px-3 capitalize">{{ product.status }}</td>
                <td class="py-4 px-3">{{ product.category }}</td>
                <td class="py-4 px-3">
                  <button @click="editProduct(product)" class="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Orders</h2>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="border-b">
              <tr>
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
              <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50">
                <td class="py-4 px-3">{{ order.orderId || order.id }}</td>
                <td class="py-4 px-3">{{ order.userId }}</td>
                <td class="py-4 px-3">{{ productName(order.productId) }}</td>
                <td class="py-4 px-3">{{ order.color }}</td>
                <td class="py-4 px-3">{{ order.size }}</td>
                <td class="py-4 px-3">{{ order.quantity }}</td>
                <td class="py-4 px-3">
                  <select
                    :value="order.status"
                    @change="changeOrderStatus(order.id, $event.target.value)"
                    class="px-3 py-2 border rounded-lg bg-white"
                  >
                    <option v-for="status in orderStatuses" :key="status" :value="status">{{ status }}</option>
                  </select>
                </td>
                <td class="py-4 px-3">
                  <label class="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      :checked="order.paid"
                      @change="togglePaid(order.id, $event.target.checked)"
                    />
                    <span>{{ order.paid ? 'Yes' : 'No' }}</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Sidebar from '../../components/Sidebar.vue'
import { ORDER_STATUSES, updateOrder, upsertProduct, watchOrders, watchProducts } from '../../services/store'

const products = ref([])
const orders = ref([])
const orderStatuses = ORDER_STATUSES
const savingProduct = ref(false)
const editingProductId = ref('')
const productForm = ref({
  productName: '',
  price: 0,
  status: 'active',
  category: ''
})

const formatCurrency = (value) => Number(value || 0).toFixed(2)

const productName = (productId) => {
  const product = products.value.find((item) => item.id === productId)
  return product?.productName || 'Unknown Product'
}

const resetProductForm = () => {
  editingProductId.value = ''
  productForm.value = {
    productName: '',
    price: 0,
    status: 'active',
    category: ''
  }
}

const editProduct = (product) => {
  editingProductId.value = product.id
  productForm.value = {
    productName: product.productName || '',
    price: Number(product.price || 0),
    status: product.status || 'active',
    category: product.category || ''
  }
}

const saveProduct = async () => {
  savingProduct.value = true

  try {
    await upsertProduct({
      id: editingProductId.value || undefined,
      ...productForm.value
    })
    resetProductForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Unable to save product.')
  } finally {
    savingProduct.value = false
  }
}

const changeOrderStatus = async (orderId, status) => {
  try {
    await updateOrder(orderId, { status })
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Unable to update order status.')
  }
}

const togglePaid = async (orderId, paid) => {
  try {
    await updateOrder(orderId, { paid })
  } catch (error) {
    console.error('Failed to update payment status:', error)
    alert('Unable to update payment status.')
  }
}

let stopProducts = null
let stopOrders = null

onMounted(() => {
  stopProducts = watchProducts((items) => {
    products.value = items
  })

  stopOrders = watchOrders((items) => {
    orders.value = items
  })
})

onUnmounted(() => {
  stopProducts?.()
  stopOrders?.()
})
</script>