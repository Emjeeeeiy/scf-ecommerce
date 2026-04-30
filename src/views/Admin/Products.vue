<template>
  <AdminPanelLayout subtitle="Create products and variant inventory entries">
    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              <PackagePlus :size="14" />
              <span>Product editor</span>
            </div>
            <h2 class="mt-2 text-xl font-black text-slate-900 tracking-tight">
              {{ editingProductId ? 'Edit product' : 'Create product' }}
            </h2>
            <p class="mt-2 text-xs font-medium text-slate-500 leading-relaxed">
              Manage pricing, descriptions, and variant-level stock.
            </p>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight border border-slate-100">
            {{ categories.length }} categories
          </div>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleSaveProduct">
          <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">Preview</p>
              <div class="relative overflow-hidden rounded-xl bg-white aspect-square shadow-inner flex items-center justify-center border border-slate-100">
                <img
                  v-if="form.base64Image"
                  :src="form.base64Image"
                  alt="Product preview"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex flex-col items-center gap-2 text-slate-200">
                  <Image :size="32" class="opacity-20" />
                  <span class="text-[10px] font-bold uppercase">No image</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block">
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Upload image</span>
                <div class="relative">
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all cursor-pointer"
                    @change="handleImageUpload"
                  />
                </div>
              </label>

              <label class="block">
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Base64 string (optional)</span>
                <textarea
                  v-model="form.base64Image"
                  class="min-h-24 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 font-mono text-[10px] text-slate-500 focus:ring-1 focus:ring-amber-400"
                  placeholder="Paste image string..."
                ></textarea>
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <label class="block">
              <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Product Name</span>
              <input v-model="form.name" class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-amber-400" required />
            </label>

            <label class="block">
              <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</span>
              <textarea v-model="form.description" class="min-h-24 w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-700 focus:ring-1 focus:ring-amber-400"></textarea>
            </label>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Base price</span>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span class="text-sm font-bold">₱</span>
                  </div>
                  <input v-model.number="form.basePrice" type="number" min="0" class="w-full rounded-xl border border-slate-100 bg-slate-50/50 pl-8 pr-4 py-3 text-sm font-black text-slate-950 focus:ring-1 focus:ring-amber-400" required />
                </div>
              </label>

              <label class="block">
                <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</span>
                <select v-model="form.status" class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-amber-400">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>

            <label class="block">
              <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</span>
              <select v-model="form.categoryId" class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-amber-400">
                <option value="">Uncategorized</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </label>
          </div>

          <div class="rounded-xl bg-slate-50/50 border border-slate-100 p-5">
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Boxes :size="14" class="text-slate-400" />
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inventory Variants</p>
              </div>
              <button type="button" class="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-800 active:scale-95" @click="addVariantRow">
                <Plus :size="12" />
                Add variant
              </button>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="(variant, index) in form.variants"
                :key="index"
                class="group relative grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm"
              >
                <input v-model="variant.color" placeholder="Color" class="w-full bg-slate-50/50 rounded-lg border-none px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-amber-400" />
                <input v-model="variant.size" placeholder="Size" class="w-full bg-slate-50/50 rounded-lg border-none px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-amber-400" />
                <input v-model.number="variant.stock" type="number" min="0" placeholder="0" class="w-full bg-slate-50/50 rounded-lg border-none px-3 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-amber-400" />
                <button type="button" class="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" @click="removeVariantRow(index)">
                  <X :size="14" />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 text-sm font-black text-white shadow-xl shadow-slate-100 transition hover:bg-slate-800 active:scale-[0.98]">
            <Save :size="18" />
            {{ editingProductId ? 'Update product' : 'Create product' }}
          </button>
        </form>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              <List :size="14" />
              <span>Catalog list</span>
            </div>
            <h2 class="mt-1 text-xl font-black text-slate-900 tracking-tight">{{ products.length }} products</h2>
          </div>
          <button
            v-if="editingProductId"
            type="button"
            class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 uppercase"
            @click="resetForm"
          >
            <X :size="12" />
            Cancel Edit
          </button>
        </div>

        <div class="mt-8 space-y-3">
          <article
            v-for="product in products"
            :key="product.id"
            class="group rounded-xl border border-slate-50 bg-white p-3 transition-all hover:border-amber-400 hover:shadow-md"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex min-w-0 gap-4">
                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50/50 shadow-inner border border-slate-50">
                  <img
                    v-if="product.base64Image"
                    :src="product.base64Image"
                    :alt="product.name"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full items-center justify-center text-slate-200">
                    <Image :size="16" />
                  </div>
                </div>

                <div class="min-w-0">
                  <p class="text-[9px] font-black uppercase tracking-[0.1em] text-amber-600">
                    {{ categoryName(product.categoryId) || 'Uncategorized' }}
                  </p>
                  <h2 class="truncate text-sm font-black text-slate-950 tracking-tight">{{ product.name }}</h2>
                  <div class="mt-1 flex items-center gap-3">
                    <span class="text-sm font-black text-slate-900">{{ formatCurrency(product.basePrice) }}</span>
                    <span class="text-[10px] font-bold text-slate-400 bg-slate-50/50 px-2 py-0.5 rounded-lg border border-slate-50">{{ product.variants?.length || 0 }} SKUs</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button type="button" class="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800 active:scale-95 flex items-center gap-1.5" @click="startEdit(product)">
                  <Edit3 :size="12" />
                  Edit
                </button>
                <button type="button" class="flex-1 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-100 active:scale-95 flex items-center gap-1.5" @click="handleDeleteProduct(product.id)">
                  <Trash2 :size="12" />
                  Delete
                </button>
              </div>
            </div>
          </article>

          <div v-if="!products.length" class="flex flex-col items-center justify-center rounded-xl bg-slate-50/30 py-12 text-slate-200 border border-dashed border-slate-200">
            <PackageSearch :size="32" class="opacity-20 mb-2" />
            <p class="text-xs font-medium">Empty catalog</p>
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { 
  PackagePlus, 
  Image, 
  Boxes, 
  Plus, 
  X, 
  Save, 
  List, 
  Edit3, 
  Trash2, 
  PackageSearch 
} from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  updateProduct,
} from '../../services/catalogService'
import { formatCurrency } from '../../utils/format'

const categories = ref([])
const products = ref([])
const editingProductId = ref('')

const createBlankVariant = () => ({ color: '', size: '', stock: 0 })

const form = reactive({
  name: '',
  description: '',
  basePrice: 0,
  status: 'active',
  categoryId: '',
  base64Image: '',
  variants: [createBlankVariant()],
})

const loadData = async () => {
  categories.value = await listCategories()
  products.value = await listProducts()
}

const categoryName = (categoryId) =>
  categories.value.find((category) => category.id === categoryId)?.name || ''

const resetForm = () => {
  editingProductId.value = ''
  form.name = ''
  form.description = ''
  form.basePrice = 0
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

const sanitizedVariants = () =>
  form.variants.filter((variant) => variant.color || variant.size || Number(variant.stock) > 0)

const handleSaveProduct = async () => {
  const payload = {
    name: form.name,
    description: form.description,
    basePrice: form.basePrice,
    status: form.status,
    categoryId: form.categoryId,
    base64Image: form.base64Image.trim(),
    variants: sanitizedVariants(),
  }

  if (editingProductId.value) {
    await updateProduct(editingProductId.value, payload)
  } else {
    await createProduct(payload)
  }

  resetForm()
  await loadData()
}

const handleDeleteProduct = async (productId) => {
  if (confirm('Delete this product?')) {
    await deleteProduct(productId)
    await loadData()
  }
}

const startEdit = (product) => {
  editingProductId.value = product.id
  form.name = product.name
  form.description = product.description
  form.basePrice = Number(product.basePrice || 0)
  form.status = product.status || 'active'
  form.categoryId = product.categoryId || ''
  form.base64Image = product.base64Image || ''
  form.variants = product.variants?.length
    ? product.variants.map((variant) => ({
        color: variant.color || '',
        size: variant.size || '',
        stock: Number(variant.stock || 0),
      }))
    : [createBlankVariant()]
}

const handleImageUpload = (event) => {
  const [file] = event.target.files || []

  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.base64Image = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

onMounted(loadData)
</script>

