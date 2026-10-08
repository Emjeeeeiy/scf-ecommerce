<template>
  <AdminPanelLayout>
    <div class="space-y-4 sm:space-y-5">
      <AdminPageHead
        eyebrow="Catalog"
        title="Products"
        :description="`${products.length} ${products.length === 1 ? 'item' : 'items'} in your catalog.`"
      >
        <template #actions>
          <button @click="openAddModal" class="admin-btn admin-btn-primary w-full sm:w-auto">
            <Plus :size="15" />
            <span>Add product</span>
          </button>
        </template>
      </AdminPageHead>

      <!-- Toolbar -->
      <div class="admin-card flex flex-col gap-2.5 p-3 sm:p-4 lg:flex-row lg:items-center">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="admin-search"
          />
        </div>
        <select
          v-model="selectedCategoryId"
          class="admin-field lg:w-52"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Product table -->
      <div class="admin-card overflow-hidden">
        <div class="admin-card-table-wrap overflow-x-auto">
          <table class="admin-card-table w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr class="border-b border-neutral-100 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/40">
                <th class="admin-th">Product</th>
                <th class="admin-th">Category</th>
                <th class="admin-th text-center">Student price</th>
                <th class="admin-th text-center">Regular price</th>
                <th class="admin-th text-center">Stock</th>
                <th class="admin-th">Status</th>
                <th class="admin-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr v-if="loading" v-for="i in 5" :key="i">
                <td colspan="7" class="px-5 py-6">
                  <div class="flex animate-pulse items-center gap-3">
                    <div class="h-10 w-10 rounded-md bg-neutral-100 dark:bg-neutral-800"></div>
                    <div class="flex-1 space-y-1.5">
                      <div class="h-3.5 w-1/4 rounded bg-neutral-100 dark:bg-neutral-800"></div>
                      <div class="h-2.5 w-1/6 rounded bg-neutral-50 dark:bg-neutral-800"></div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-else-if="pagedProducts.length"
                v-for="product in pagedProducts"
                :key="product.id"
                class="transition hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30"
              >
                <td class="px-5 py-3" data-label="Product">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                      <img v-if="product.base64Image" :src="product.base64Image" :alt="product.name" loading="lazy" decoding="async" class="h-full w-full object-cover" />
                      <div v-else class="flex h-full items-center justify-center text-neutral-300 dark:text-neutral-600">
                        <Image :size="16" stroke-width="1.5" />
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-bold tracking-tight text-neutral-900 dark:text-white">{{ product.name }}</p>
                      <p class="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">ID: {{ product.id.slice(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-3" data-label="Category">
                  <span class="admin-pill border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                    {{ categoryName(product.categoryId) || 'Uncategorized' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-center" data-label="Student price">
                  <p class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{{ formatCurrency(product.studentPrice) }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-center" data-label="Regular price">
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">{{ formatCurrency(product.nonStudentPrice) }}</p>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-center" data-label="Stock">
                  <div class="inline-flex flex-col items-center">
                    <span class="text-sm font-bold text-neutral-900 dark:text-white">{{ product.variants?.length || 0 }}</span>
                    <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">SKUs</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-5 py-3" data-label="Status">
                  <span class="inline-flex items-center gap-1.5">
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="{
                        'bg-emerald-500': product.status === 'active',
                        'bg-neutral-300 dark:bg-neutral-600': product.status === 'draft',
                        'bg-rose-500': product.status === 'archived'
                      }"
                    ></span>
                    <span class="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">{{ product.status }}</span>
                  </span>
                </td>
                <td class="whitespace-nowrap px-5 py-3 text-right" data-label="Actions">
                  <div class="flex justify-end gap-1">
                    <button
                      @click="startEdit(product)"
                      title="Edit product"
                      aria-label="Edit product"
                      class="admin-icon-btn h-8 w-8"
                    >
                      <Edit3 :size="14" />
                    </button>
                    <button
                      @click="handleDeleteProduct(product.id)"
                      title="Delete product"
                      aria-label="Delete product"
                      class="admin-icon-btn h-8 w-8 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="px-5 py-16 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="mb-3 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                      <PackageSearch :size="28" stroke-width="1.5" class="text-neutral-300 dark:text-neutral-600" />
                    </div>
                    <p class="admin-card-title">No products found</p>
                    <p class="admin-muted mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :total-pages="totalPages" :total-items="totalFilteredProducts" @update:page="goToPage" />
      </div>
    </div>

    <!-- Centered Product Modal (Compact) -->
    <Transition name="modal">
      <div v-if="isEditorOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4 overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-500" @click="closeEditor"></div>
        
        <!-- Modal Content -->
        <div class="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:px-6">
            <div>
              <h2 class="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                {{ editingProductId ? 'Edit product' : 'New product' }}
              </h2>
              <p class="admin-eyebrow mt-0.5">
                Catalog management
              </p>
            </div>
            <button @click="closeEditor" title="Close" aria-label="Close" class="admin-icon-btn">
              <X :size="18" />
            </button>
          </div>

          <!-- Content (Scrollable) -->
          <div class="flex-1 overflow-y-auto bg-neutral-50/50 px-5 py-5 dark:bg-neutral-950/30 sm:px-6">
            <form id="product-form" @submit.prevent="handleSaveProduct" class="space-y-8 pb-6">
              <!-- Layout Grid -->
              <div class="grid gap-8 lg:grid-cols-[220px_1fr]">
                <!-- Left: Media -->
                <div class="space-y-6">
                  <div class="group relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-500 hover:border-neutral-400">
                    <img v-if="form.base64Image" :src="form.base64Image" class="h-full w-full object-cover" />
                    <div v-else class="flex flex-col items-center gap-2 text-neutral-300 dark:text-neutral-600">
                      <Upload :size="32" stroke-width="1" />
                      <span class="text-[10px] font-bold uppercase">Upload</span>
                    </div>
                    
                    <label class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Camera :size="20" class="text-white mb-1" />
                      <span class="text-[10px] font-bold text-white uppercase tracking-widest">Change</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                    </label>
                  </div>

                  <div class="space-y-4">
                    <label class="block">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Student Price</span>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">₱</span>
                        <input v-model.number="form.studentPrice" type="number" min="0" required class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-8 py-3 text-lg font-bold  focus:border-neutral-400 focus:ring-4 focus:ring-neutral-400/10 outline-none transition-all" />
                      </div>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Regular Price</span>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">₱</span>
                        <input v-model.number="form.nonStudentPrice" type="number" min="0" required class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-8 py-3 text-lg font-bold  focus:border-neutral-400 focus:ring-4 focus:ring-neutral-400/10 outline-none transition-all" />
                      </div>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</span>
                      <select v-model="form.status" class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-4 py-3 text-xs font-bold  focus:border-neutral-400 outline-none">
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                  </div>
                </div>

                <!-- Right: Details -->
                <div class="space-y-6">
                  <div class="grid gap-4 md:grid-cols-2">
                    <label class="block md:col-span-2">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Product Name</span>
                      <input v-model="form.name" required placeholder="Name your product..." class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-3.5 text-sm font-bold  focus:border-neutral-400 outline-none transition-all" />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</span>
                      <select v-model="form.categoryId" class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-3.5 text-xs font-bold  focus:border-neutral-400 outline-none cursor-pointer">
                        <option value="">Uncategorized</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                      </select>
                    </label>

                    <label class="block md:col-span-2">
                      <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Description</span>
                      <textarea v-model="form.description" rows="3" placeholder="Tell the story..." class="w-full rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-4 text-xs font-medium  focus:border-neutral-400 outline-none resize-none transition-all"></textarea>
                    </label>
                  </div>

                  <!-- Variants Section (Compact) -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <h3 class="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white">Inventory Variants</h3>
                      <button type="button" @click="addVariantRow" class="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white">+ Add color</button>
                    </div>

                    <div class="grid gap-4">
                      <div v-for="(variant, vIndex) in form.variants" :key="vIndex" class="group/variant relative rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-all">
                        <div class="mb-4 flex items-center justify-between gap-4">
                          <div class="flex-1">
                            <label class="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Color</label>
                            <input v-model="variant.color" placeholder="e.g. Midnight Black" class="w-full rounded-lg bg-neutral-50 dark:bg-neutral-800 border-none px-4 py-2 text-xs font-bold " />
                          </div>
                          <button type="button" @click="removeVariantRow(vIndex)" class="mt-4 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 :size="14" />
                          </button>
                        </div>

                        <div class="space-y-2">
                          <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="flex gap-2 items-center">
                            <input v-model="option.size" placeholder="Size" class="flex-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-none px-4 py-2 text-[10px] font-bold " />
                            <input v-model.number="option.stock" type="number" min="0" placeholder="Qty" class="w-20 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-none px-4 py-2 text-[10px] font-bold text-center " />
                            <button type="button" @click="removeOptionRow(vIndex, oIndex)" class="p-1.5 text-neutral-200 hover:text-red-500">
                              <X :size="14" />
                            </button>
                            <button v-if="oIndex === variant.options.length - 1" type="button" @click="addOptionRow(vIndex)" class="p-1.5 text-neutral-500">
                              <Plus :size="14" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer Actions -->
          <div class="border-t border-neutral-100 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
            <div class="mx-auto flex max-w-md gap-2.5">
              <button @click="closeEditor" type="button" class="admin-btn admin-btn-quiet flex-1">
                Cancel
              </button>
              <button :disabled="saving" form="product-form" type="submit" class="admin-btn admin-btn-primary flex-[1.5] disabled:cursor-not-allowed disabled:opacity-50">
                <span v-if="saving" class="flex items-center justify-center gap-2">
                  <Loader2 class="animate-spin" :size="16" />
                  Saving...
                </span>
                <span v-else>
                  {{ editingProductId ? 'Save Changes' : 'Publish Product' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </AdminPanelLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  Image,
  Plus,
  X,
  Edit3,
  Trash2,
  PackageSearch,
  Search,
  Upload,
  Camera,
  Loader2
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import AdminPageHead from '../../components/AdminPageHead.vue'
import Pagination from '../../components/Pagination.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useSearchFilter } from '../../composables/useSearchFilter'
import { usePagination } from '../../composables/usePagination'
import { formatCurrency, sortSizes } from '../../utils/format'
import { useConfirmAction } from '../../composables/useConfirmAction'
import { useToast } from '../../composables/useToast'

const { confirmAndRun } = useConfirmAction()
const toast = useToast()
const {
  products,
  categories,
  productsLoading: loading,
  loadCatalog,
  categoryName,
  createProduct,
  updateProduct,
  deleteProduct,
} = useCatalogStore()

const saving = ref(false)
const isEditorOpen = ref(false)
const editingProductId = ref('')
const selectedCategoryId = ref('')

const categoryFiltered = computed(() =>
  selectedCategoryId.value
    ? products.value.filter((p) => p.categoryId === selectedCategoryId.value)
    : products.value,
)
const { query: searchQuery, filtered: filteredProducts } = useSearchFilter(categoryFiltered, (product) => [
  product.name,
  product.description,
])

const { page, totalPages, totalItems: totalFilteredProducts, paged: pagedProducts, goToPage, resetPage } = usePagination(filteredProducts, 20)
watch([searchQuery, selectedCategoryId], resetPage)

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const DEFAULT_STOCK = 10

const createBlankOption = (size = '', stock = DEFAULT_STOCK) => ({ size, stock })
const createBlankVariant = () => ({ 
  color: '', 
  options: DEFAULT_SIZES.map(size => createBlankOption(size, DEFAULT_STOCK)) 
})

const form = reactive({
  name: '',
  description: '',
  studentPrice: 0,
  nonStudentPrice: 0,
  status: 'active',
  categoryId: '',
  base64Image: '',
  variants: [createBlankVariant()],
})

const loadData = async () => {
  try {
    await loadCatalog(true)
  } catch (error) {
    console.error('Failed to load data:', error)
    toast.error('Failed to load catalog data.')
  }
}

const openAddModal = () => {
  resetForm()
  isEditorOpen.value = true
}

const closeEditor = () => {
  if (saving.value) return
  isEditorOpen.value = false
  resetForm()
}

const resetForm = () => {
  editingProductId.value = ''
  form.name = ''
  form.description = ''
  form.studentPrice = 0
  form.nonStudentPrice = 0
  form.status = 'active'
  form.categoryId = ''
  form.base64Image = ''
  form.variants = [createBlankVariant()]
}

const addVariantRow = () => {
  form.variants.push(createBlankVariant())
}

const removeVariantRow = (index) => {
  if (form.variants.length === 1) {
    form.variants[0] = createBlankVariant()
    return
  }
  form.variants.splice(index, 1)
}

const addOptionRow = (variantIndex) => {
  form.variants[variantIndex].options.push(createBlankOption())
}

const removeOptionRow = (variantIndex, optionIndex) => {
  if (form.variants[variantIndex].options.length === 1) {
    form.variants[variantIndex].options[0] = createBlankOption()
    return
  }
  form.variants[variantIndex].options.splice(optionIndex, 1)
}

const sanitizedVariants = () => {
  const flattened = []
  form.variants.forEach(v => {
    v.options.forEach(o => {
      // Only include variants that have at least a color OR a size OR stock > 0
      if ((v.color && v.color.trim()) || (o.size && o.size.trim()) || Number(o.stock) > 0) {
        flattened.push({
          color: (v.color || '').trim(),
          size: (o.size || '').trim(),
          stock: Math.max(0, Number(o.stock || 0))
        })
      }
    })
  })
  return flattened
}

const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    if (!base64Str || base64Str.startsWith('data:image/svg+xml')) {
      resolve(base64Str)
      return
    }

    const img = new window.Image()
    img.src = base64Str
    img.onerror = () => resolve(base64Str)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
  })
}

const handleSaveProduct = async () => {
  if (saving.value) return
  
  const variants = sanitizedVariants()
  if (variants.length === 0) {
    toast.warning('Please add at least one variant (color/size/stock).')
    return
  }

  saving.value = true
  
  try {
    const finalImage = await compressImage(form.base64Image)
    
    const payload = {
      name: form.name.trim(),
      description: (form.description || '').trim(),
      studentPrice: Number(form.studentPrice || 0),
      nonStudentPrice: Number(form.nonStudentPrice || 0),
      status: form.status,
      categoryId: form.categoryId,
      base64Image: (finalImage || '').trim(),
      variants: variants,
    }

    if (editingProductId.value) {
      await updateProduct(editingProductId.value, payload)
      toast.success('Product updated successfully.')
    } else {
      await createProduct(payload)
      toast.success('Product published successfully.')
    }
    
    isEditorOpen.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    if (error.code === 'resource-exhausted') {
      toast.error('Product data too large. Try a smaller image or fewer variants.')
    } else {
      toast.error('Failed to save product. Please try again.')
    }
  } finally {
    saving.value = false
  }
}

const handleDeleteProduct = (productId) =>
  confirmAndRun(
    'Delete this product? This will also remove all its variants.',
    () => deleteProduct(productId),
    { successMessage: 'Product deleted.', errorMessage: 'Failed to delete product.' },
  )

const startEdit = (product) => {
  editingProductId.value = product.id
  form.name = product.name
  form.description = product.description
  form.studentPrice = Number(product.studentPrice || 0)
  form.nonStudentPrice = Number(product.nonStudentPrice || 0)
  form.status = product.status || 'active'
  form.categoryId = product.categoryId || ''
  form.base64Image = product.base64Image || ''

  // Group flat variants by color
  const grouped = []
  if (product.variants?.length) {
    product.variants.forEach(v => {
      let group = grouped.find(g => g.color === (v.color || ''))
      if (!group) {
        group = { color: v.color || '', options: [] }
        grouped.push(group)
      }
      group.options.push({ size: v.size || '', stock: Number(v.stock || 0) })
    })
    
    // Sort options in each group
    grouped.forEach(g => {
      g.options = sortSizes(g.options)
    })
  }

  form.variants = grouped.length ? grouped : [createBlankVariant()]
  isEditorOpen.value = true
}

const handleImageUpload = (event) => {
  const [file] = event.target.files || []
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    form.base64Image = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

onMounted(loadData)
</script>


<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>