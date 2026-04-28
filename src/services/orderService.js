import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'
import { clearCart, getCart } from './cartService'

export const checkoutCart = async ({ uid, addressId }) => {
  const cart = await getCart(uid)

  if (!cart.items.length) {
    throw new Error('Your cart is empty.')
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + Number(item.basePrice || 0) * Number(item.quantity || 0),
    0,
  )

  const orderRef = await addDoc(collection(db, 'orders'), {
    userId: uid,
    addressId: addressId || null,
    status: 'received',
    paid: false,
    totalAmount,
    createdAt: serverTimestamp(),
  })

  await Promise.all(
    cart.items.map((item) =>
      addDoc(collection(db, 'orders', orderRef.id, 'items'), {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtPurchase: Number(item.basePrice || 0),
        color: item.color || '',
        size: item.size || '',
        productName: item.productName || '',
      }),
    ),
  )

  await clearCart(uid)

  return orderRef.id
}

export const listUserOrders = async (uid) => {
  const orderSnapshots = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
  const orders = orderSnapshots.docs
    .map((orderDoc) => ({
      id: orderDoc.id,
      ...orderDoc.data(),
    }))
    .filter((order) => order.userId === uid)

  return Promise.all(
    orders.map(async (order) => {
      const itemSnapshots = await getDocs(collection(db, 'orders', order.id, 'items'))
      return {
        ...order,
        items: itemSnapshots.docs.map((itemDoc) => ({
          id: itemDoc.id,
          ...itemDoc.data(),
        })),
      }
    }),
  )
}

export const listAllOrders = async () => {
  const orderSnapshots = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))

  return Promise.all(
    orderSnapshots.docs.map(async (orderDoc) => {
      const itemSnapshots = await getDocs(collection(db, 'orders', orderDoc.id, 'items'))

      return {
        id: orderDoc.id,
        ...orderDoc.data(),
        items: itemSnapshots.docs.map((itemDoc) => ({
          id: itemDoc.id,
          ...itemDoc.data(),
        })),
      }
    }),
  )
}

export const updateOrderStatus = async (orderId, status) => {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
  })
}
