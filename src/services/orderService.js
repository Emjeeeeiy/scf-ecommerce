import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'
import { clearCart, getCart } from './cartService'

export const checkoutCart = async ({ customerDetails, userId = null }) => {
  const cart = await getCart()

  if (!cart.items.length) {
    throw new Error('Your cart is empty.')
  }

  if (
    !customerDetails?.email ||
    !customerDetails?.firstName ||
    !customerDetails?.lastName ||
    !customerDetails?.contactNo ||
    !customerDetails?.completeAddress
  ) {
    throw new Error('Please complete your customer details before checkout.')
  }
  if (!customerDetails?.paymentMethod) {
    throw new Error('Please select a payment method before checkout.')
  }

  // Validate GCash details if payment method is gcash
  if (customerDetails.paymentMethod === 'gcash') {
    if (!customerDetails.referenceNo) {
      throw new Error('Reference number is required for GCash payments.')
    }
    if (!customerDetails.receiptUrl) {
      throw new Error('Please upload your GCash receipt screenshot.')
    }
  }

  let finalUserId = userId
  let isGuest = !userId

  if (isGuest) {
    const guestRef = await addDoc(collection(db, 'guests'), {
      ...customerDetails,
      createdAt: serverTimestamp(),
    })
    finalUserId = guestRef.id
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + Number(item.basePrice || 0) * Number(item.quantity || 0),
    0,
  )

  const orderData = {
    userId: finalUserId,
    customerId: finalUserId,
    isGuest,
    customerDetails,
    paymentMethod: customerDetails.paymentMethod,
    status: 'received',
    paid: false,
    seenByAdmin: false,
    totalAmount,
    createdAt: serverTimestamp(),
    // Summary fields for list view optimization
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    firstItemName: cart.items[0]?.productName || '',
  }

  // Add GCash specific data if present
  if (customerDetails.paymentMethod === 'gcash') {
    orderData.referenceNo = customerDetails.referenceNo
    orderData.receiptUrl = customerDetails.receiptUrl // This will now be the base64 string
  }

  const orderRef = await addDoc(collection(db, 'orders'), orderData)

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

  await clearCart()

  return orderRef.id
}

export const listUserOrders = async (uid) => {
  const q = query(collection(db, 'orders'), where('userId', '==', uid), orderBy('createdAt', 'desc'))
  const orderSnapshots = await getDocs(q)
  
  return orderSnapshots.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...orderDoc.data(),
  }))
}

export const listAllOrders = async () => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const orderSnapshots = await getDocs(q)

  return orderSnapshots.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...orderDoc.data(),
  }))
}

export const getOrderItems = async (orderId) => {
  const itemSnapshots = await getDocs(collection(db, 'orders', orderId, 'items'))
  return itemSnapshots.docs.map((itemDoc) => ({
    id: itemDoc.id,
    ...itemDoc.data(),
  }))
}

export const subscribeToAllOrders = (callback) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, 
    (snapshot) => {
      const orders = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }))
      callback(orders)
    },
    (error) => {
      console.error("Firestore Orders Subscription Error:", error.code, error.message)
    }
  )
}

export const subscribeToUnseenOrdersCount = (callback) => {
  const q = query(collection(db, 'orders'), where('seenByAdmin', '==', false))
  return onSnapshot(q, 
    (snapshot) => {
      // Helpful for debugging in hosted environments
      console.log(`[OrderNotification] Unseen count update: ${snapshot.size}`)
      callback(snapshot.size)
    },
    (error) => {
      console.error("Firestore Notification Error:", error.code, error.message)
    }
  )
}

export const markOrderAsSeen = async (orderId) => {
  await updateDoc(doc(db, 'orders', orderId), {
    seenByAdmin: true,
  })
}

export const updateOrderStatus = async (orderId, status) => {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
  })
}

export const updateMultipleOrderStatuses = async (orderIds, status) => {
  const batch = writeBatch(db)
  orderIds.forEach((orderId) => {
    batch.update(doc(db, 'orders', orderId), { status })
  })
  await batch.commit()
}

export const deleteOrder = async (orderId) => {
  const batch = writeBatch(db)

  // Get all items in the order's items subcollection
  const itemsSnapshot = await getDocs(collection(db, 'orders', orderId, 'items'))
  itemsSnapshot.docs.forEach((itemDoc) => {
    batch.delete(itemDoc.ref)
  })

  // Delete the order document itself
  batch.delete(doc(db, 'orders', orderId))

  await batch.commit()
}

