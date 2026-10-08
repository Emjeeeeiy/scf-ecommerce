<template>
  <AdminPanelLayout>
  <div class="space-y-4 sm:space-y-5">
    <AdminPageHead
      eyebrow="Catalog"
      title="Categories"
      description="Organize the labels customers browse on the storefront."
    />

    <section class="grid gap-4 sm:gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div class="admin-card h-fit p-4 sm:p-5">
        <p class="admin-eyebrow flex items-center gap-1.5">
          <PlusCircle :size="12" />
          <span>New category</span>
        </p>
        <h2 class="admin-card-title mt-0.5">Add category</h2>
        <p class="admin-muted mt-1.5">
          Customer-facing labels that keep the storefront organized.
        </p>

        <form class="mt-5 space-y-3" @submit.prevent="handleCreateCategory">
          <label class="block">
            <span class="admin-eyebrow mb-2 block">Name</span>
            <input v-model="name" class="admin-field" placeholder="Example: Accessories" required />
          </label>
          <button type="submit" class="admin-btn admin-btn-primary w-full">
            <Save :size="14" />
            Save category
          </button>
        </form>
      </div>

      <div class="admin-card h-fit p-4 sm:p-5">
        <p class="admin-eyebrow flex items-center gap-1.5">
          <Layers :size="12" />
          <span>Existing</span>
        </p>
        <h2 class="admin-card-title mt-0.5">{{ categories.length }} {{ categories.length === 1 ? 'category' : 'categories' }}</h2>

        <div class="mt-4 grid gap-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="group flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-white p-3 transition hover:border-neutral-200 hover:bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/40"
          >
            <div class="flex min-w-0 items-center gap-2.5">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-400 transition group-hover:bg-white group-hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-500 dark:group-hover:bg-neutral-700 dark:group-hover:text-white">
                <Tag :size="14" />
              </div>
              <span class="truncate text-sm font-bold text-neutral-900 dark:text-white">{{ category.name }}</span>
            </div>
            <button
              type="button"
              title="Delete category"
              aria-label="Delete category"
              class="admin-icon-btn h-8 w-8 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              @click="handleDeleteCategory(category.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>

          <div v-if="!categories.length" class="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 py-12 text-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-600">
            <PackageSearch :size="28" stroke-width="1.5" class="mb-2 opacity-60" />
            <p class="text-[11px] font-semibold uppercase tracking-[0.14em]">No categories yet</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  </AdminPanelLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { PlusCircle, Save, Layers, Tag, Trash2, PackageSearch } from 'lucide-vue-next'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import AdminPageHead from '../../components/AdminPageHead.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useConfirmAction } from '../../composables/useConfirmAction'

const { confirmAndRun } = useConfirmAction()
const { categories, refreshCategories, createCategory, deleteCategory } = useCatalogStore()
const name = ref('')

const handleCreateCategory = async () => {
  if (!name.value.trim()) return
  await createCategory(name.value.trim())
  name.value = ''
}

const handleDeleteCategory = (categoryId) =>
  confirmAndRun('Are you sure you want to delete this category?', () => deleteCategory(categoryId))

onMounted(refreshCategories)
</script>
