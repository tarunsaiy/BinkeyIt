import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  IoArrowBack,
  IoChevronForward,
  IoCopyOutline,
  IoDownloadOutline,
  IoChatbubbleEllipsesOutline,
} from 'react-icons/io5'
import NoData from '../Components/NoData'
import {
  findOrderGroupByKey,
  formatOrderPlaced,
  formatPriceShort,
  formatDeliveryAddress,
  getArrivedTime,
  getPaymentLabel,
  mergeOrderItems,
} from '../utils/orderHelpers'

import {
  dashboardBodyTextClass,
  dashboardCardClass,
  dashboardDetailLabelClass,
  dashboardIconBtnClass,
  dashboardItemMetaClass,
  dashboardItemTitleClass,
  dashboardLinkActionClass,
  dashboardPageClass,
  dashboardPriceClass,
  dashboardScrollAreaClass,
  dashboardSectionTitleClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const BillRow = ({ label, value, bold = false }) => (
  <div className="flex items-center justify-between py-2">
    <span className={dashboardBodyTextClass}>{label}</span>
    <span className={`${dashboardBodyTextClass} ${bold ? 'font-bold' : ''}`}>
      {value}
    </span>
  </div>
)

const DetailBlock = ({ label, children }) => (
  <div className="py-2.5">
    <p className={`${dashboardDetailLabelClass} mb-0.5`}>{label}</p>
    <div className={dashboardBodyTextClass}>{children}</div>
  </div>
)

const OrderSummary = () => {
  const { groupKey } = useParams()
  const navigate = useNavigate()
  const orders = useSelector((state) => state.orders.order)
  const orderGroup = findOrderGroupByKey(orders, groupKey)

  if (!orderGroup) {
    return (
      <div className={`${dashboardPageClass} items-center justify-center`}>
        <button
          type="button"
          onClick={() => navigate('/dashboard/myorders')}
          className={`mb-4 ${dashboardIconBtnClass}`}
        >
          <IoArrowBack size={18} />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <NoData />
        </div>
      </div>
    )
  }

  const mergedItems = mergeOrderItems(orderGroup.items, orderGroup)
  const orderId = orderGroup.items[0]?.orderId
  const addressText = formatDeliveryAddress(orderGroup.delivery_address)
  const invoiceUrl = orderGroup.invoice_receipt || orderGroup.items[0]?.invoice_receipt

  const handleCopyOrderId = async () => {
    if (!orderId) return

    try {
      await navigator.clipboard.writeText(orderId)
      toast.success('Order ID copied')
    } catch {
      toast.error('Could not copy order ID')
    }
  }

  return (
    <div className={dashboardPageClass}>
      <button
        type="button"
        onClick={() => navigate('/dashboard/myorders')}
        className={`mb-4 ${dashboardIconBtnClass}`}
      >
        <IoArrowBack size={18} />
      </button>

      <div className={dashboardScrollAreaClass}>
      <div className={dashboardCardClass}>
        <div className="border-b border-[#eeeeee] px-5 py-4">
          <h1 className={dashboardTitleClass}>Order summary</h1>
          <p className={`mt-1 ${dashboardItemMetaClass}`}>
            Arrived at {getArrivedTime(orderGroup.createdAt)}
          </p>

          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-2 inline-flex items-center gap-1.5 ${dashboardLinkActionClass}`}
            >
              <IoDownloadOutline size={14} />
              Download Invoice
            </a>
          )}
        </div>

        <div className="border-b border-[#eeeeee] px-5 py-3">
          <p className={`${dashboardSectionTitleClass} mb-3`}>
            {mergedItems.length} item{mergedItems.length !== 1 ? 's' : ''} in this order
          </p>

          <div className="flex flex-col gap-4">
            {mergedItems.map((item) => (
              <div key={item.productId || item.product_details?.name} className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#eeeeee] p-1">
                  <img
                    src={item.product_details?.image?.[0]}
                    alt={item.product_details?.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`${dashboardItemTitleClass} leading-snug`}>
                    {item.product_details?.name}
                  </p>
                  <p className={`mt-0.5 ${dashboardItemMetaClass}`}>Qty {item.qty}</p>
                </div>

                <p className={`shrink-0 ${dashboardPriceClass}`}>
                  {formatPriceShort(item.lineTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-[#eeeeee] px-5 py-1">
          <p className={`py-2 ${dashboardSectionTitleClass}`}>Bill details</p>
          <BillRow
            label="Item total"
            value={formatPriceShort(orderGroup.totalAmt)}
            bold
          />
          <BillRow label="Delivery charges" value="FREE" />
          <BillRow
            label="Bill total"
            value={formatPriceShort(orderGroup.totalAmt)}
            bold
          />
        </div>

        <div className="border-b border-[#eeeeee] px-5 py-1">
          <p className={`py-2 ${dashboardSectionTitleClass}`}>Order details</p>

          <DetailBlock label="Order id">
            <div className="flex items-center gap-2">
              <span>{orderId}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-[#666666] hover:text-[#1c1c1c]"
                aria-label="Copy order id"
              >
                <IoCopyOutline size={14} />
              </button>
            </div>
          </DetailBlock>

          <DetailBlock label="Payment">
            {getPaymentLabel(orderGroup.payment_status)}
          </DetailBlock>

          {addressText && (
            <DetailBlock label="Deliver to">{addressText}</DetailBlock>
          )}

          <DetailBlock label="Order placed">
            {formatOrderPlaced(orderGroup.createdAt)}
          </DetailBlock>
        </div>

        <div className="px-5 py-3">
          <p className={`${dashboardSectionTitleClass} mb-2`}>
            Need help with your order?
          </p>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-[#eeeeee] px-4 py-2.5 text-left hover:bg-[#fafafa]"
          >
            <IoChatbubbleEllipsesOutline size={18} className="text-[#666666]" />
            <div className="min-w-0 flex-1">
              <p className={dashboardItemTitleClass}>Chat with us</p>
              <p className={dashboardItemMetaClass}>
                About any issues related to your order
              </p>
            </div>
            <IoChevronForward size={16} className="shrink-0 text-[#cccccc]" />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default OrderSummary
