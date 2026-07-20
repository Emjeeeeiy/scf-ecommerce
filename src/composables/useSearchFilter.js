import { computed, ref, unref } from 'vue'

/**
 * Free-text filtering over a reactive list. Every admin/list view was hand-rolling
 * the same "lowercase + includes across a few fields" computed — this centralizes it.
 *
 * @param {import('vue').Ref<Array>} source - reactive list to filter
 * @param {(item: any) => Array<string | null | undefined>} getFields - fields to search per item
 */
export function useSearchFilter(source, getFields) {
  const query = ref('')

  const filtered = computed(() => {
    const items = unref(source)
    const normalized = query.value.trim().toLowerCase()

    if (!normalized) return items

    return items.filter((item) =>
      getFields(item).some((field) => (field || '').toString().toLowerCase().includes(normalized)),
    )
  })

  return { query, filtered }
}
