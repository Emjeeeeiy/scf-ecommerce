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
    case 'received': return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    default: return 'bg-slate-50 text-slate-600 border-slate-100'
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
