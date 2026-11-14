import React from 'react'
import { IoTimeOutline } from 'react-icons/io5'
import {
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
} from 'react-icons/hi'
import { MdOutlineDeliveryDining } from 'react-icons/md'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import {
  DELIVERY_CHARGE,
  HANDLING_CHARGE,
  formatOrderPrice,
  getOrderGrandTotal,
} from '../utils/orderCharges'

export const BillLine = ({ icon: Icon, label, value, badge, showInfo = false, valueClass = '' }) => (
  <div className="flex items-start justify-between gap-3 py-2">
    <div className="flex min-w-0 items-start gap-2">
      <Icon size={16} className="mt-0.5 shrink-0 text-[#666666]" />
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="text-xs font-normal text-[#1c1c1c]">{label}</span>
        {showInfo && (
          <HiOutlineInformationCircle size={12} className="shrink-0 text-[#999999]" />
        )}
        {badge && (
          <span className="rounded bg-[#eef2ff] px-1.5 py-0.5 text-[9px] font-semibold text-[#4f46e5]">
            {badge}
          </span>
        )}
      </div>
    </div>
    <div className={`shrink-0 text-xs font-normal text-[#1c1c1c] ${valueClass}`}>{value}</div>
  </div>
)

const CartOrderSummary = ({
  cartItems,
  totalQuantity,
  notDiscountTotalPrice,
  totalPrice,
}) => {
  const savings = Math.max(0, notDiscountTotalPrice - totalPrice)
  const grandTotal = getOrderGrandTotal(totalPrice)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[#eeeeee] bg-white p-4">
        <div className="mb-4 flex items-center gap-3 border-b border-[#eeeeee] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3]">
            <IoTimeOutline size={20} className="text-[#666666]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1c1c1c]">Delivery in 8 minutes</p>
            <p className="text-[10px] text-[#666666]">
              Shipment of {totalQuantity} item{totalQuantity !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {cartItems.map((item) => {
            const unitPrice = pricewithDiscount(
              item.productId.price,
              item.productId.discount
            )
            const originalPrice = item.productId.price

            return (
              <div key={item._id + 'cartItem'} className="flex items-start gap-3">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg border border-[#eeeeee] p-1">
                  <img
                    src={item.productId.image[0]}
                    alt={item.productId.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs font-semibold leading-snug text-[#1c1c1c]">
                    {item.productId.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#666666]">
                    {item.productId.unit}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1c1c1c]">
                      {formatOrderPrice(unitPrice)}
                    </span>
                    {originalPrice > unitPrice && (
                      <span className="text-[10px] text-[#999999] line-through">
                        {formatOrderPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <AddToCartButton data={item.productId} compact />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[#eeeeee] bg-white p-4">
        <h3 className="mb-1.5 text-xs font-bold text-[#1c1c1c]">Bill details</h3>

        <BillLine
          icon={HiOutlineDocumentText}
          label="Items total"
          badge={savings > 0 ? `Saved ${formatOrderPrice(savings)}` : null}
          value={
            <span>
              {notDiscountTotalPrice > totalPrice && (
                <span className="mr-2 text-[#999999] line-through">
                  {formatOrderPrice(notDiscountTotalPrice)}
                </span>
              )}
              <span>{formatOrderPrice(totalPrice)}</span>
            </span>
          }
        />

        <BillLine
          icon={MdOutlineDeliveryDining}
          label="Delivery charge"
          showInfo
          value={formatOrderPrice(DELIVERY_CHARGE)}
        />

        <BillLine
          icon={HiOutlineShoppingBag}
          label="Handling charge"
          showInfo
          value={formatOrderPrice(HANDLING_CHARGE)}
        />

        <div className="mt-1 flex items-center justify-between border-t border-[#eeeeee] pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#1c1c1c]">Grand total</span>
            <HiOutlineInformationCircle size={12} className="text-[#999999]" />
          </div>
          <span className="text-xs font-bold text-[#1c1c1c]">
            {formatOrderPrice(grandTotal)}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-[#eeeeee] bg-white p-3">
        <h3 className="text-xs font-semibold text-[#1c1c1c]">Cancellation Policy</h3>
        <p className="mt-1.5 text-[10px] leading-relaxed text-[#666666]">
          Orders cannot be cancelled once packed for delivery. In case of unexpected
          delays, a refund will be provided, if applicable.
        </p>
      </div>
    </div>
  )
}

export default CartOrderSummary
