import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from "../utils/axios";
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/summaryApi';
import Loading from '../components/Loading.jsx'
import CardProduct from '../Components/CardProduct.jsx';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom"
import validUrl from '../utils/validUrlConvert.js';

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const params = useParams();
  const allSubCategory = useSelector((state) => state.product.subCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split('-');
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1).join(' ')
  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]
  // console.log(categoryId, subCategoryId, subCategoryName)
  const fetchProductData = async () => {
    try {
      setLoading(true)
      const respose = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8
        }
      })
      const { data: responseData } = respose
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        }
        else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.total)
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
  }, [params])


  useEffect(() => {
    const sub = allSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id === categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [allSubCategory])


  return (
      <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px_1fr]  md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr]'>
        {/**sub category **/}
        <div className=' min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md  bg-white py-2'>
          {
            displaySubCategory.map((s, index) => {
               const link = `/${validUrl(s?.category[0]?.name)}-${s?.category[0]?._id}/${validUrl(s.name)}-${s._id}`
              return (
                <Link to={link} key={index} className={`p-1 flex flex-col justify-center items-center shadow-md cursor-pointer lg:grid lg:grid-cols-[50px_1fr] ${subCategoryId === s._id ? "bg-green-200" : ""}`}
                >
                  <div className='w-fit max-w-28 ' >
                    <img
                      src={s.image}
                      alt='subCategory'
                      className=' w-14 object-scale-down'
                    />
                  </div>
                  <p className='lg:mt-0 text-xs text-center'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>

           <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4  w-full mx-auto'>
                {
                  data.map((p, index) => {
                    return (
                      <CardProduct
                        data={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    )
                  })
                }
              </div>
           </div>

            {
              loading && (
                <Loading />
              )
            }

          </div>
        </div>
        
      </div>
    </section>
  )
}

export default ProductListPage
