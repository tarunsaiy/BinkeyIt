import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import CardLoading from './CardLoading'
import ProductCardAdmin from './ProductCardAdmin'
import CardProduct from './CardProduct'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import validUrl from '../utils/validUrlConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef();
    // for scrolling
    // const handleScroll = () => {
    // containerRef.current.scrollLeft += 10
    // }
    const navigate = useNavigate();
    const loadingCategory = useSelector((state) => state.product.loadingCategory);
    const categoryData = useSelector((state) => state.product.allCategory);
    const subCategoryData = useSelector((state) => state.product.subCategory);
    const handleRedirectProduct = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })
            return filterData ? true : null
        })
        const url = `/${validUrl(name)}-${id}/${validUrl(subcategory?.name)}-${subcategory?._id}`
        return url
    }
    const URL = handleRedirectProduct()
    const fetchCategoryWiseProducts = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })
            const { data: responseData } = response
            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProducts()
    }, [])
    const loadingCardNumber = new Array(6).fill(null)
    return (
        <div>
            <div className='container mx-auto p-2 flex items-center justify-between gap-4'>
                <h3 className='font-bold text-lg text-slate-700'>{name}</h3>
                <Link to={URL} className="text-green-600">See All</Link>
            </div>
            <div className='flex items-center gap-4 md:gap-5 lg:gap-6 overflow-x-auto p-4  mx-auto thin-scrollbar' ref={containerRef}>
                {
                    loading && loadingCardNumber.map((_, ind) => {
                        return (
                            <CardLoading key={ind} />
                        )
                    })
                }
                {
                    data.map((p, ind) => {
                        return (
                            <CardProduct key={ind} data={p} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
