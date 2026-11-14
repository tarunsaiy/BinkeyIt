import React from 'react'
import { IoArrowBack, IoChevronForward } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { useSelector } from 'react-redux'
import CartOrderSummary from './CartOrderSummary'
import { formatOrderPrice, getOrderGrandTotal } from '../utils/orderCharges'

const CartDisplay = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQuantity, openCheckout } = useGlobalContext()
  const cartItem = useSelector((state) => state.cartItem.cart)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  if (!cartItem.length || !totalQuantity) {
    return null
  }

  const grandTotal = getOrderGrandTotal(totalPrice)

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      openCheckout()
      if (close) close()
      return
    }
    navigate('/login')
    if (close) close()
  }

  return (
    <section className="fixed inset-0 z-50 bg-black/50">
      <div className="ml-auto flex h-full w-full max-w-[420px] flex-col bg-[#f8f8f8]">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eeeeee] bg-white px-4 py-3.5">
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1c1c1c] hover:bg-[#f3f3f3]"
            aria-label="Close cart"
          >
            <IoArrowBack size={20} />
          </button>
          <h2 className="text-sm font-semibold text-[#1c1c1c]">My Cart</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto thin-scrollbar p-3">
          <CartOrderSummary
            cartItems={cartItem}
            totalQuantity={totalQuantity}
            notDiscountTotalPrice={notDiscountTotalPrice}
            totalPrice={totalPrice}
          />
        </div>

        <div className="shrink-0 border-t border-[#eeeeee] bg-white p-3">
          <button
            type="button"
            onClick={redirectToCheckoutPage}
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
              {user?._id ? 'Proceed' : 'Login to Proceed'}
              <IoChevronForward size={16} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CartDisplay
