import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import validUrl from '../utils/validUrlConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useGlobalContext } from '../Provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {


    const url = `/product/${validUrl(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)

    return (
        <Link to={url} className='border border-slate-200 p-4 grid gap-3 max-w-48 min-w-48 h-70 rounded-2xl'>
            <div className='min-h-20 max-h-32 rounded relative'>
                {data.discount > 0 &&
                    (
                        <div className='bg-blue-500 text-white px-1 text-xs py-0.5 absolute -top-4 -left-1 flex items-center flex-col justify-center font-semibold'>
                            <p className='text-xs'>
                                {data.discount}%
                            </p>
                            <p className='text-xs'>OFF</p>
                        </div>
                    )}
                <img src={data?.image[0]} alt={data.name} className='w-full h-full object-cover' />
            </div>
            <div className='px-2 text-green-600 bg-green-100 text-xs font-semibold rounded w-fit'>
                10 min
            </div>
            <div className='font-medium text-ellipsis line-clamp-1'>
                {data.name}
            </div>
            <div className='px-1 w-fit text-gray-700 text-xs'>
                {data.unit}
            </div>
            <div className='flex justify-between  items-center gap-3'>
                <div className=''>
                    <p className='font-semibold text-slate-800 '>
                        {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                    </p>
                    <p className='text-gray-500 text-xs font-semibold'>
                        <del>{DisplayPriceInRupees(data.price)}</del>
                    </p>

                </div>
                <div className=''>
                    {data.stock === 0 ? (
                        <p className='text-red-600 text-center'>Out of Stock</p>
                    ) :
                        (
                            <AddToCartButton data={data} />
                        )
                    }
                </div>
            </div>

        </Link>
    )
}

export default CardProduct
