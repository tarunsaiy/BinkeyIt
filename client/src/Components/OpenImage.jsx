import React from 'react'
import { IoClose } from 'react-icons/io5'

const OpenImage = ({ url, close }) => {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900/70 flex justify-center items-center z-50'>
      <div className='w-full max-w-md max-h-[40vh] bg-white rounded border border-amber-400 shadow-lg p-4'>
        <IoClose size={20} onClick={close} className='ml-auto hover:cursor-pointer' />
        <div className='flex justify-center items-center'>
          <img src={url} alt="Image" className='max-w-full max-h-[35vh] object-contain' />
        </div>
      </div>
    </div>
  )
}

export default OpenImage
