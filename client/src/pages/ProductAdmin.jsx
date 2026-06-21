import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/axios'
import { IoSearchOutline } from 'react-icons/io5'
import Loading from '../Components/Loading'
import NoData from '../Components/NoData'
import ProductCardAdmin from '../Components/ProductCardAdmin'
import {
  dashboardInputClass,
  dashboardPageClass,
  dashboardScrollAreaClass,
  dashboardSecondaryBtnClass,
  dashboardPaginationTextClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [search, setSearch] = useState('')

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page,
          limit: 18,
          search,
        },
      })
      const { data: responseData } = response
      if (responseData.success) {
        setProductData(responseData.data)
        setTotalPage(responseData.pages)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProductData()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className={dashboardPageClass}>
      <div className="shrink-0">
        <h1 className={dashboardTitleClass}>Product</h1>
        <div className="relative mt-3 max-w-md">
          <IoSearchOutline
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products"
            className={`${dashboardInputClass} pl-10`}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={`mt-4 ${dashboardScrollAreaClass}`}>
        {loading && (
          <div className="flex justify-center py-8">
            <Loading color="green" size="w-8 h-8" />
          </div>
        )}

        {!loading && !productData.length && (
          <div className="flex h-full min-h-[20rem] items-center justify-center">
            <NoData />
          </div>
        )}

        {!loading && productData.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {productData.map((prod) => (
                <ProductCardAdmin
                  data={prod}
                  key={prod._id}
                  fetchProductData={fetchProductData}
                />
              ))}
            </div>

            {totalPage > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={dashboardSecondaryBtnClass}
                >
                  Prev
                </button>
                <span className={dashboardPaginationTextClass}>
                  Page {page} of {totalPage}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
                  disabled={page === totalPage}
                  className={dashboardSecondaryBtnClass}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductAdmin
