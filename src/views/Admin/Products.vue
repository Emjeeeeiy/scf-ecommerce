<template>
  <AdminPanelLayout subtitle="Create products and variant inventory entries">
    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Product editor</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">
              {{ editingProductId ? 'Edit product' : 'Create product' }}
            </h2>
            <p class="mt-2 text-sm text-slate-500">
              Manage pricing, descriptions, category placement, and variant-level stock in one form.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            {{ categories.length }} categories available
          </div>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSaveProduct">
          <div class="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p class="text-sm font-medium text-slate-700">Base64 image preview</p>
              <div class="mt-4 overflow-hidden rounded-2xl bg-slate-200">
                <img
                  v-if="form.base64Image"
                  :src="form.base64Image"
                  alt="Product preview"
                  class="h-56 w-full object-cover"
                />
                <div v-else class="flex h-56 items-center justify-center text-sm text-slate-500">
                  No image yet
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block">
                <span class="mb-2 block text-sm font-medium text-slate-700">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  @change="handleImageUpload"
                />
              </label>

              <label class="block">
                <span class="mb-2 block text-sm font-medium text-slate-700">Base64 image string</span>
                <textarea
                  v-model="form.base64Image"
                  class="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-xs"
                  placeholder="Paste a data:image/...;base64,... string here"
                ></textarea>
              </label>

              <p class="text-xs text-slate-500">
                This product image is stored directly in Firestore as a base64 data URL.
              </p>
            </div>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input v-model="form.name" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea v-model="form.description" class="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"></textarea>
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Base price</span>
              <input v-model.number="form.basePrice" type="number" min="0" class="w-full rounded-2xl border border-slate-200 px-4 py-3" required />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Status</span>
              <select v-model="form.status" class="w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="active">active</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Category</span>
            <select v-model="form.categoryId" class="w-full rounded-2xl border border-slate-200 px-4 py-3">
              <option value="">Uncategorized</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </label>

          <div class="rounded-2xl bg-slate-50 p-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="font-semibold text-slate-900">Variants</p>
              <button type="button" class="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white" @click="addVariantRow">
                Add variant
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(variant, index) in form.variants"
                :key="index"
                class="grid gap-3 md:grid-cols-[1fr_1fr_120px_auto]"
              >
                <input v-model="variant.color" placeholder="Color" class="rounded-2xl border border-slate-200 px-4 py-3" />
                <input v-model="variant.size" placeholder="Size" class="rounded-2xl border border-slate-200 px-4 py-3" />
                <input v-model.number="variant.stock" type="number" min="0" placeholder="Stock" class="rounded-2xl border border-slate-200 px-4 py-3" />
                <button type="button" class="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700" @click="removeVariantRow(index)">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
            {{ editingProductId ? 'Update product' : 'Create product' }}
          </button>
        </form>
      </div>

      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Catalog list</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ products.length }} products</h2>
          </div>
          <button
            v-if="editingProductId"
            type="button"
            class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            @click="resetForm"
          >
            Cancel edit
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <article
            v-for="product in products"
            :key="product.id"
            class="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="flex min-w-0 gap-4">
                <div class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                  <img
                    v-if="product.base64Image"
                    :src="product.base64Image"
                    :alt="product.name"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full items-center justify-center text-[10px] text-slate-500">
                    No image
                  </div>
                </div>

                <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {{ categoryName(product.categoryId) || 'Uncategorized' }}
                </p>
                <h2 class="text-lg font-semibold text-slate-900">{{ product.name }}</h2>
                <p class="text-sm text-slate-500">{{ product.description }}</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">{{ formatCurrency(product.basePrice) }}</p>
                <p class="mt-2 text-xs text-slate-500">
                  {{ product.variants?.length || 0 }} variants
                </p>
              </div>
              </div>
              <div class="flex gap-2">
                <button type="button" class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700" @click="startEdit(product)">
                  Edit
                </button>
                <button type="button" class="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700" @click="handleDeleteProduct(product.id)">
                  Delete
                </button>
              </div>
            </div>
          </article>

          <div v-if="!products.length" class="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            No products yet. Create the first catalog item from the editor panel.
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
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
  await deleteProduct(productId)
  await loadData()
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
