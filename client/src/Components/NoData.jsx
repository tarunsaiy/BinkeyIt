import React from 'react'
import NoDataImage from '../assets/Binkeyit Full Stack Ecommerce/nothing here yet.webp'
const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4 gap-2'>
      <img src={NoDataImage} alt="No Data" className='w-36'/>
      <p className='text-neutral-500'>No data</p>
    </div>
  )
}

export default NoData
