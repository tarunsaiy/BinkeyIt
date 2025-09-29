import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from "../utils/axios";
import AxiosToastError from '../utils/AxiosToastError.js'
import SummaryApi from '../common/summaryApi';
const ProductDisplayPage = () => {
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(0)
  const params = useParams()
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
  useEffect(() => {
    fetchProductDetails();
  }, [params])

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-3'>
      <div className='col-span-2'>
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
          <div className='flex gap-4 w-full overflow-x-auto'>
            {
              data.image.map((el, ind) => {
                return (
                  <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-2xl' key={ind}>
                    <img src={el} alt="product-image" className='w-full h-full object-scale-down' key={el} onClick={() => setImage(ind)} />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
