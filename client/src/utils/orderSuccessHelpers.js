export const buildSuccessOrderItems = (cartItems = []) =>
  cartItems.map((item) => ({
    id: item._id || item.productId?._id,
    name: item.productId?.name || item.product_details?.name,
    image: item.productId?.image?.[0] || item.product_details?.image?.[0],
    quantity: item.quantity || 1,
    unit: item.productId?.unit || '1 pc',
  }))

export const saveLastOrderItems = (items) => {
  sessionStorage.setItem('lastOrderItems', JSON.stringify(items))
}

export const getLastOrderItems = () => {
  try {
    const raw = sessionStorage.getItem('lastOrderItems')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const clearLastOrderItems = () => {
  sessionStorage.removeItem('lastOrderItems')
}
