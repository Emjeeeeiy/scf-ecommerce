import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db, serverTimestamp } from '../Firebase/Firebase'
import { getProduct } from './catalogService'

const calculateCartTotals = (items) => {
  const totalAmount = items.reduce((sum, item) => sum + Number(item.basePrice || 0) * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    totalAmount,
    totalItems,
  }
}

export const getCart = async (uid) => {
  const cartRef = doc(db, 'carts', uid)
  const cartSnapshot = await getDoc(cartRef)
  const itemsSnapshot = await getDocs(collection(db, 'carts', uid, 'items'))
  const items = itemsSnapshot.docs.map((itemDoc) => ({
    id: itemDoc.id,
    ...itemDoc.data(),
  }))

  return {
    id: uid,
    ...(cartSnapshot.exists() ? cartSnapshot.data() : {}),
    items,
    ...calculateCartTotals(items),
  }
}

export const addToCart = async ({ uid, productId, variantId, quantity = 1 }) => {
  const product = await getProduct(productId)
  const variant = product?.variants?.find((item) => item.id === variantId)

  if (!product || !variant) {
    throw new Error('Selected product variant was not found.')
  }

  const cartRef = doc(db, 'carts', uid)
  const itemRef = doc(db, 'carts', uid, 'items', variantId)
  const existingItemSnapshot = await getDoc(itemRef)
  const nextQuantity = (existingItemSnapshot.data()?.quantity || 0) + Number(quantity)

  if (nextQuantity > Number(variant.stock || 0)) {
    throw new Error('Requested quantity exceeds available stock.')
  }

  const cartPayload = {
    userId: uid,
    updatedAt: serverTimestamp(),
  }

  const cartSnapshot = await getDoc(cartRef)

  if (!cartSnapshot.exists()) {
    cartPayload.createdAt = serverTimestamp()
  }

  await setDoc(cartRef, cartPayload, { merge: true })

  await setDoc(
    itemRef,
    {
      productId,
      variantId,
      quantity: nextQuantity,
      productName: product.name,
      basePrice: Number(product.basePrice || 0),
      base64Image: product.base64Image || '',
      color: variant.color || '',
      size: variant.size || '',
    },
    { merge: true },
  )
}

export const updateCartItemQuantity = async ({ uid, variantId, quantity }) => {
  const itemRef = doc(db, 'carts', uid, 'items', variantId)

  if (quantity <= 0) {
    await deleteDoc(itemRef)
    return
  }

  await updateDoc(itemRef, {
    quantity: Number(quantity),
  })
}

export const removeCartItem = async ({ uid, variantId }) => {
  await deleteDoc(doc(db, 'carts', uid, 'items', variantId))
}

export const clearCart = async (uid) => {
  const itemsSnapshot = await getDocs(collection(db, 'carts', uid, 'items'))
  await Promise.all(itemsSnapshot.docs.map((itemDoc) => deleteDoc(itemDoc.ref)))
}
