export const pricewithDiscount = (price,dis = 1.0)=>{
    const discountAmout = Number(price) * Number(dis * 1.0) / 100
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}