import React, { useEffect } from 'react'
import { useState } from 'react'
import SummaryApi from '../common/summaryApi'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Axios from '../utils/axios.js'
import toast from 'react-hot-toast'
import Loading from '../Components/Loading.jsx'
import AxiosToastError from '../utils/AxiosToastError'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { Navigate, useNavigate } from 'react-router-dom'
const AddToCartButton = ({ data, outlined = false, compact = false, detailPage = false }) => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate()
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem?.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {

        e.preventDefault()
        e.stopPropagation() // `e.stopPropagation()` is used to prevent the event from bubbling up to the parent element.
        if (!user || !user._id) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addToCart,
                data: {
                    productId: data._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)
        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)
            if (response.success) {
                toast.success("Item remove")
            }
        }
    }
    const addButtonClass = detailPage
        ? "bg-[#0C831F] hover:bg-[#0a6b19] text-white font-semibold rounded-lg cursor-pointer"
        : outlined
        ? "border border-[#0c831f] bg-white text-[#0c831f] hover:bg-green-50 font-bold rounded-lg cursor-pointer uppercase"
        : "bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer";

    const addButtonSize = detailPage
        ? "px-5 py-2.5 text-sm min-w-[120px] whitespace-nowrap"
        : compact
        ? "px-4 py-1.5 text-xs min-w-[58px]"
        : "px-2 lg:px-4 py-1";

    const qtyWrapClass = detailPage
        ? "flex h-[40px] min-w-[100px] items-center justify-between rounded-lg bg-[#0C831F] px-1.5 text-white"
        : compact
        ? "flex h-[32px] min-w-[72px] items-center justify-between rounded-lg bg-[#0c831f] px-1 text-white"
        : outlined
            ? "flex w-full h-full gap-0.5 border border-[#0c831f] rounded-lg overflow-hidden bg-white text-[#0c831f]"
            : "flex w-full h-full bg-green-600 text-white gap-1 py-1 rounded-lg";

    const qtyBtnClass = detailPage
        ? "flex h-full w-8 shrink-0 cursor-pointer items-center justify-center text-white hover:opacity-80"
        : compact
        ? "flex h-full w-7 shrink-0 cursor-pointer items-center justify-center text-white hover:opacity-80"
        : outlined
            ? "border border-[#0c831f] bg-white text-[#0c831f] hover:bg-green-50 flex-1 w-full p-1 flex items-center justify-center cursor-pointer"
            : "bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 flex items-center justify-center cursor-pointer";

    const qtyTextClass = detailPage
        ? "min-w-[20px] text-center text-sm font-semibold text-white"
        : compact
        ? "min-w-[16px] text-center text-sm font-bold text-white"
        : `flex-1 w-full font-semibold px-1 flex items-center justify-center ${outlined ? "text-[#0c831f]" : ""}`;

    const wrapperClass = detailPage
        ? "shrink-0"
        : compact
        ? "w-full min-w-[72px]"
        : "w-full max-w-[100px]";

    return (
        <div className={wrapperClass}>
            {
                isAvailableCart ? (
                    <div className={qtyWrapClass}>
                        <button type="button" onClick={decreaseQty} className={qtyBtnClass} aria-label="Decrease quantity">
                            <FaMinus size={detailPage ? 12 : compact ? 11 : 12} />
                        </button>

                        <span className={qtyTextClass}>{qty}</span>

                        <button type="button" onClick={increaseQty} className={qtyBtnClass} aria-label="Increase quantity">
                            <FaPlus size={detailPage ? 12 : compact ? 11 : 12} />
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={handleADDTocart} className={`${addButtonClass} ${addButtonSize}`}>
                        {detailPage ? "Add to cart" : compact ? "ADD" : "Add"}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
