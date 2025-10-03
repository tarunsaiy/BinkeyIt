import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/axios"
import SummaryApi from "../common/summaryApi.js";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../Store/CartProduct.js";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../Store/addressSlice.js";
import { setOrder } from "../Store/orderSlice.js";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [totalQuantity, setTotalQuantity] = useState(0);
  const cartItem = useSelector(state => state.cartItem?.cart)
  const user = useSelector(state => state?.user)
  const [totalPrice, setTotalPrice] = useState(0)
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
  const fetchCartItem = async () => {
    try {
      const token = localStorage.getItem("access_token");
    if (!token) return; 
      const response = await Axios({
        ...SummaryApi.getCartItem
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data))
      }

    } catch (error) {
      // AxiosToastError(error)
    }
  }
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        fetchCartItem()
        return responseData
      }
    } catch (error) {
      // AxiosToastError(error)
      return error
    }
  }
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItem()
      }
    } catch (error) {
      // AxiosToastError(error)
    }
  }

  useEffect(() => {
    const totalQty = cartItem?.reduce((prev, curr) => prev + curr.quantity, 0);
    setTotalQuantity(totalQty);
    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount)

      return preve + (priceAfterDiscount * curr.quantity)
    }, 0)
    setTotalPrice(tPrice)

    const notDiscountPrice = cartItem.reduce((preve, curr) => {
      return preve + (curr?.productId?.price * curr.quantity)
    }, 0)
    setNotDiscountTotalPrice(notDiscountPrice)
  }, [cartItem])

  const handleLogoutOut = () => {
      localStorage.clear()
      dispatch(handleAddItemCart([]))
  }

  const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("access_token");
    if (!token) return; 
          const response = await Axios({
              ...SummaryApi.getAddress
          })
          const { data: responseData } = response

          if (responseData.success) {
              dispatch(handleAddAddress(responseData.data))
          }
      } catch (error) {
          AxiosToastError(error)
      }
  }
  const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("access_token");
    if (!token) return; 
          const response = await Axios({
              ...SummaryApi.getOrderItems,
          })
          const { data: responseData } = response
          
          if (responseData.success) {
              dispatch(setOrder(responseData.data))
          }
      } catch (error) {
          AxiosToastError(error)
      }
  }

  useEffect(() => {
    fetchCartItem(),
    fetchAddress(),
    fetchOrder()
  }, [user])

  return (
    <GlobalContext.Provider value={{
      fetchCartItem,
      updateCartItem,
      deleteCartItem,
      totalQuantity,
      totalPrice,
      notDiscountTotalPrice,
      handleLogoutOut,
      fetchAddress,
      fetchOrder
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider