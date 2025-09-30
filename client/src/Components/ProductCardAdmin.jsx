import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBoc from '../components/ConfirmBoc'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({data, fetchProductData}) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleDelete = async() => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data
      })
      const {data : responseData} = response
      if (responseData.success) {
        toast.success('Product deleted successfully')
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    }
    finally{
      setOpenDelete(false)
      setLoading(false)
    }
  }

  return (
    <div className='w-36 p-4 shadow-lg rounded  bg-white'>
      <div className=''>
        <img src={data?.image[0]} alt={data.name} className='w-full h-full object-scale-down'/>
      </div>
      <p className='text-xs text-ellipsis line-clamp-2 font-semibold text-slate-900'>{data.name}</p>
      <p className='text-slate-500 text-xs'>{data.unit}</p>
      <p className='font-semibold text-slate-900 text-sm pt-2'>{data.price}/-</p>
      <div className='grid grid-cols-2 gap-3 py-2'>
          <button onClick={()=>setEditOpen(true)} className='border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded'>Edit</button>
          <button onClick={()=>setOpenDelete(true)} className='border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded w-fit'>Delete</button>
        </div>
        {
          editOpen && <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)}/>
        }
        {
          openDelete && <ConfirmBoc close={() => setOpenDelete(false)} cancel={() => setOpenDelete(false)} confirm={handleDelete}/>
        }{
          loading && <Loading/>
        }
    </div>
  )
}

export default ProductCardAdmin
