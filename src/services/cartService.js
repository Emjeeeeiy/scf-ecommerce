import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore'
import { auth, db } from '../Firebase/Firebase'
import { getProduct } from './catalogService'

const CART_STORAGE_KEY = 'scf_cart_items'

// Helper to notify UI of changes if needed
let refreshCallback = null
export const registerCartRefresh = (cb) => { refreshCallback = cb }
const notifyRefresh = () => { if (refreshCallback) refreshCallback() }

// Create unique item key combining productId, variantId, color, and size
const createItemKey = (productId, variantId, color, size) => {
  return `${productId}__${variantId}__${color || 'std'}__${size || 'std'}`
}

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
  // Always strip images before saving to prevent local storage bloat as well
  const cleanItems = items.map(({ base64Image, ...rest }) => rest)
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanItems))
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
    throw error
  }
}

/**
 * Hydrates cart items with images and fresh details from the catalog.
 * This prevents the Cart document from exceeding the 1MB Firestore limit.
 */
const hydrateCartItems = async (items) => {
  const productCache = {}
  
  return Promise.all(items.map(async (item) => {
    try {
      if (!productCache[item.productId]) {
        productCache[item.productId] = await getProduct(item.productId)
      }
      const product = productCache[item.productId]
      
      return {
        ...item,
        productName: product?.name || item.productName,
        basePrice: product?.basePrice || item.basePrice,
        base64Image: product?.base64Image || '',
      }
    } catch (error) {
      console.error(`Error hydrating item ${item.productId}:`, error)
      return item
    }
  }))
}

export const getCart = async () => {
  try {
    const rawItems = auth.currentUser 
      ? await readCartItemsFromFirestore() 
      : readCartItemsFromLocal()
    
    const hydratedItems = await hydrateCartItems(rawItems)
      
    return {
      items: hydratedItems,
      ...calculateCartTotals(hydratedItems),
    }
  } catch (error) {
    return {
      items: [],
      totalAmount: 0,
      totalItems: 0,
      error: error.message
    }
  }
}

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
  const product = await getProduct(productId)
  const variant = product?.variants?.find((item) => item.id === variantId)

  if (!product || !variant) {
    throw new Error('Selected product variant was not found.')
  }

  // Create clean payload without the heavy image
  const createPayload = (items, existingIndex) => {
    const itemKey = createItemKey(productId, variantId, variant.color, variant.size)
    const existingQuantity = existingIndex >= 0 ? Number(items[existingIndex].quantity || 0) : 0
    const nextQuantity = existingQuantity + Number(quantity)

    if (nextQuantity > Number(variant.stock || 0)) {
      throw new Error('Requested quantity exceeds available stock.')
    }

    return {
      cartKey: itemKey,
      id: variantId,
      productId,
      variantId,
      quantity: nextQuantity,
      productName: product.name,
      basePrice: Number(product.basePrice || 0),
      // base64Image removed to save space
      color: variant.color || '',
      size: variant.size || '',
    }
  }

  if (!auth.currentUser) {
    const items = readCartItemsFromLocal()
    const itemKey = createItemKey(productId, variantId, variant.color, variant.size)
    const itemIndex = items.findIndex((item) => item.cartKey === itemKey)
    const itemPayload = createPayload(items, itemIndex)

    if (itemIndex >= 0) {
      items[itemIndex] = itemPayload
    } else {
      items.push(itemPayload)
    }
    writeCartItemsToLocal(items)
    notifyRefresh()
    return
  }

  const cartRef = getFirestoreCartRef()
  await runTransaction(db, async (transaction) => {
    const cartDoc = await transaction.get(cartRef)
    const items = cartDoc.exists() ? cartDoc.data().items || [] : []
    
    // Cleanup any existing legacy images in the array to shrink document immediately
    const cleanItems = items.map(({ base64Image, ...rest }) => rest)

    const itemKey = createItemKey(productId, variantId, variant.color, variant.size)
    const itemIndex = cleanItems.findIndex((item) => item.cartKey === itemKey)
    const itemPayload = createPayload(cleanItems, itemIndex)

    if (itemIndex >= 0) {
      cleanItems[itemIndex] = itemPayload
    } else {
      cleanItems.push(itemPayload)
    }

    transaction.set(cartRef, { items: cleanItems, updatedAt: new Date() }, { merge: true })
  })
  
  notifyRefresh()
}

export const updateCartItemQuantity = async ({ variantId, cartKey, quantity }) => {
  if (!auth.currentUser) {
    const items = readCartItemsFromLocal()
    const itemIndex = cartKey 
      ? items.findIndex((item) => item.cartKey === cartKey)
      : items.findIndex((item) => item.id === variantId)

    if (itemIndex < 0) return

    if (quantity <= 0) {
      items.splice(itemIndex, 1)
    } else {
      items[itemIndex] = { ...items[itemIndex], quantity: Number(quantity) }
    }
    writeCartItemsToLocal(items)
    notifyRefresh()
    return
  }

  const cartRef = getFirestoreCartRef()
  await runTransaction(db, async (transaction) => {
    const cartDoc = await transaction.get(cartRef)
    if (!cartDoc.exists()) return

    const items = cartDoc.data().items || []
    const cleanItems = items.map(({ base64Image, ...rest }) => rest)
    
    const itemIndex = cartKey 
      ? cleanItems.findIndex((item) => item.cartKey === cartKey)
      : cleanItems.findIndex((item) => item.id === variantId)

    if (itemIndex < 0) return

    if (quantity <= 0) {
      cleanItems.splice(itemIndex, 1)
    } else {
      cleanItems[itemIndex] = { ...cleanItems[itemIndex], quantity: Number(quantity) }
    }

    transaction.set(cartRef, { items: cleanItems, updatedAt: new Date() }, { merge: true })
  })
  
  notifyRefresh()
}

export const removeCartItem = async ({ variantId, cartKey }) => {
  if (!auth.currentUser) {
    const items = readCartItemsFromLocal()
    const filteredItems = cartKey
      ? items.filter((item) => item.cartKey !== cartKey)
      : items.filter((item) => item.id !== variantId)
    writeCartItemsToLocal(filteredItems)
    notifyRefresh()
    return
  }

  const cartRef = getFirestoreCartRef()
  await runTransaction(db, async (transaction) => {
    const cartDoc = await transaction.get(cartRef)
    if (!cartDoc.exists()) return

    const items = cartDoc.data().items || []
    const filteredItems = cartKey
      ? items.filter((item) => item.cartKey !== cartKey).map(({ base64Image, ...rest }) => rest)
      : items.filter((item) => item.id !== variantId).map(({ base64Image, ...rest }) => rest)

    transaction.set(cartRef, { items: filteredItems, updatedAt: new Date() }, { merge: true })
  })
  
  notifyRefresh()
}

export const clearCart = async () => {
  if (!auth.currentUser) {
    writeCartItemsToLocal([])
    notifyRefresh()
    return
  }

  const cartRef = getFirestoreCartRef()
  await setDoc(cartRef, { items: [], updatedAt: new Date() }, { merge: true })
  notifyRefresh()
}

export const syncCartOnLogin = async () => {
  const localItems = readCartItemsFromLocal()
  if (localItems.length === 0) return

  const cartRef = getFirestoreCartRef()
  if (!cartRef) return

  try {
    await runTransaction(db, async (transaction) => {
      const cartDoc = await transaction.get(cartRef)
      const dbItems = cartDoc.exists() ? cartDoc.data().items || [] : []
      
      const mergedItems = dbItems.map(({ base64Image, ...rest }) => rest)
      localItems.forEach(localItem => {
        const { base64Image, ...cleanLocalItem } = localItem
        const cartKey = cleanLocalItem.cartKey || createItemKey(cleanLocalItem.productId, cleanLocalItem.variantId, cleanLocalItem.color, cleanLocalItem.size)
        const existingIndex = mergedItems.findIndex(item => {
          const dbCartKey = item.cartKey || createItemKey(item.productId, item.variantId, item.color, item.size)
          return dbCartKey === cartKey
        })
        
        if (existingIndex >= 0) {
          mergedItems[existingIndex].quantity += cleanLocalItem.quantity
        } else {
          cleanLocalItem.cartKey = cartKey
          mergedItems.push(cleanLocalItem)
        }
      })

      transaction.set(cartRef, { items: mergedItems, updatedAt: new Date() }, { merge: true })
    })

    writeCartItemsToLocal([])
    notifyRefresh()
  } catch (error) {
    console.error('Error syncing cart:', error)
  }
}
