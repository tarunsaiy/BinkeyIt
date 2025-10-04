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
const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem?.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()
    
    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation() // `e.stopPropagation()` is used to prevent the event from bubbling up to the parent element.
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
    return (
        <div className='w-full max-w-[100px]'>
            {
                isAvailableCart ? (
                    <div className='flex  w-full h-full bg-green-600 text-white gap-1 py-1'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                        Add
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
