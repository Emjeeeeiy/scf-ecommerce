<template>
  <AdminPanelLayout subtitle="Manage your product catalog, pricing, and inventory variants.">
    <div class="relative flex h-full flex-col">
      <!-- Fixed Header Section -->
      <div class="sticky top-0 z-30 -mx-6 -mt-6 bg-[#f8fafc]/90 dark:bg-neutral-950/90 px-6 py-4 backdrop-blur-md border-b border-slate-200/50 dark:border-neutral-800/50">
        <div class="mx-auto max-w-6xl">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-1 items-center gap-2">
              <div class="relative flex-1 max-w-sm">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search products..." 
                  class="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-4 py-2 text-sm font-medium shadow-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
                />
              </div>
              <select 
                v-model="selectedCategoryId" 
                class="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-neutral-300 shadow-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <button 
              @click="openAddModal"
              class="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-amber-400 px-5 py-2 text-xs font-black text-white dark:text-neutral-950 shadow-lg shadow-slate-200 dark:shadow-none transition hover:bg-slate-800 dark:hover:bg-amber-300 active:scale-95"
            >
              <Plus :size="16" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Clean Product Table -->
      <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-slate-200/40 dark:shadow-none">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">Product</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">Category</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500 text-center">Student Price</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500 text-center">Regular Price</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500 text-center">Inventory</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500">Status</th>
                <th class="sticky top-0 z-10 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/50 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-neutral-800/50">
              <tr v-if="loading" v-for="i in 5" :key="i">
                <td colspan="7" class="px-6 py-6">
                  <div class="flex items-center gap-3 animate-pulse">
                    <div class="h-10 w-10 rounded-xl bg-slate-100 dark:bg-neutral-800"></div>
                    <div class="flex-1 space-y-1.5">
                      <div class="h-3.5 w-1/4 rounded bg-slate-100 dark:bg-neutral-800"></div>
                      <div class="h-2.5 w-1/6 rounded bg-slate-50 dark:bg-neutral-900"></div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr 
                v-else-if="filteredProducts.length"
                v-for="product in filteredProducts" 
                :key="product.id"
                class="group hover:bg-slate-50/30 dark:hover:bg-neutral-800/20 transition-all duration-300"
              >
                <td class="px-6 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200/50 dark:border-neutral-700 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <img v-if="product.base64Image" :src="product.base64Image" :alt="product.name" class="h-full w-full object-cover" />
                      <div v-else class="flex h-full items-center justify-center text-slate-300 dark:text-neutral-600">
                        <Image :size="18" stroke-width="1.5" />
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-black text-slate-950 dark:text-white tracking-tight">{{ product.name }}</p>
                      <p class="mt-0.5 truncate text-[9px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">ID: {{ product.id.slice(0, 8) }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-3.5">
                  <span class="inline-flex rounded-lg bg-slate-100 dark:bg-neutral-800 px-2 py-1 text-[9px] font-black text-slate-600 dark:text-neutral-400 uppercase tracking-tighter">
                    {{ categoryName(product.categoryId) || 'Uncategorized' }}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-center">
                  <p class="text-sm font-black text-amber-600 dark:text-amber-400">{{ formatCurrency(product.studentPrice) }}</p>
                </td>
                <td class="px-6 py-3.5 text-center">
                  <p class="text-sm font-black text-slate-950 dark:text-white">{{ formatCurrency(product.nonStudentPrice) }}</p>
                </td>
                <td class="px-6 py-3.5 text-center">
                  <div class="inline-flex flex-col items-center">
                    <span class="text-xs font-black text-slate-900 dark:text-white">{{ product.variants?.length || 0 }}</span>
                    <span class="text-[8px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">SKUs</span>
                  </div>
                </td>
                <td class="px-6 py-3.5">
                  <div class="flex items-center gap-1.5">
                    <div 
                      class="h-1.5 w-1.5 rounded-full"
                      :class="{
                        'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]': product.status === 'active',
                        'bg-slate-300': product.status === 'draft',
                        'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]': product.status === 'archived'
                      }"
                    ></div>
                    <span class="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-neutral-400">{{ product.status }}</span>
                  </div>
                </td>
                <td class="px-6 py-3.5 text-right">
                  <div class="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      @click="startEdit(product)"
                      class="p-2 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-950 dark:hover:bg-amber-400 hover:text-white dark:hover:text-neutral-950 transition-all active:scale-90"
                    >
                      <Edit3 :size="14" />
                    </button>
                    <button 
                      @click="handleDeleteProduct(product.id)"
                      class="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="mb-4 rounded-3xl bg-slate-50 dark:bg-neutral-800 p-6">
                      <PackageSearch :size="48" stroke-width="1" class="text-slate-200 dark:text-neutral-700" />
                    </div>
                    <h3 class="text-base font-black text-slate-900 dark:text-white tracking-tight">No products found</h3>
                    <p class="mt-1 text-xs font-medium text-slate-500 dark:text-neutral-400">Try adjusting your filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Centered Product Modal (Compact) -->
    <Transition name="modal">
      <div v-if="isEditorOpen" class="fixed inset-0 z-1000 flex items-center justify-center p-4 overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-500" @click="closeEditor"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-3xl bg-white dark:bg-neutral-900 shadow-2xl rounded-4xl flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-500 overflow-hidden border border-white/20 dark:border-neutral-800">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 px-8 py-5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ editingProductId ? 'Edit Product' : 'New Product' }}
              </h2>
              <p class="text-[9px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Catalog Management
              </p>
            </div>
            <button @click="closeEditor" class="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90">
              <X :size="20" />
            </button>
          </div>

          <!-- Content (Scrollable) -->
          <div class="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-slate-50/30 dark:bg-neutral-950/20">
            <form id="product-form" @submit.prevent="handleSaveProduct" class="space-y-8 pb-6">
              <!-- Layout Grid -->
              <div class="grid gap-8 lg:grid-cols-[220px_1fr]">
                <!-- Left: Media -->
                <div class="space-y-6">
                  <div class="group relative aspect-square overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border-2 border-dashed border-slate-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-500 hover:border-amber-400">
                    <img v-if="form.base64Image" :src="form.base64Image" class="h-full w-full object-cover" />
                    <div v-else class="flex flex-col items-center gap-2 text-slate-300 dark:text-neutral-600">
                      <Upload :size="32" stroke-width="1" />
                      <span class="text-[8px] font-black uppercase">Upload</span>
                    </div>
                    
                    <label class="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Camera :size="20" class="text-white mb-1" />
                      <span class="text-[8px] font-black text-white uppercase tracking-widest">Change</span>
                      <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                    </label>
                  </div>

                  <div class="space-y-4">
                    <label class="block">
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Student Price</span>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₱</span>
                        <input v-model.number="form.studentPrice" type="number" min="0" required class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-8 py-3 text-lg font-black shadow-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all" />
                      </div>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Regular Price</span>
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₱</span>
                        <input v-model.number="form.nonStudentPrice" type="number" min="0" required class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-8 py-3 text-lg font-black shadow-sm focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all" />
                      </div>
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                      <select v-model="form.status" class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-4 py-3 text-xs font-bold shadow-sm focus:border-amber-400 outline-none">
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
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</span>
                      <input v-model="form.name" required placeholder="Name your product..." class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-3.5 text-sm font-black shadow-sm focus:border-amber-400 outline-none transition-all" />
                    </label>

                    <label class="block">
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Category</span>
                      <select v-model="form.categoryId" class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-3.5 text-xs font-black shadow-sm focus:border-amber-400 outline-none cursor-pointer">
                        <option value="">Uncategorized</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                      </select>
                    </label>

                    <label class="block md:col-span-2">
                      <span class="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Description</span>
                      <textarea v-model="form.description" rows="3" placeholder="Tell the story..." class="w-full rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 px-6 py-4 text-xs font-medium shadow-sm focus:border-amber-400 outline-none resize-none transition-all"></textarea>
                    </label>
                  </div>

                  <!-- Variants Section (Compact) -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
                      <h3 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Inventory Variants</h3>
                      <button type="button" @click="addVariantRow" class="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:underline">+ Add Color</button>
                    </div>

                    <div class="grid gap-4">
                      <div v-for="(variant, vIndex) in form.variants" :key="vIndex" class="group/variant relative rounded-2xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-all">
                        <div class="mb-4 flex items-center justify-between gap-4">
                          <div class="flex-1">
                            <label class="mb-1 block text-[8px] font-black uppercase tracking-widest text-slate-400">Color</label>
                            <input v-model="variant.color" placeholder="e.g. Midnight Black" class="w-full rounded-xl bg-slate-50 dark:bg-neutral-800 border-none px-4 py-2 text-xs font-black shadow-inner" />
                          </div>
                          <button type="button" @click="removeVariantRow(vIndex)" class="mt-4 p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 :size="14" />
                          </button>
                        </div>

                        <div class="space-y-2">
                          <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="flex gap-2 items-center">
                            <input v-model="option.size" placeholder="Size" class="flex-1 rounded-xl bg-slate-50 dark:bg-neutral-800 border-none px-4 py-2 text-[10px] font-bold shadow-inner" />
                            <input v-model.number="option.stock" type="number" min="0" placeholder="Qty" class="w-20 rounded-xl bg-slate-50 dark:bg-neutral-800 border-none px-4 py-2 text-[10px] font-black text-center shadow-inner" />
                            <button type="button" @click="removeOptionRow(vIndex, oIndex)" class="p-1.5 text-slate-200 hover:text-red-500">
                              <X :size="14" />
                            </button>
                            <button v-if="oIndex === variant.options.length - 1" type="button" @click="addOptionRow(vIndex)" class="p-1.5 text-amber-500">
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
          <div class="border-t border-slate-100 dark:border-neutral-800 px-8 py-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
            <div class="flex gap-3 max-w-md mx-auto">
              <button @click="closeEditor" type="button" class="flex-1 rounded-xl border-2 border-slate-100 dark:border-neutral-800 py-3 text-xs font-black text-slate-400 hover:border-slate-200 transition-all">
                Cancel
              </button>
              <button :disabled="saving" form="product-form" type="submit" class="flex-[1.5] rounded-xl bg-slate-900 dark:bg-amber-400 py-3 text-xs font-black text-white dark:text-neutral-950 shadow-lg shadow-slate-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
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
import { computed, onMounted, reactive, ref } from 'vue'
import { 
  Image, 
  Boxes, 
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
import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  updateProduct,
} from '../../services/catalogService'
import { formatCurrency, sortSizes } from '../../utils/format'
import { useConfirm } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'

const { confirm } = useConfirm()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const isEditorOpen = ref(false)
const searchQuery = ref('')
const categories = ref([])
const products = ref([])
const editingProductId = ref('')
const selectedCategoryId = ref('')

const filteredProducts = computed(() => {
  let items = products.value
  
  if (selectedCategoryId.value) {
    items = items.filter(p => p.categoryId === selectedCategoryId.value)
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q)
    )
  }
  
  return items
})

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
  loading.value = true
  try {
    const [cats, prods] = await Promise.all([listCategories(), listProducts()])
    categories.value = cats
    products.value = prods
  } catch (error) {
    console.error('Failed to load data:', error)
    toast.error('Failed to load catalog data.')
  } finally {
    loading.value = false
  }
}

const categoryName = (categoryId) =>
  categories.value.find((category) => category.id === categoryId)?.name || ''

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
    await loadData()
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

const handleDeleteProduct = async (productId) => {
  if (await confirm('Delete this product? This will also remove all its variants.')) {
    try {
      await deleteProduct(productId)
      toast.success('Product deleted.')
      await loadData()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete product.')
    }
  }
}

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
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #262626;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .zoom-in-95 {
  animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoom-in {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>