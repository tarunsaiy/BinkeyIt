import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddField = ({close, onChange, onClick, value}) => {
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-900/70 flex justify-center items-center'>
        <div className="bg-white rounded p-4 w-full max-w-md">
            <div className='flex justify-between items-center gap-3'>
                <h1 className='font-semibold'>Add Field</h1>
                <button onClick={close} className='cursor-pointer'>
                    <IoClose/>
                </button>

            </div>
            <input onChange={onChange} value={value}
             type="text" className='bg-slate-100 my-3 w-full focus-within:outline-amber-300 rounded p-2' placeholder='Enter feild name'/>
            <button onClick={onClick} className='my-3 mx-auto flex items-center gap-2 w-max justify-center bg-yellow-400 py-1 px-2 rounded cursor-pointer'>Add Field</button>
        </div>
    </section>
  )
}

export default AddField
