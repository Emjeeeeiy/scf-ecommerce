<template>
  <AdminPanelLayout subtitle="Create and remove storefront categories">
    <section class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Taxonomy setup</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900">Add category</h2>
        <p class="mt-2 text-sm text-slate-500">
          Create customer-facing categories that keep the storefront organized.
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="handleCreateCategory">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Category name</span>
            <input v-model="name" class="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Example: Accessories" required />
          </label>
          <button type="submit" class="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
            Save category
          </button>
        </form>
      </div>

      <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.25em] text-slate-500">Existing categories</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ categories.length }} categories</h2>
          </div>
          <div class="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            Use short, clear labels for better storefront browsing.
          </div>
        </div>

        <div class="mt-6 grid gap-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Category</p>
              <span class="mt-1 block font-semibold text-slate-900">{{ category.name }}</span>
            </div>
            <button
              type="button"
              class="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
              @click="handleDeleteCategory(category.id)"
            >
              Delete
            </button>
          </div>

          <div v-if="!categories.length" class="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
            No categories yet. Start by creating the first browse group for the storefront.
          </div>
        </div>
      </div>
    </section>
  </AdminPanelLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AdminPanelLayout from '../../components/AdminPanelLayout.vue'
import { createCategory, deleteCategory, listCategories } from '../../services/catalogService'

const categories = ref([])
const name = ref('')

const loadCategories = async () => {
  categories.value = await listCategories()
}

const handleCreateCategory = async () => {
  await createCategory(name.value)
  name.value = ''
  await loadCategories()
}

const handleDeleteCategory = async (categoryId) => {
  await deleteCategory(categoryId)
  await loadCategories()
}

onMounted(loadCategories)
</script>
