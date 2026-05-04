import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../Firebase/Firebase'
import { getProduct } from './catalogService'

const CART_STORAGE_KEY = 'scf_cart_items'

// Helper to notify UI of changes if needed
let refreshCallback = null
export const registerCartRefresh = (cb) => { refreshCallback = cb }
const notifyRefresh = () => { if (refreshCallback) refreshCallback() }

const calculateCartTotals = (items) => {
  const totalAmount = items.reduce((sum, item) => sum + Number(item.basePrice || 0) * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    totalAmount,
    totalItems,
  }
}

const readCartItemsFromLocal = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeCartItemsToLocal = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

const getFirestoreCartRef = () => {
  const user = auth.currentUser
  if (!user) return null
  return doc(db, 'carts', user.uid)
}

const readCartItemsFromFirestore = async () => {
  const cartRef = getFirestoreCartRef()
  if (!cartRef) return []
  try {
    const snapshot = await getDoc(cartRef)
    return snapshot.exists() ? snapshot.data().items || [] : []
  } catch (error) {
    console.error('Error reading cart from Firestore:', error)
    return []
  }
}

const writeCartItemsToFirestore = async (items) => {
  const cartRef = getFirestoreCartRef()
  if (!cartRef) return
  try {
    await setDoc(cartRef, { items, updatedAt: new Date() }, { merge: true })
  } catch (error) {
    console.error('Error writing cart to Firestore:', error)
  }
}

export const getCart = async () => {
  const items = auth.currentUser 
    ? await readCartItemsFromFirestore() 
    : readCartItemsFromLocal()
    
  return {
    items,
    ...calculateCartTotals(items),
  }
}

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
  const product = await getProduct(productId)
  const variant = product?.variants?.find((item) => item.id === variantId)

  if (!product || !variant) {
    throw new Error('Selected product variant was not found.')
  }

  const items = auth.currentUser 
    ? await readCartItemsFromFirestore() 
    : readCartItemsFromLocal()

  const itemIndex = items.findIndex((item) => item.id === variantId)
  const existingQuantity = itemIndex >= 0 ? Number(items[itemIndex].quantity || 0) : 0
  const nextQuantity = existingQuantity + Number(quantity)

  if (nextQuantity > Number(variant.stock || 0)) {
    throw new Error('Requested quantity exceeds available stock.')
  }

  const itemPayload = {
    id: variantId,
    productId,
    variantId,
    quantity: nextQuantity,
    productName: product.name,
    basePrice: Number(product.basePrice || 0),
    base64Image: product.base64Image || '',
    color: variant.color || '',
    size: variant.size || '',
  }

  if (itemIndex >= 0) {
    items[itemIndex] = itemPayload
  } else {
    items.push(itemPayload)
  }

  if (auth.currentUser) {
    await writeCartItemsToFirestore(items)
  } else {
    writeCartItemsToLocal(items)
  }
  
  notifyRefresh()
}

export const updateCartItemQuantity = async ({ variantId, quantity }) => {
  const items = auth.currentUser 
    ? await readCartItemsFromFirestore() 
    : readCartItemsFromLocal()

  const itemIndex = items.findIndex((item) => item.id === variantId)

  if (itemIndex < 0) {
    return
  }

  if (quantity <= 0) {
    items.splice(itemIndex, 1)
  } else {
    items[itemIndex] = {
      ...items[itemIndex],
      quantity: Number(quantity),
    }
  }

  if (auth.currentUser) {
    await writeCartItemsToFirestore(items)
  } else {
    writeCartItemsToLocal(items)
  }
  
  notifyRefresh()
}

export const removeCartItem = async ({ variantId }) => {
  const items = auth.currentUser 
    ? await readCartItemsFromFirestore() 
    : readCartItemsFromLocal()
    
  const filteredItems = items.filter((item) => item.id !== variantId)

  if (auth.currentUser) {
    await writeCartItemsToFirestore(filteredItems)
  } else {
    writeCartItemsToLocal(filteredItems)
  }
  
  notifyRefresh()
}

export const clearCart = async () => {
  if (auth.currentUser) {
    await writeCartItemsToFirestore([])
  } else {
    writeCartItemsToLocal([])
  }
  notifyRefresh()
}

export const syncCartOnLogin = async () => {
  const localItems = readCartItemsFromLocal()
  if (localItems.length === 0) return

  const dbItems = await readCartItemsFromFirestore()
  
  // Merge logic: If item exists in both, prefer the local one (or sum them up?)
  // Let's sum them up for better UX, or just use local if they match.
  // Simple merge: add items from local that are not in DB, or update quantity
  const mergedItems = [...dbItems]
  
  localItems.forEach(localItem => {
    const existingIndex = mergedItems.findIndex(item => item.id === localItem.id)
    if (existingIndex >= 0) {
      // If already in DB, we could either overwrite or add. Let's add for now.
      mergedItems[existingIndex].quantity += localItem.quantity
    } else {
      mergedItems.push(localItem)
    }
  })

  await writeCartItemsToFirestore(mergedItems)
  writeCartItemsToLocal([]) // Clear local cart after sync
  notifyRefresh()
}
