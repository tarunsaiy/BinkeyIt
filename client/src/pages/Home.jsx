import React from 'react'

import banner from '../assets/Binkeyit Full Stack Ecommerce/banner.jpg'

import mobileBanner from '../assets/Binkeyit Full Stack Ecommerce/banner-mobile.jpg'

import { useSelector } from 'react-redux'

import validUrl from '../utils/validUrlConvert'

import CardLoading from '../Components/CardLoading'

import { useNavigate } from 'react-router-dom'

import CategoryWiseProductDisplay from '../Components/CategoryWiseProductDisplay'

const Home = () => {
  const navigate = useNavigate()
  const loadingCategory = useSelector((state) => state.product.loadingCategory)
  const categoryData = useSelector((state) => state.product.allCategory)
  const subCategoryData = useSelector((state) => state.product.subCategory)

  const handleRedirectProduct = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id
      })
      return filterData ? true : null
    })

    const url = `/${validUrl(cat)}-${id}/${validUrl(subcategory.name)}-${subcategory._id}`

    navigate(url)
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div className={`w-full h-full min-h-40 rounded ${!banner && 'animate-pulse'}`}>
          <img
            src={banner}
            alt="Binkeyit Banner"
            className="w-full h-full hidden lg:block object-cover"
          />
          <img
            src={mobileBanner}
            alt="Binkeyit Banner"
            className="w-full h-full block lg:hidden object-cover"
          />
        </div>
      </div>

      {loadingCategory ? (
        <>
          <div className="container mx-auto my-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-lg bg-[#f3f4f6]"
              />
            ))}
          </div>

          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="container mx-auto flex items-center justify-between gap-4 py-3">
                <div className="h-5 w-28 animate-pulse rounded bg-[#f3f4f6]" />
                <div className="h-4 w-14 animate-pulse rounded bg-[#f3f4f6]" />
              </div>
              <div className="container mx-auto">
                <div className="flex items-stretch gap-2 overflow-hidden pb-4">
                  {Array.from({ length: 6 }).map((_, ind) => (
                    <CardLoading key={`${section}-${ind}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="container mx-auto my-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {categoryData.map((cat, index) => (
              <div
                key={index}
                className="h-full w-full cursor-pointer"
                onClick={() => handleRedirectProduct(cat._id, cat.name)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-scale-down"
                />
              </div>
            ))}
          </div>

          {categoryData.map((cat, ind) => (
            <CategoryWiseProductDisplay
              key={ind}
              id={cat?._id}
              name={cat?.name}
            />
          ))}
        </>
      )}
    </section>
  )
}

export default Home
