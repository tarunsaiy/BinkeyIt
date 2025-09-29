import React, { useEffect } from 'react'
import banner from '../assets/Binkeyit Full Stack Ecommerce/banner.jpg'
import mobileBanner from '../assets/Binkeyit Full Stack Ecommerce/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import validUrl from '../utils/validUrlConvert'
import { Navigate, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../Components/CategoryWiseProductDisplay'
const Home = () => {
  const navigate = useNavigate();
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.subCategory);
  const handleRedirectProduct = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })
      return filterData ? true : null
    })
    const url = `/${validUrl(cat)}-${id}/${validUrl(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto'>
        <div className={`w-full h-full min-h-40 rounded ${!banner && 'animate-pulse'} p-2`}>
          <img src={banner} alt='Binkeyit Banner' className='w-full h-full hidden lg:block object-cover' />
          <img src={mobileBanner} alt='Binkeyit Banner' className='w-full h-full block lg:hidden object-cover' />

        </div>
      </div>
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(10).fill(null).map((c, index) => {
              return (
                <div key={index} className='rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-slate-100 min-h-24 rounded'></div>
                  <div className='bg-slate-100 h-8 rounded'></div>

                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={index} className='w-full h-full' onClick={() => handleRedirectProduct(cat._id, cat.name)}>
                  <div>
                    <img src={cat.image} alt={cat.name} className='w-full h-full object-scale-down' />
                  </div>
                </div>
              )
            })
          )
        }
      </div>
        
      {
        categoryData.map((cat, ind) => {
          return (
            <CategoryWiseProductDisplay key={ind} id={cat?._id} name={cat?.name} />
          )
        })
      }

    </section>
  )
}

export default Home
