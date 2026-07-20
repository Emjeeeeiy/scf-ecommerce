import { ref } from 'vue'
import {
  deleteOrder as deleteOrderService,
  getOrderItems,
  listUserOrders,
  markOrderAsSeen,
  subscribeToAllOrders,
  updateMultipleOrderStatuses,
  updateOrderStatus as updateOrderStatusService,
} from '../services/orderService'

/**
 * Centralized admin order state. Admin/Orders and Admin/Dashboard both need the
 * full order list; previously Dashboard did a one-time listAllOrders() while
 * Admin/Orders ran a live subscription, so the two pages could disagree the
 * moment an order changed. Now they share one live-updating list. A ref count
 * keeps the Firestore listener open only while at least one consumer is mounted,
 * so navigating away from both admin pages actually tears it down.
 */
const orders = ref([])
const ordersLoading = ref(true)
let firestoreUnsubscribe = null
let subscriberCount = 0

const subscribeOrders = () => {
  subscriberCount += 1
  if (firestoreUnsubscribe) return

  ordersLoading.value = true
  firestoreUnsubscribe = subscribeToAllOrders((data) => {
    orders.value = data
    ordersLoading.value = false
  })
}

const unsubscribeOrders = () => {
  subscriberCount = Math.max(0, subscriberCount - 1)
  if (subscriberCount === 0 && firestoreUnsubscribe) {
    firestoreUnsubscribe()
    firestoreUnsubscribe = null
  }
}

const countByStatus = (status) => orders.value.filter((order) => order.status === status).length

// A customer's own order history is a separate, on-demand read (not part of the
// realtime admin list, which only admins are allowed to subscribe to).
const userOrders = ref([])
const userOrdersLoading = ref(false)

const fetchUserOrders = async (uid) => {
  userOrdersLoading.value = true
  try {
    userOrders.value = await listUserOrders(uid)
  } finally {
    userOrdersLoading.value = false
  }
}

export function useOrderStore() {
  return {
    orders,
    ordersLoading,
    subscribeOrders,
    unsubscribeOrders,
    countByStatus,

    userOrders,
    userOrdersLoading,
    fetchUserOrders,

    // The admin orders list is realtime, so these just write through to Firestore —
    // the shared `orders` ref updates itself via the subscription above.
    updateStatus: (orderId, status) => updateOrderStatusService(orderId, status),
    bulkUpdateStatus: (orderIds, status) => updateMultipleOrderStatuses(orderIds, status),
    remove: (orderId) => deleteOrderService(orderId),
    markSeen: (orderId) => markOrderAsSeen(orderId),
    fetchOrderItems: (orderId) => getOrderItems(orderId),
  }
}
