import { ref } from 'vue'
import {
  createCategory as createCategoryService,
  createProduct as createProductService,
  deleteCategory as deleteCategoryService,
  deleteProduct as deleteProductService,
  ensureDemoCatalog,
  getProduct,
  listCategories,
  listProducts,
  updateProduct as updateProductService,
} from '../services/catalogService'

/**
 * Centralized products + categories state (module-level singleton, same pattern
 * as useSession/cartStore). Admin/Products, Admin/Categories, Admin/Dashboard and
 * the storefront Catalog page all previously fetched their own copies of this data
 * independently on every mount; now they share one cache, and any admin mutation
 * (create/update/delete) refreshes it for every open view.
 */
const products = ref([])
const categories = ref([])
const productsLoading = ref(false)
const categoriesLoading = ref(false)
let loaded = false

const refreshProducts = async () => {
  productsLoading.value = true
  try {
    products.value = await listProducts()
  } finally {
    productsLoading.value = false
  }
}

const refreshCategories = async () => {
  categoriesLoading.value = true
  try {
    categories.value = await listCategories()
  } finally {
    categoriesLoading.value = false
  }
}

// Cached after first load; pass force: true (or call refreshProducts/refreshCategories
// directly) when a view needs a guaranteed-fresh read instead of the shared cache.
const loadCatalog = async (force = false) => {
  if (loaded && !force) return
  await Promise.all([refreshCategories(), refreshProducts()])
  loaded = true
}

const categoryName = (categoryId) =>
  categories.value.find((category) => category.id === categoryId)?.name || ''

const lowStockVariants = (threshold = 5) => {
  const items = []
  products.value.forEach((product) => {
    product.variants?.forEach((variant) => {
      if (Number(variant.stock || 0) <= threshold) {
        items.push({
          variantKey: `${product.id}-${variant.id}`,
          productId: product.id,
          name: product.name,
          image: product.base64Image,
          color: variant.color || 'Std',
          size: variant.size || 'Std',
          stock: Number(variant.stock || 0),
        })
      }
    })
  })
  return items.sort((a, b) => a.stock - b.stock)
}

export function useCatalogStore() {
  return {
    products,
    categories,
    productsLoading,
    categoriesLoading,
    loadCatalog,
    refreshProducts,
    refreshCategories,
    categoryName,
    lowStockVariants,

    // One-time seeding for empty storefronts; safe to call repeatedly (no-op once categories exist).
    seedDemoCatalog: ensureDemoCatalog,

    // Always hits the network for up-to-date stock/pricing, and syncs the result into the shared cache.
    fetchProduct: async (productId) => {
      const product = await getProduct(productId)
      if (product) {
        const index = products.value.findIndex((item) => item.id === product.id)
        if (index >= 0) {
          products.value[index] = product
        } else {
          products.value.push(product)
        }
      }
      return product
    },

    createProduct: async (payload) => {
      const id = await createProductService(payload)
      await refreshProducts()
      return id
    },
    updateProduct: async (productId, payload) => {
      await updateProductService(productId, payload)
      await refreshProducts()
    },
    deleteProduct: async (productId) => {
      await deleteProductService(productId)
      await refreshProducts()
    },

    createCategory: async (name) => {
      const id = await createCategoryService(name)
      await refreshCategories()
      return id
    },
    deleteCategory: async (categoryId) => {
      await deleteCategoryService(categoryId)
      await refreshCategories()
    },
  }
}
