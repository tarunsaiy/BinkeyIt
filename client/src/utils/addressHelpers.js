export const formatAddressLine = (address) =>
  [address.address_line, address.city, address.state, address.country, address.pincode]
    .filter(Boolean)
    .join(', ')

export const parseAreaParts = (area = '') => {
  const parts = area.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return {
      city: parts[parts.length - 2] || parts[0],
      state: parts[parts.length - 1] || '',
    }
  }
  return {
    city: parts[0] || '',
    state: '',
  }
}

export const buildAddressPayload = ({ flat, floor, area, landmark, mobile, pincode }) => {
  const { city, state } = parseAreaParts(area)
  const addressParts = [flat, floor, landmark, area].filter(Boolean)

  return {
    address_line: addressParts.join(', '),
    city,
    state,
    country: 'India',
    pincode: pincode || '500000',
    mobile,
  }
}
