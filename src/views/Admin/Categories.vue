<template>
  <AdminPanelLayout subtitle="Create and remove storefront categories">
    <section class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
          <PlusCircle :size="14" />
          <span>Taxonomy setup</span>
        </div>
        <h2 class="mt-2 text-xl font-black text-slate-900 tracking-tight">Add category</h2>
        <p class="mt-2 text-xs font-medium text-slate-500 leading-relaxed">
          Create customer-facing categories that keep the storefront organized.
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="handleCreateCategory">
          <label class="block">
            <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Category name</span>
            <input v-model="name" class="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="Example: Accessories" required />
          </label>
          <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] shadow-md shadow-slate-100">
            <Save :size="16" />
            Save category
          </button>
        </form>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
              <Layers :size="14" />
              <span>Existing categories</span>
            </div>
            <h2 class="mt-1 text-xl font-black text-slate-900 tracking-tight">{{ categories.length }} categories</h2>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight border border-slate-100">
            Storefront Labels
          </div>
        </div>

        <div class="mt-6 grid gap-2.5">
          <div
            v-for="category in categories"
            :key="category.id"
            class="group flex items-center justify-between rounded-xl border border-slate-50 bg-white p-4 transition hover:border-slate-200 hover:bg-slate-50/30"
          >
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                <Tag :size="14" />
              </div>
              <div>
                <span class="block text-sm font-bold text-slate-900">{{ category.name }}</span>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-100 active:scale-95"
              @click="handleDeleteCategory(category.id)"
            >
              <Trash2 :size="12" />
              Delete
            </button>
          </div>

          <div v-if="!categories.length" class="flex flex-col items-center justify-center rounded-xl bg-slate-50/50 py-12 text-slate-300 border border-dashed border-slate-200">
            <PackageSearch :size="32" class="opacity-20 mb-2" />
            <p class="text-xs font-medium">No categories created yet</p>
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { PlusCircle, Save, Layers, Tag, Trash2, PackageSearch } from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { createCategory, deleteCategory, listCategories } from '../../services/catalogService'

const categories = ref([])
const name = ref('')

const loadCategories = async () => {
  categories.value = await listCategories()
}

const handleCreateCategory = async () => {
  if (!name.value.trim()) return
  await createCategory(name.value.trim())
  name.value = ''
  await loadCategories()
}

const handleDeleteCategory = async (categoryId) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(categoryId)
    await loadCategories()
  }
}

onMounted(loadCategories)
</script>

