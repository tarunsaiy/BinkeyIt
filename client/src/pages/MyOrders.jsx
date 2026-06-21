import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoCheckmark, IoChevronForward } from 'react-icons/io5'
import NoData from '../Components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import {
  groupOrdersByCheckout,
  formatOrderDate,
  getDeliveryMinutes,
} from '../utils/orderHelpers'
import {
  dashboardCardClass,
  dashboardItemMetaClass,
  dashboardItemTitleClass,
  dashboardPageClass,
  dashboardScrollAreaClass,
} from '../utils/dashboardStyles'

const MyOrders = () => {
  const navigate = useNavigate()
  const orders = useSelector((state) => state.orders.order)

  const groupedOrders = useMemo(
    () => groupOrdersByCheckout(orders || []),
    [orders]
  )

  if (!groupedOrders.length) {
    return (
      <div className={`${dashboardPageClass} items-center justify-center py-8`}>
        <NoData />
      </div>
    )
  }

  return (
    <div className={dashboardPageClass}>
      <div className={dashboardScrollAreaClass}>
        <div className="flex flex-col gap-4">
          {groupedOrders.map((orderGroup) => {
            const deliveryMinutes = getDeliveryMinutes(orderGroup.createdAt)
            const isDelivered =
              orderGroup.payment_status === 'CASH ON DELIVERY' ||
              orderGroup.payment_status === 'paid'

            return (
              <button
                type="button"
                key={orderGroup.key}
                onClick={() => navigate(`/dashboard/myorders/${orderGroup.key}`)}
                className={`${dashboardCardClass} w-full cursor-pointer text-left transition-shadow hover:shadow-sm`}
              >
                <div className="flex items-start gap-3 p-4 pb-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C831F]">
                    <IoCheckmark className="text-white" size={14} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={dashboardItemTitleClass}>
                      {isDelivered
                        ? `Arrived in ${deliveryMinutes} minutes`
                        : orderGroup.payment_status || 'Order placed'}
                    </p>
                    <p className={`mt-1 ${dashboardItemMetaClass}`}>
                      {DisplayPriceInRupees(orderGroup.totalAmt).replace(/\.00$/, '')}
                      {' • '}
                      {formatOrderDate(orderGroup.createdAt)}
                    </p>
                  </div>

                  <IoChevronForward className="mt-1 shrink-0 text-[#cccccc]" size={18} />
                </div>

                <div className="flex gap-2 overflow-x-auto px-4 pb-4 thin-scrollbar">
                  {orderGroup.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#eeeeee] bg-white p-1"
                    >
                      <img
                        src={item.product_details?.image?.[0]}
                        alt={item.product_details?.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
