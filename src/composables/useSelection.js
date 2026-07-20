import { computed, ref, unref } from 'vue'

/**
 * Bulk row-selection for admin tables (checkboxes + "select all" + clear).
 * @param {import('vue').Ref<Array>} source - reactive list of currently visible rows
 * @param {(item: any) => any} getId - id extractor, defaults to item.id
 */
export function useSelection(source, getId = (item) => item.id) {
  const selected = ref([])

  const isAllSelected = computed(() => {
    const items = unref(source)
    return items.length > 0 && selected.value.length === items.length
  })

  const toggleAll = () => {
    const items = unref(source)
    selected.value = isAllSelected.value ? [] : items.map(getId)
  }

  const clear = () => {
    selected.value = []
  }

  return { selected, isAllSelected, toggleAll, clear }
}
