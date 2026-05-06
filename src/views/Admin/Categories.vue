<template>
  <AdminPanelLayout subtitle="Create and remove storefront categories">
    <section class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
          <PlusCircle :size="14" />
          <span>Taxonomy setup</span>
        </div>
        <h2 class="mt-2 text-xl font-black text-slate-900 dark:text-white tracking-tight">Add category</h2>
        <p class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
          Create customer-facing categories that keep the storefront organized.
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="handleCreateCategory">
          <label class="block">
            <span class="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Category name</span>
            <input v-model="name" class="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="Example: Accessories" required />
          </label>
          <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-amber-400 px-4 py-3.5 text-sm font-bold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-amber-300 active:scale-[0.98] shadow-md shadow-slate-100 dark:shadow-none">
            <Save :size="16" />
            Save category
          </button>
        </form>
      </div>

      <div class="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              <Layers :size="14" />
              <span>Existing categories</span>
            </div>
            <h2 class="mt-1 text-xl font-black text-slate-900 dark:text-white tracking-tight">{{ categories.length }} categories</h2>
          </div>
          <div class="rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight border border-slate-100 dark:border-slate-800">
            Storefront Labels
          </div>
        </div>

        <div class="mt-6 grid gap-2.5">
          <div
            v-for="category in categories"
            :key="category.id"
            class="group flex items-center justify-between rounded-xl border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/30 dark:hover:bg-slate-800/50"
          >
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <Tag :size="14" />
              </div>
              <div>
                <span class="block text-sm font-bold text-slate-900 dark:text-white">{{ category.name }}</span>
              </div>
            </div>
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95"
              @click="handleDeleteCategory(category.id)"
            >
              <Trash2 :size="12" />
              Delete
            </button>
          </div>

          <div v-if="!categories.length" class="flex flex-col items-center justify-center rounded-xl bg-slate-50/50 dark:bg-slate-800/50 py-12 text-slate-300 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-700">
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
import { useConfirm } from '../../composables/useConfirm'

const { confirm } = useConfirm()
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
  if (await confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(categoryId)
    await loadCategories()
  }
}

onMounted(loadCategories)
</script>

