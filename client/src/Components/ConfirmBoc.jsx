import React from 'react'
import { IoClose } from "react-icons/io5";
const ConfirmBoc = ({cancel, confirm, close}) => {
  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-800/70  flex items-center justify-center'>
      <div className='bg-white w-full max-w-md p-4 rounded'>
        <div className='flex justify-between items-center gap-3'>
            <h1 className='text-semibold'>Permanent Delete</h1>
            <button>
                <IoClose onClick={close} className='text-2xl hover:cursor-pointer'/>
            </button>
        </div>
        <p className='my-4'>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className='w-fit ml-auto flex justify-between items-center gap-3'>
            <button onClick={cancel} className='px-3 py-1  rounded bg-gray-500 font-medium cursor-pointer'>Cancel</button>
            <button onClick={confirm} className='px-3 py-1  rounded bg-amber-400 font-medium cursor-pointer'>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmBoc;