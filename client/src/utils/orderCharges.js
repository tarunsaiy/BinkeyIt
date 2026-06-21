export const DELIVERY_CHARGE = 25
export const HANDLING_CHARGE = 2

export const getOrderGrandTotal = (itemsTotal) =>
  itemsTotal + DELIVERY_CHARGE + HANDLING_CHARGE

export const formatOrderPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
