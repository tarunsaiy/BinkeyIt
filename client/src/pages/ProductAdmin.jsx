import React, { useEffect } from 'react'
import { useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/summaryApi'
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import { IoSearchOutline } from "react-icons/io5"
import Loading from '../components/Loading';
import ProductCardAdmin from '../Components/ProductCardAdmin';
const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [search, setSearch] = useState("")
  const handleNext = () => {
    if (page === totalPage) return
    setPage(prev => prev + 1)
  }
  const handlePrev = () => {
    if (page === 1) return
    setPage(prev => prev - 1)
  }

  const handleOnChange = async (e) => {
    const { value } = e.target;
    setSearch(value)
    setPage(1)
  }
  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 18,
          search: search
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setProductData(responseData.data)
        setTotalPage(responseData.pages);
      }
    } catch (error) {
      AxiosToastError(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProductData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);




  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-around mb-4'>
        <h2 className="font-semibold ">Product</h2>
        <div className='h-full flex justify-between align-center gap-2 bg-slate-100 p-1 rounded'>
          <IoSearchOutline className='text-slate-500' size={25} />
          <input type="text" placeholder="Search" className="bg-slate-100 rounded-md px-2 py-1 border-none outline-none" value={search} onChange={handleOnChange} />
        </div>

      </div>
      {
        loading && <Loading />
      }
      <div className='p-4 bg-slate-100'>
        <div className='min-h-[55vh]'>
          <div className='grid grid-cols-2 md-grid-cols-4 lg:grid-cols-6 gap-4'>
            {
              productData.map((prod, ind) => {
                return (
                  <ProductCardAdmin data={prod} key={ind} />
                )
              })
            }
          </div>
        </div>
        <div className='mt-4 w-full flex justify-between align-center gap-5'>
          <button onClick={handlePrev} className='bg-white rounded px-2 py-1 hover:cursor-pointer hover:bg-amber-200'>prev</button>
          <button className='bg-white rounded px-2 py-1 hover:cursor-pointer hover:bg-amber-200'>{page}/{totalPage}</button>
          <button onClick={handleNext} className='bg-white rounded px-2 py-1 hover:cursor-pointer hover:bg-amber-200'>next</button>
        </div>
      </div>


    </section>
  )
}

export default ProductAdmin
