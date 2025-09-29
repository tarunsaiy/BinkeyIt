import React from 'react'

const ProductCardAdmin = ({data}) => {
  return (
    <div className='w-36 p-4 shadow-lg rounded  bg-white'>
      <div className=''>
        <img src={data?.image[0]} alt={data.name} className='w-full h-full object-scale-down'/>
      </div>
      <p className='text-xs text-ellipsis line-clamp-2 font-semibold text-slate-900'>{data.name}</p>
      <p className='text-slate-500 text-xs'>{data.unit}</p>
      <p className='font-semibold text-slate-900 text-sm pt-2'>{data.price}/-</p>
    </div>
  )
}

export default ProductCardAdmin
