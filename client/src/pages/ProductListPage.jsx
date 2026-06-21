import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/summaryApi'
import CardLoading from '../Components/CardLoading.jsx'
import CardProduct from '../Components/CardProduct.jsx'
import { useSelector } from 'react-redux'
import validUrl from '../utils/validUrlConvert.js'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const allSubCategory = useSelector((state) => state.product.subCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  const categoryId = params.category.split('-').slice(-1)[0]
  const subCategoryId = params.subCategory.split('-').slice(-1)[0]

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const respose = await Axios({
          ...SummaryApi.getProductByCategoryAndSubCategory,
          data: {
            categoryId,
            subCategoryId,
            page: 1,
            limit: 30,
          },
        })
        const { data: responseData } = respose
        if (responseData.success) {
          setData(responseData.data)
        }
      } catch (error) {
        AxiosToastError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [subCategoryId, categoryId])

  useEffect(() => {
    const sub = allSubCategory.filter((s) =>
      s.category.some((el) => String(el._id) === String(categoryId))
    )
    setDisplaySubCategory(sub)
  }, [allSubCategory, categoryId])

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div className="flex h-[calc(100dvh-68px)] overflow-hidden lg:h-[calc(100dvh-72px)]">
          <aside className="no-scrollbar w-[92px] shrink-0 overflow-y-auto border-r border-[#eeeeee] bg-white sm:w-[108px]">
            {displaySubCategory.map((s) => {
              const link = `/${validUrl(s?.category[0]?.name)}-${s?.category[0]?._id}/${validUrl(s.name)}-${s._id}`
              const isActive = String(subCategoryId) === String(s._id)

              return (
                <Link
                  to={link}
                  key={s._id}
                  className={`relative flex flex-col items-center gap-1.5 border-b border-[#eeeeee] px-2 py-3 text-center transition-colors ${
                    isActive ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 right-0 top-0 w-[3px] bg-[#0C831F]" />
                  )}

                  <div className="flex h-11 w-11 items-center justify-center">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p
                    className={`line-clamp-2 text-[10px] leading-tight ${
                      isActive
                        ? 'font-bold text-[#1c1c1c]'
                        : 'font-normal text-[#666666]'
                    }`}
                  >
                    {s.name}
                  </p>
                </Link>
              )
            })}
          </aside>

          <div className="no-scrollbar min-w-0 flex-1 overflow-y-auto bg-[#f8f8f8] lg:bg-white">
            {loading ? (
              <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 sm:gap-3 sm:p-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardLoading key={index} fluid />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 sm:gap-3 sm:p-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.map((p, index) => (
                  <CardProduct
                    data={p}
                    key={p._id + 'productSubCategory' + index}
                    fluid
                  />
                ))}
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-sm text-[#666666]">
                No products found in this category
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
