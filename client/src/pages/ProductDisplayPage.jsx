import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from "../utils/axios";
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/summaryApi';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js'
import image1 from '../assets/Binkeyit Full Stack Ecommerce/minute_delivery.png'
import image2 from '../assets/Binkeyit Full Stack Ecommerce/Best_Prices_Offers.png'
import image3 from '../assets/Binkeyit Full Stack Ecommerce/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount.js'
import AddToCartButton from '../Components/AddToCartButton.jsx';
import Loading from '../Components/Loading'

const ProductDisplayPage = () => {
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)
  const params = useParams()
  const imageContainer = useRef()
  let productId = params?.product?.split("-").slice(-1)

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
  }, [params])

  return (
    <> {

      loading ? (
        <Loading />
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
          <div className='p-4 lg:px-20 py-8 flex flex-col gap-2 '>
            <p className='bg-green-300 w-fit px-2 rounded-full mb-1 text-xs py-0.5'>10 Min</p>
            <h2 className='text-lg lg:text-lg font-semibold text-slate-800'>{data.name}</h2>
            <div className='flex items-center justify-between mt-2'>
              <div className='flex flex-col gap-1.5'>
                <p className='text-slate-500 text-xs'>{data.unit}</p>
                <div className='flex gap-2 items-center'>
                  <p className='font-bold text-slate-800 text-lg'>{DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}</p>
                  <div className='flex gap-1 text-xs  text-slate-500 items-center'>
                    <p>MRP</p>
                    <p className=' line-through text-slate-500'>{data.price}</p>
                  </div>
                  <p className='bg-blue-500 text-white rounded px-1 text-xs py-0.5'>{data.discount}% off</p>
                </div>
              </div>
              {
                data.stock === 0 ? (
                  <p className='text-red-500 text-xs'>Out of Stock</p>
                ) : (

                  <AddToCartButton data={data} />
                )
              }
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

    </>
  )
}

export default ProductDisplayPage
