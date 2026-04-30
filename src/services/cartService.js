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

const readCartItems = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeCartItems = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export const getCart = async () => {
  const items = readCartItems()
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

  const items = readCartItems()
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

  writeCartItems(items)
  notifyRefresh()
}

export const updateCartItemQuantity = async ({ variantId, quantity }) => {
  const items = readCartItems()
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

  writeCartItems(items)
  notifyRefresh()
}

export const removeCartItem = async ({ variantId }) => {
  const items = readCartItems().filter((item) => item.id !== variantId)
  writeCartItems(items)
  notifyRefresh()
}

export const clearCart = async () => {
  writeCartItems([])
  notifyRefresh()
}
