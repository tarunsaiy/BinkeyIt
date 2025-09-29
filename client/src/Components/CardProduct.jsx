import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import validUrl from '../utils/validUrlConvert'

const CardProduct = ({data}) => {
    const url = `/product/${validUrl(data.name)}-${data._id}`
  return (
    <Link to={url} className='border border-slate-200 shadow-sm p-4 grid gap-3 max-w-48 lg:min-w-48 h-70 rounded '>
        <div className='min-h-20 max-h-32 rounded'>
            <img src={data?.image[0]} alt={data.name} className='w-full h-full object-cover'/>
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
        <div className='flex justify-between font-semibold text-slate-800  items-center gap-3'>
            <div className=''>
                {DisplayPriceInRupees(data.price)}/-
            </div>
            <div className=''>
                <button className='bg-green-600 text-yellow-200 rounded px-4 py-1 hover:cursor-pointer hover:bg-green-700'>Add</button>
            </div>
        </div>
      
    </Link>
  )
}

export default CardProduct
