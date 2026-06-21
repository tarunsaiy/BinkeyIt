import React, { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import takeAwayGif from '../assets/take-away.gif'
import {
  clearLastOrderItems,
  getLastOrderItems,
} from '../utils/orderSuccessHelpers'
import { groupOrdersByCheckout, mergeOrderItems } from '../utils/orderHelpers'

const Success = () => {
  const location = useLocation()
  const orders = useSelector((state) => state.orders.order)

  const stateItems = location.state?.items
  const storedItems = useMemo(() => getLastOrderItems(), [])

  const latestOrderItems = useMemo(() => {
    const [latestGroup] = groupOrdersByCheckout(orders || [])
    if (!latestGroup) return []

    return mergeOrderItems(latestGroup.items, latestGroup).map((item) => ({
      id: item.productId || item._id,
      name: item.product_details?.name,
      image: item.product_details?.image?.[0],
      quantity: item.qty,
      unit: '1 pc',
    }))
  }, [orders])

  const orderedItems = stateItems?.length
    ? stateItems
    : storedItems.length
      ? storedItems
      : latestOrderItems

  useEffect(() => {
    return () => clearLastOrderItems()
  }, [])

  const successLabel = location.state?.text ? `${location.state.text} placed` : 'Order placed'

  return (
    <section className="flex h-[calc(100dvh-68px)] flex-col overflow-hidden bg-white lg:h-[calc(100dvh-72px)]">
      <div className="shrink-0 bg-white px-5 py-4 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-[#0C831F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a6b19]"
        >
          Go to home
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex shrink-0 flex-col items-center justify-center bg-white px-5 py-5 lg:w-1/2 lg:py-8 lg:px-10">
          <img
            src={takeAwayGif}
            alt="Order on the way"
            className="w-full max-w-xs object-contain lg:max-w-md"
          />
          <p className="mt-4 max-w-md text-center text-xl font-bold leading-snug text-[#1c1c1c] lg:text-2xl">
            Our delivery partner will deliver to you
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-5 pb-5 lg:w-1/2 lg:px-10 lg:py-6">
          <div className="shrink-0 pt-1">
            <p className="text-xs font-medium text-[#666666]">
              {successLabel} successfully
            </p>
            <p className="mt-1 text-sm text-[#666666]">Here&apos;s what you ordered</p>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto thin-scrollbar pr-1">
            <div className="flex flex-col gap-3">
              {orderedItems.length > 0 ? (
                orderedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[#eeeeee] bg-white p-3"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#eeeeee] p-1">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full rounded bg-[#f3f4f6]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-semibold text-[#1c1c1c]">
                        {item.name}
                      </p>
                      {item.unit && (
                        <p className="mt-0.5 text-xs text-[#666666]">{item.unit}</p>
                      )}
                    </div>

                    <div className="shrink-0 rounded-lg bg-[#f3f4f6] px-2.5 py-1 text-xs font-bold text-[#1c1c1c]">
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#666666]">Your order details will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Success
