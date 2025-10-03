import React from 'react'
import { useLocation } from 'react-router-dom'
import CardProduct from '../Components/CardProduct'
import { useState } from 'react'
import { useEffect } from 'react'
import Loading from '../Components/Loading'
import Axios from '../utils/axios.js'
import SummaryApi from '../common/summaryApi.js'
import toast from 'react-hot-toast'
import noDataImage from '../assets/Binkeyit Full Stack Ecommerce/nothing here yet.webp'
import AxiosToastError from "../utils/AxiosToastError";
import CardLoading from '../Components/CardLoading'
import InfiniteScroll from 'react-infinite-scroll-component'
const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()

  const searchText = params?.search?.slice(3)
  
  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
      
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [page, searchText])

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Results: {data.length}  </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
            {
              data.map((p, index) => {
                return (
                  <CardProduct data={p} key={p?._id + "searchProduct" + index} />
                )
              })
            }

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingsearchpage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {
          //no data 
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full mx-auto'>
              <img
                src={noDataImage}
                className='w-full h-full max-w-xs max-h-xs block'
              />
              <p className='font-semibold my-2'>No Data found</p>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default SearchPage
