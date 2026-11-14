export const DELIVERY_CHARGE = 25
export const HANDLING_CHARGE = 2

export const FREE_DELIVERY_MIN = 199

export const getDeliveryCharge = (itemsTotal) =>
  itemsTotal > FREE_DELIVERY_MIN ? 0 : DELIVERY_CHARGE

export const getOrderGrandTotal = (itemsTotal) =>
  itemsTotal + getDeliveryCharge(itemsTotal) + HANDLING_CHARGE

export const formatOrderPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
