export const getOrderGroupKey = (order) => {
  const addressId = order.delivery_address?._id || order.delivery_address || 'none'
  const timeKey = Math.floor(new Date(order.createdAt).getTime() / 5000)
  return `${order.totalAmt}_${addressId}_${timeKey}`
}

export const groupOrdersByCheckout = (orders) => {
  const groups = {}

  orders.forEach((order) => {
    const key = getOrderGroupKey(order)

    if (!groups[key]) {
      groups[key] = {
        key,
        items: [],
        totalAmt: order.totalAmt,
        createdAt: order.createdAt,
        payment_status: order.payment_status,
        delivery_address: order.delivery_address,
        invoice_receipt: order.invoice_receipt,
      }
    }

    groups[key].items.push(order)
  })

  return Object.values(groups).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export const findOrderGroupByKey = (orders, groupKey) => {
  return groupOrdersByCheckout(orders || []).find((group) => group.key === groupKey)
}

export const formatOrderDate = (dateStr) => {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleString('en-IN', { month: 'short' })
  const time = date
    .toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, ' ')
    .toLowerCase()

  return `${day} ${month}, ${time}`
}

export const formatOrderPlaced = (dateStr) => {
  const date = new Date(dateStr)
  const weekday = date.toLocaleString('en-IN', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleString('en-IN', { month: 'short' })
  const year = String(date.getFullYear()).slice(-2)
  const time = date.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return `placed on ${weekday}, ${day} ${month}'${year}, ${time}`
}

export const getDeliveryMinutes = (createdAt) => {
  return 8 + (new Date(createdAt).getMinutes() % 8)
}

export const getArrivedTime = (createdAt) => {
  const date = new Date(createdAt)
  date.setMinutes(date.getMinutes() + getDeliveryMinutes(createdAt))

  return date
    .toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, ' ')
    .toLowerCase()
}

export const formatPriceShort = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const getItemPrice = (item, group) => {
  const allSameSubtotal = group.items.every(
    (entry) => entry.subTotalAmt === group.items[0].subTotalAmt
  )

  if (allSameSubtotal && group.items.length > 1) {
    return group.totalAmt / group.items.length
  }

  return item.subTotalAmt
}

export const mergeOrderItems = (items, group) => {
  const merged = {}

  items.forEach((item) => {
    const id = item.productId || item.product_details?.name
    const unitPrice = getItemPrice(item, group)

    if (merged[id]) {
      merged[id].qty += 1
      merged[id].lineTotal += unitPrice
    } else {
      merged[id] = {
        ...item,
        qty: 1,
        unitPrice,
        lineTotal: unitPrice,
      }
    }
  })

  return Object.values(merged)
}

export const formatDeliveryAddress = (address) => {
  if (!address || typeof address === 'string') return ''

  return [
    address.address_line,
    address.city,
    address.state,
    address.country,
    address.pincode,
  ]
    .filter(Boolean)
    .join(', ')
}

export const getPaymentLabel = (paymentStatus) => {
  if (paymentStatus === 'CASH ON DELIVERY') return 'Cash on Delivery'
  if (paymentStatus === 'paid') return 'Paid online'
  return paymentStatus || 'Payment pending'
}
