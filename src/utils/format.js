export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(Number(value || 0))

export const formatDate = (timestamp, { withTime = false } = {}) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

// Shared badge styling for the order fulfillment pipeline (received -> processing -> shipped -> completed).
export const getOrderStatusClasses = (status) => {
  switch (status) {
    case 'received': return 'bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
    case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
    case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
    case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
    default: return 'bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
  }
}

export const sortSizes = (sizes) => {
  const order = {
    'XS': 1,
    'S': 2,
    'M': 3,
    'L': 4,
    'XL': 5,
    'XXL': 6,
    'XXXL': 7
  }
  
  return [...sizes].sort((a, b) => {
    const aVal = typeof a === 'string' ? a.toUpperCase() : (a.size || '').toUpperCase()
    const bVal = typeof b === 'string' ? b.toUpperCase() : (b.size || '').toUpperCase()
    return (order[aVal] || 99) - (order[bVal] || 99)
  })
}
