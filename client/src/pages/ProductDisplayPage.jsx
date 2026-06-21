import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Axios from "../utils/axios";
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/summaryApi';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js'
import image1 from '../assets/Binkeyit Full Stack Ecommerce/minute_delivery.png'
import image2 from '../assets/Binkeyit Full Stack Ecommerce/Best_Prices_Offers.png'
import image3 from '../assets/Binkeyit Full Stack Ecommerce/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount.js'
import AddToCartButton from '../Components/AddToCartButton.jsx';
import Loading from '../Components/Loading'
import SimilarProducts from '../Components/SimilarProducts'
import validUrl from '../utils/validUrlConvert'

const formatDetailPrice = (price) =>
  DisplayPriceInRupees(price).replace(/\.00$/, '')

const ProductDisplayPage = () => {
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(0)
  const params = useParams()
  const imageContainer = useRef()
  const allCategory = useSelector((state) => state.product.allCategory)
  const allSubCategory = useSelector((state) => state.product.subCategory)
  let productId = params?.product?.split("-").slice(-1)

  const categoryId = data?.category?.[0]?._id || data?.category?.[0]
  const subCategoryId = data?.subCategory?.[0]?._id || data?.subCategory?.[0]
  const category = allCategory.find((item) => item._id === categoryId)
  const subCategory = allSubCategory.find((item) => item._id === subCategoryId)
  const salePrice = pricewithDiscount(data.price, data.discount)
  const hasDiscount = Number(data.discount) > 0
  const listingPath =
    category && subCategory
      ? `/${validUrl(category.name)}-${category._id}/${validUrl(subCategory.name)}-${subCategory._id}`
      : null

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
        // setImage(responseData.data.image[0])
      }
    } catch (error) {
      AxiosToastError(error);
    }
    finally {
      setLoading(false);
    }
  }
  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [params])

  return (
    <> {

      loading ? (
        <Loading color="green" size="w-10 h-10" className="min-h-[70vh]" />
      ) : (
        <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
          <div className=' lg:border-r border-slate-200 flex flex-col items-center justify-center'>
            <div className='rounded lg:min-h-[60vh] lg:max-h-[60vh] min-h-56 max-h-56 h-full w-full'>
              <img src={data.image[image]} alt="product-image" className='w-full h-full object-scale-down' />
            </div>
            <div className='flex items-center justify-center gap-2 my-4'>
              {
                data.image.map((el, ind) => {
                  return (
                    <div className={`bg-slate-200 w-3 h-3 rounded-full ${ind === image && "bg-slate-400"} `} key={ind}>
                    </div>
                  )
                })
              }
            </div>
            <div className='grid'>
              <div ref={imageContainer} className='flex gap-4 w-full overflow-x-auto py-2'>
                {
                  data.image.map((el, ind) => {
                    return (
                      <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md rounded' key={ind}>
                        <img src={data.image[ind]} alt="product-image" className={`w-full h-full object-scale-down ${ind === image && "border border-slate-300"}`} key={el} onClick={() => setImage(ind)} />
                      </div>
                    )
                  })
                }
              </div>

            </div>
          </div>
          <div className='p-4 lg:px-12 lg:py-8 flex flex-col'>
            <nav className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-[#666666]">
              <Link to="/" className="hover:text-[#1c1c1c]">
                Home
              </Link>
              {(subCategory || category) && (
                <>
                  <span>/</span>
                  {listingPath ? (
                    <Link to={listingPath} className="hover:text-[#1c1c1c]">
                      {subCategory?.name || category?.name}
                    </Link>
                  ) : (
                    <span>{subCategory?.name || category?.name}</span>
                  )}
                </>
              )}
              <span>/</span>
              <span className="text-[#999999] line-clamp-1">{data.name}</span>
            </nav>

            <h1 className="text-xl lg:text-[22px] font-bold leading-snug text-[#1c1c1c]">
              {data.name}
            </h1>
            <p className="mt-1 text-sm text-[#666666]">{data.unit}</p>

            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-lg font-bold text-[#1c1c1c]">
                    {formatDetailPrice(salePrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-[#666666]">
                        MRP{' '}
                        <span className="line-through">{formatDetailPrice(data.price)}</span>
                      </span>
                      <span className="rounded bg-[#3b82d9] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight text-white">
                        {data.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#666666]">(Inclusive of all taxes)</p>
              </div>

              {data.stock === 0 ? (
                <p className="shrink-0 text-sm font-semibold text-red-500">Out of Stock</p>
              ) : (
                <AddToCartButton data={data} detailPage />
              )}
            </div>

            <div className='my-4 grid gap-3'>
              <div>
                <p className=''>Description</p>
                <p className='font-medium text-slate-600'>{data.description}</p>
              </div>
              <div>
                <p className=''>Unit</p>
                <p className='text-slate-600'>{data.unit}</p>
              </div>
              {
                data?.more_details && Object.keys(data?.more_details).map((element, index) => {
                  return (
                    <div>
                      <p className='font-semibold'>{element}</p>
                      <p className='text-base'>{data?.more_details[element]}</p>
                    </div>
                  )
                })
              }
            </div>
            <h2 className='font-semibold mt-9 border-t border-slate-200 pt-8'>Why shop from binkeyit? </h2>
            <div className='text-gray-500'>
              <div className='flex  items-center gap-4 my-4'>
                <img
                  src={image1}
                  alt='superfast delivery'
                  className='w-13 h-13'
                />
                <div className=''>
                  <div className='text-xs'>Superfast Delivery</div>
                  <p className='text-xs'>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
                </div>
              </div>
              <div className='flex  items-center gap-4 my-4'>
                <img
                  src={image2}
                  alt='Best prices offers'
                  className='w-13 h-13'
                />
                <div className=''>
                  <div className='text-xs'>Best Prices & Offers</div>
                  <p className='text-xs'>Best price destination with offers directly from the nanufacturers.</p>
                </div>
              </div>
              <div className='flex  items-center gap-4 my-4'>
                <img
                  src={image3}
                  alt='Wide Assortment'
                  className='w-13 h-13'
                />
                <div className=''>
                  <div className='text-xs'>Wide Assortment</div>
                  <p className='text-xs'>Choose from 5000+ products across food personal care, household & other categories.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

    {!loading && categoryId && (
      <SimilarProducts
        categoryId={categoryId}
        categoryName={category?.name}
        excludeProductId={data._id}
      />
    )}

    </>
  )
}

export default ProductDisplayPage
