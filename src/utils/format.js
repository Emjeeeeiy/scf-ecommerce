export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(Number(value || 0))

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
