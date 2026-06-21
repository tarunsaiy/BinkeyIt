import React, { useEffect, useMemo, useState } from 'react'
import { IoArrowBack, IoChevronForward } from 'react-icons/io5'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
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
  const cartItemsList = useSelector((state) => state.cartItem.cart)
  const { notDiscountTotalPrice, totalPrice, totalQuantity, fetchCartItem, fetchOrder } =
    useGlobalContext()

  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [openAddressDrawer, setOpenAddressDrawer] = useState(false)

  const activeAddresses = useMemo(
    () => addressList.filter((address) => address.status),
    [addressList]
  )

  const selectedAddress = useMemo(
    () =>
      activeAddresses.find((address) => address._id === selectedAddressId) ||
      activeAddresses[0],
    [activeAddresses, selectedAddressId]
  )

  useEffect(() => {
    if (activeAddresses.length && !selectedAddressId) {
      setSelectedAddressId(activeAddresses[0]._id)
    }
  }, [activeAddresses, selectedAddressId])

  const grandTotal = getOrderGrandTotal(totalPrice)

  const handleClose = () => {
    if (close) close()
  }

  const handleCashOnDelivery = async () => {
    if (!selectedAddress?._id) {
      toast.error('Please select a delivery address')
      setOpenAddressDrawer(true)
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress._id,
          subTotalAmt: totalPrice,
          totalAmt: grandTotal,
        },
      })

      if (response.data.success) {
        toast.success(response.data.message)
        const orderItems = buildSuccessOrderItems(cartItemsList)
        saveLastOrderItems(orderItems)
        fetchCartItem?.()
        fetchOrder?.()
        handleClose()
        navigate('/success', { state: { text: 'Order', items: orderItems } })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    if (!selectedAddress?._id) {
      toast.error('Please select a delivery address')
      setOpenAddressDrawer(true)
      return
    }

    try {
      toast.loading('Loading...')
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      await loadStripe(stripePublicKey)

      saveLastOrderItems(buildSuccessOrderItems(cartItemsList))

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress._id,
          subTotalAmt: totalPrice,
          totalAmt: grandTotal,
        },
      })

      window.location.href = response.data.url
      fetchCartItem?.()
      fetchOrder?.()
    } catch (error) {
      AxiosToastError(error)
    }
  }

  if (!cartItemsList.length) {
    return (
      <section className="fixed inset-0 z-[60] bg-black/50">
        <div className="ml-auto flex h-full w-full max-w-[420px] flex-col bg-[#f8f8f8]">
          <div className="flex shrink-0 items-center gap-3 border-b border-[#eeeeee] bg-white px-4 py-3.5">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1c1c1c] hover:bg-[#f3f3f3]"
            >
              <IoArrowBack size={20} />
            </button>
            <h2 className="text-sm font-semibold text-[#1c1c1c]">My Cart</h2>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-white px-6">
            <p className="text-sm text-[#666666]">Your cart is empty</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 rounded-lg bg-[#0C831F] px-5 py-2.5 text-sm font-bold text-white"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </section>
    )
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
              onClick={handleOnlinePayment}
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
                Proceed To Pay
                <IoChevronForward size={16} />
              </span>
            </button>

            <button
              type="button"
              onClick={handleCashOnDelivery}
              className="mt-2 w-full py-2 text-center text-[10px] font-semibold text-[#0C831F]"
            >
              Pay on delivery instead
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
