import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IoArrowBack, IoChevronForward } from 'react-icons/io5'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../Provider/GlobalProvider'
import CartOrderSummary from './CartOrderSummary'
import SelectAddressDrawer from './SelectAddressDrawer'
import { formatOrderPrice, getOrderGrandTotal } from '../utils/orderCharges'
import { formatAddressLine } from '../utils/addressHelpers'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import {
  buildSuccessOrderItems,
  saveLastOrderItems,
} from '../utils/orderSuccessHelpers'

const CheckOutDisplay = ({ close }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const addressList = useSelector((state) => state.addresses.addressList)
  const liveCartItems = useSelector((state) => state.cartItem.cart)
  const {
    notDiscountTotalPrice: liveNotDiscountTotalPrice,
    totalPrice: liveTotalPrice,
    totalQuantity: liveTotalQuantity,
    fetchOrder,
  } = useGlobalContext()
  const [openedEmpty] = useState(() => !liveCartItems.length)
  const cartItemsList = openedEmpty ? [] : liveCartItems
  const totalPrice = openedEmpty ? 0 : liveTotalPrice
  const notDiscountTotalPrice = openedEmpty ? 0 : liveNotDiscountTotalPrice
  const totalQuantity = openedEmpty ? 0 : liveTotalQuantity
  const lastSelectedRef = useRef(null)
  const prevAddressCountRef = useRef(0)

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [openAddressDrawer, setOpenAddressDrawer] = useState(false)

  const activeAddresses = useMemo(
    () => addressList.filter((address) => address.status),
    [addressList]
  )

  const foundAddress = useMemo(
    () =>
      activeAddresses.find((address) => address._id === selectedAddressId) ||
      activeAddresses[0],
    [activeAddresses, selectedAddressId]
  )
  if (foundAddress) lastSelectedRef.current = foundAddress
  const selectedAddress = foundAddress || lastSelectedRef.current

  useEffect(() => {
    if (activeAddresses.length && !selectedAddressId) {
      setSelectedAddressId(activeAddresses[0]._id)
    }
  }, [activeAddresses, selectedAddressId])

  useEffect(() => {
    if (prevAddressCountRef.current > 0 && activeAddresses.length > prevAddressCountRef.current) {
      setSelectedAddressId(activeAddresses[activeAddresses.length - 1]._id)
    }
    prevAddressCountRef.current = activeAddresses.length
  }, [activeAddresses.length])

  const grandTotal = getOrderGrandTotal(totalPrice)

  const handleClose = () => {
    if (close) close()
  }

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      })

      if (response.data.success) {
        toast.success(response.data.message)
        const orderItems = buildSuccessOrderItems(cartItemsList)
        saveLastOrderItems(orderItems)
        fetchOrder?.()
        handleClose()
        navigate('/success', { state: { text: 'Order', items: orderItems } })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <>
      <section className="fixed inset-0 z-[60] bg-black/50">
        <div className="ml-auto flex h-full w-full max-w-[420px] flex-col bg-[#f8f8f8]">
          <div className="flex shrink-0 items-center gap-3 border-b border-[#eeeeee] bg-white px-4 py-3.5">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1c1c1c] hover:bg-[#f3f3f3]"
              aria-label="Close checkout"
            >
              <IoArrowBack size={20} />
            </button>
            <h2 className="text-sm font-semibold text-[#1c1c1c]">My Cart</h2>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto thin-scrollbar p-3">
            <CartOrderSummary
              cartItems={cartItemsList}
              totalQuantity={totalQuantity}
              notDiscountTotalPrice={notDiscountTotalPrice}
              totalPrice={totalPrice}
            />
          </div>

          <div className="shrink-0 border-t border-[#eeeeee] bg-white p-3">
            <div className="mb-3 flex items-start gap-3">
              <HiOutlineLocationMarker size={18} className="mt-0.5 shrink-0 text-[#666666]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1c1c1c]">
                  Delivering to {user?.name || selectedAddress?.mobile || 'you'}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] text-[#666666]">
                  {selectedAddress
                    ? formatAddressLine(selectedAddress)
                    : 'Select a delivery address to continue'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenAddressDrawer(true)}
                className="shrink-0 text-xs font-semibold text-[#0C831F]"
              >
                Change
              </button>
            </div>

            <button
              type="button"
              onClick={handleCashOnDelivery}
              className="flex w-full items-center justify-between rounded-xl bg-[#0C831F] px-4 py-3.5 text-white"
            >
              <div className="text-left">
                <p className="text-base font-semibold leading-none">
                  {formatOrderPrice(grandTotal)}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-90">
                  Total
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold">
                Place Order (Cash on delivery)
                <IoChevronForward size={16} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {openAddressDrawer && (
        <SelectAddressDrawer
          close={() => setOpenAddressDrawer(false)}
          selectedAddressId={selectedAddress?._id}
          onSelectAddress={setSelectedAddressId}
        />
      )}
    </>
  )
}

export default CheckOutDisplay
