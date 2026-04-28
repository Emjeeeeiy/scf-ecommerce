<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Fashion Store</h1>
          <p class="text-sm text-gray-500">Products, cart, and orders based on your database schema</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium">
            Cart: {{ cart.length }}
          </div>
          <div class="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium">
            Orders: {{ orders.length }}
          </div>
          <router-link to="/" class="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition">
            Home
          </router-link>
        </div>
      </div>
    </nav>

    <section class="py-10 px-6">
      <div class="max-w-7xl mx-auto space-y-10">
        <div>
          <h2 class="text-4xl font-bold text-gray-800 mb-3">Shop Products</h2>
          <p class="text-gray-600">Users can add active products to `cartItems`, then convert them into `orders`.</p>
        </div>

        <div v-if="loadingProducts" class="bg-white rounded-2xl shadow-md p-6 text-gray-500">
          Loading products...
        </div>

        <div v-else-if="products.length === 0" class="bg-white rounded-2xl shadow-md p-6 text-gray-500">
          No active products found. Add products from the admin panel first.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-2xl shadow-md p-6 space-y-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">{{ product.productName }}</h3>
                <p class="text-sm text-gray-500">{{ product.category || 'Uncategorized' }}</p>
              </div>
              <span class="text-lg font-bold text-blue-600">₱{{ formatCurrency(product.price) }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                v-model.trim="productSelections[product.id].color"
                type="text"
                placeholder="Color"
                class="px-4 py-3 border rounded-xl"
              />
              <select
                v-model="productSelections[product.id].size"
                class="px-4 py-3 border rounded-xl bg-white"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <input
                v-model.number="productSelections[product.id].quantity"
                type="number"
                min="1"
                class="px-4 py-3 border rounded-xl"
              />
            </div>

            <button
              @click="handleAddToCart(product)"
              class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section class="bg-white rounded-2xl shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-800">My Cart</h2>
              <button
                @click="placeOrder"
                :disabled="!cart.length || savingOrder"
                class="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition disabled:opacity-50"
              >
                {{ savingOrder ? 'Creating Orders...' : 'Checkout All' }}
              </button>
            </div>

            <div v-if="cart.length === 0" class="text-gray-500">
              No items in cart yet.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="item in cartWithProducts"
                :key="item.id"
                class="border rounded-2xl p-4 space-y-3"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ item.productName }}</h3>
                    <p class="text-sm text-gray-500">
                      {{ item.category || 'Uncategorized' }} | {{ item.color }} | {{ item.size }}
                    </p>
                  </div>
                  <span class="font-semibold text-blue-600">
                    ₱{{ formatCurrency(item.price * item.quantity) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <input
                    :value="item.quantity"
                    @change="changeQuantity(item.id, $event)"
                    type="number"
                    min="1"
                    class="w-24 px-3 py-2 border rounded-xl"
                  />

                  <button
                    @click="handleRemoveFromCart(item.id)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div class="pt-4 border-t flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800">Total: ₱{{ formatCurrency(totalPrice) }}</h3>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>

            <div v-if="orders.length === 0" class="text-gray-500">
              No orders yet.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="order in ordersWithProducts"
                :key="order.id"
                class="border rounded-2xl p-4"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ order.productName }}</h3>
                    <p class="text-sm text-gray-500">
                      Order ID: {{ order.orderId || order.id }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ order.color }} | {{ order.size }} | Qty: {{ order.quantity }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-blue-600">₱{{ formatCurrency(order.price * order.quantity) }}</p>
                    <p class="text-sm capitalize" :class="statusClass(order.status)">
                      {{ order.status }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Paid: {{ order.paid ? 'Yes' : 'No' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { auth } from '../../Firebase/Firebase'
import {
  addCartItem,
  createOrdersFromCart,
  removeCartItem,
  seedProductsIfEmpty,
  updateCartItemQuantity,
  watchActiveProducts,
  watchCartItems,
  watchUserOrders
} from '../../services/store'

const defaultProducts = [
  { productName: 'Oversized Shirt', price: 599, status: 'active', category: 'shirts' },
  { productName: 'Graphic Tee', price: 699, status: 'active', category: 'shirts' },
  { productName: 'Polo Shirt', price: 799, status: 'active', category: 'shirts' },
  { productName: 'Long Sleeve Shirt', price: 899, status: 'inactive', category: 'shirts' }
]

const products = ref([])
const cart = ref([])
const orders = ref([])
const loadingProducts = ref(true)
const savingOrder = ref(false)
const productSelections = ref({})

const ensureSelection = (productId) => {
  if (!productSelections.value[productId]) {
    productSelections.value[productId] = {
      color: '',
      size: 'M',
      quantity: 1
    }
  }
}

const productsById = computed(() =>
  products.value.reduce((map, product) => {
    map[product.id] = product
    return map
  }, {})
)

const cartWithProducts = computed(() =>
  cart.value.map((item) => {
    const product = productsById.value[item.productId] || {}
    return {
      ...item,
      productName: product.productName || 'Unknown Product',
      category: product.category || '',
      price: Number(product.price || 0)
    }
  })
)

const ordersWithProducts = computed(() =>
  orders.value.map((item) => {
    const product = productsById.value[item.productId] || {}
    return {
      ...item,
      productName: product.productName || 'Unknown Product',
      price: Number(product.price || 0)
    }
  })
)

const totalPrice = computed(() =>
  cartWithProducts.value.reduce((sum, item) => sum + item.price * Number(item.quantity || 0), 0)
)

const formatCurrency = (value) => Number(value || 0).toFixed(2)

const statusClass = (status) => {
  if (status === 'delivered') return 'text-green-600'
  if (status === 'otw') return 'text-blue-600'
  if (status === 'processing') return 'text-yellow-600'
  return 'text-gray-600'
}

const handleAddToCart = async (product) => {
  const user = auth.currentUser
  if (!user) {
    alert('Please login first.')
    return
  }

  ensureSelection(product.id)
  const selection = productSelections.value[product.id]

  if (!selection.color.trim()) {
    alert('Please enter a color.')
    return
  }

  try {
    await addCartItem({
      userId: user.uid,
      productId: product.id,
      color: selection.color.trim(),
      size: selection.size,
      quantity: Number(selection.quantity || 1)
    })

    productSelections.value[product.id] = {
      color: '',
      size: 'M',
      quantity: 1
    }
  } catch (error) {
    console.error('Failed to add cart item:', error)
    alert('Unable to add item to cart.')
  }
}

const handleRemoveFromCart = async (cartItemId) => {
  try {
    await removeCartItem(cartItemId)
  } catch (error) {
    console.error('Failed to remove item:', error)
    alert('Unable to remove item.')
  }
}

const changeQuantity = async (cartItemId, event) => {
  const quantity = Number(event.target.value || 1)
  if (quantity < 1) {
    event.target.value = 1
    return
  }

  try {
    await updateCartItemQuantity(cartItemId, quantity)
  } catch (error) {
    console.error('Failed to update quantity:', error)
    alert('Unable to update quantity.')
  }
}

const placeOrder = async () => {
  const user = auth.currentUser
  if (!user || !cart.value.length) return

  savingOrder.value = true

  try {
    await createOrdersFromCart({
      userId: user.uid,
      cartItems: cart.value
    })
    alert('Orders created successfully.')
  } catch (error) {
    console.error('Failed to place order:', error)
    alert('Unable to create orders.')
  } finally {
    savingOrder.value = false
  }
}

let stopProducts = null
let stopCart = null
let stopOrders = null

onMounted(async () => {
  await seedProductsIfEmpty(defaultProducts)

  stopProducts = watchActiveProducts((items) => {
    products.value = items
    items.forEach((product) => ensureSelection(product.id))
    loadingProducts.value = false
  })

  const user = auth.currentUser
  if (!user) return

  stopCart = watchCartItems(user.uid, (items) => {
    cart.value = items
  })

  stopOrders = watchUserOrders(user.uid, (items) => {
    orders.value = items
  })
})

onUnmounted(() => {
  stopProducts?.()
  stopCart?.()
  stopOrders?.()
})
</script>