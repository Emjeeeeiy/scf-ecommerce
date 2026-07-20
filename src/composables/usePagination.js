import { computed, ref, unref } from 'vue'

/**
 * Client-side pagination over an already-loaded (and already-filtered) reactive
 * list, so large catalogs/order tables render a bounded number of DOM rows
 * instead of the entire result set at once.
 *
 * `page` auto-clamps if the source shrinks out from under it (e.g. a filter
 * narrows the results) instead of stranding the view on a now-empty page.
 * It does NOT reset itself on every source change — realtime updates (a new
 * order arriving, another admin editing a product) shouldn't bounce whoever
 * is reviewing page 3 back to page 1. Call `resetPage()` when a filter input
 * changes instead.
 *
 * @param {import('vue').Ref<Array>} source - the filtered list to paginate
 * @param {number} pageSize
 */
export function usePagination(source, pageSize = 20) {
  const rawPage = ref(1)

  const totalItems = computed(() => unref(source).length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))
  const page = computed(() => Math.min(rawPage.value, totalPages.value))

  const paged = computed(() => {
    const start = (page.value - 1) * pageSize
    return unref(source).slice(start, start + pageSize)
  })

  const goToPage = (n) => {
    rawPage.value = Math.min(Math.max(1, n), totalPages.value)
  }
  const nextPage = () => goToPage(page.value + 1)
  const prevPage = () => goToPage(page.value - 1)
  const resetPage = () => { rawPage.value = 1 }

  return { page, pageSize, totalItems, totalPages, paged, goToPage, nextPage, prevPage, resetPage }
}
