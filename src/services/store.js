import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '../Firebase/Firebase'

const COLLECTIONS = {
  users: 'users',
  products: 'products',
  orders: 'orders',
  cartItems: 'cartItems'
}

export const ORDER_STATUSES = ['recieved', 'processing', 'otw', 'delivered']
export const PRODUCT_STATUSES = ['active', 'inactive']

export const getUserProfile = async (userId) => {
  if (!userId) return null

  const snapshot = await getDoc(doc(db, COLLECTIONS.users, userId))
  if (!snapshot.exists()) return null

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}

export const saveUserProfile = async (userId, payload) => {
  await setDoc(
    doc(db, COLLECTIONS.users, userId),
    {
      userId,
      ...payload
    },
    { merge: true }
  )
}

export const watchProducts = (callback) => {
  const productsQuery = query(
    collection(db, COLLECTIONS.products),
    orderBy('productName')
  )

  return onSnapshot(productsQuery, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    )
  })
}

export const watchActiveProducts = (callback) => {
  const productsQuery = query(
    collection(db, COLLECTIONS.products),
    where('status', '==', 'active'),
    orderBy('productName')
  )

  return onSnapshot(productsQuery, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    )
  })
}

export const watchUsers = (callback) => {
  return onSnapshot(collection(db, COLLECTIONS.users), (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    )
  })
}

export const watchOrders = (callback) => {
  const ordersQuery = query(
    collection(db, COLLECTIONS.orders),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(ordersQuery, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    )
  })
}

export const watchUserOrders = (userId, callback) => {
  const ordersQuery = query(
    collection(db, COLLECTIONS.orders),
    where('userId', '==', userId)
  )

  return onSnapshot(ordersQuery, (snapshot) => {
    const items = snapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data()
      }))
      .sort((a, b) => {
        const aValue = a.createdAt?.seconds || 0
        const bValue = b.createdAt?.seconds || 0
        return bValue - aValue
      })

    callback(items)
  })
}

export const watchCartItems = (userId, callback) => {
  const cartQuery = query(
    collection(db, COLLECTIONS.cartItems),
    where('userId', '==', userId)
  )

  return onSnapshot(cartQuery, (snapshot) => {
    callback(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    )
  })
}

export const seedProductsIfEmpty = async (products) => {
  const snapshot = await getDocs(query(collection(db, COLLECTIONS.products), limit(1)))
  if (!snapshot.empty) return

  await Promise.all(
    products.map((product) => addDoc(collection(db, COLLECTIONS.products), product))
  )
}

export const addCartItem = async ({ userId, productId, color, size, quantity }) => {
  const cartQuery = query(
    collection(db, COLLECTIONS.cartItems),
    where('userId', '==', userId),
    where('productId', '==', productId),
    where('color', '==', color),
    where('size', '==', size)
  )

  const existing = await getDocs(cartQuery)

  if (!existing.empty) {
    const current = existing.docs[0]
    const currentQuantity = Number(current.data().quantity || 0)
    await updateDoc(current.ref, {
      quantity: currentQuantity + quantity,
      updatedAt: serverTimestamp()
    })
    return
  }

  await addDoc(collection(db, COLLECTIONS.cartItems), {
    userId,
    productId,
    color,
    size,
    quantity,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  await updateDoc(doc(db, COLLECTIONS.cartItems, cartItemId), {
    quantity,
    updatedAt: serverTimestamp()
  })
}

export const removeCartItem = async (cartItemId) => {
  await deleteDoc(doc(db, COLLECTIONS.cartItems, cartItemId))
}

export const createOrdersFromCart = async ({ userId, cartItems }) => {
  await Promise.all(
    cartItems.map(async (item) => {
      const orderRef = doc(collection(db, COLLECTIONS.orders))
      await setDoc(orderRef, {
        orderId: orderRef.id,
        productId: item.productId,
        userId,
        status: 'recieved',
        paid: false,
        color: item.color,
        size: item.size,
        quantity: Number(item.quantity || 1),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      await deleteDoc(doc(db, COLLECTIONS.cartItems, item.id))
    })
  )
}

export const updateOrder = async (orderId, payload) => {
  await updateDoc(doc(db, COLLECTIONS.orders, orderId), {
    ...payload,
    updatedAt: serverTimestamp()
  })
}

export const upsertProduct = async (product) => {
  const payload = {
    productName: product.productName,
    price: Number(product.price || 0),
    status: product.status,
    category: product.category,
    updatedAt: serverTimestamp()
  }

  if (product.id) {
    await updateDoc(doc(db, COLLECTIONS.products, product.id), payload)
    return
  }

  await addDoc(collection(db, COLLECTIONS.products), {
    ...payload,
    createdAt: serverTimestamp()
  })
}
