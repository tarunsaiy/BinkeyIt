import React from 'react'
import { IoClose } from "react-icons/io5"
import { useState } from 'react'
import uploadImage from '../utils/uploadImage'
import { useSelector } from 'react-redux'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/axios'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
const UploadSubCategory = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  })
  console.log(subCategoryData.category)
  const allCategory = useSelector(state => state.product.allCategory);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const handleUploadSubCategoryImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const response = await uploadImage(file);
    const { data: ImageResponse } = response
    setLoading(false);
    setSubCategoryData((prev) => {
      return {
        ...prev,
        image: ImageResponse.data.url
      }
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData
      })
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) close();
        if (fetchData) fetchData();
      }
    }
    catch (error) {
      AxiosToastError(error);
    }
  }
  const handleRemoveCategory = (id) => {
    const index = subCategoryData.category.findIndex(el => el._id === id)
    subCategoryData.category.splice(index, 1)
    setSubCategoryData((prev) => {
      return {
        ...prev,
        category: [...prev.category]
      }
    })
  }

  return (
    <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800/70 z-50 flex items-center justify-center'>
      <div className="w-full max-w-5xl bg-white p-4 rounded">
        <div className='flex justify-between items-center gap-3 '>
          <h1 className='font-semibold'>Add Sub-Category</h1>
          <button>
            <IoClose size={24} onClick={close} className='cursor-pointer' />
          </button>
        </div>
        <form className='my-6' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="name">Name</label>
            <input id='name' name='name' value={subCategoryData.name} onChange={handleChange} className='p-3 bg-blue-50 border outline-none focus-within: border-amber-300 rounded' type="text" />
          </div>
          <div className='grid gap-1'>
            <p>Image </p>
            <div className='flex flex-col gap-3 lg:flex-row items-center'>
              <div className=" border border-blue-100 bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center">
                {
                  !subCategoryData.image ? (
                    <p className='text-sm text-neutral-400'>No Image Selected</p>
                  ) : (
                    <img src={subCategoryData.image} alt="category" className='w-full h-full object-scale-down' />
                  )
                }
              </div>
              <label htmlFor="upload-image">

                <div className='px-4 py-2 rounded lg:h-auto w-auto cursor-pointer bg-amber-400'>{
                  loading ? "Uploading..." : "Upload"
                }</div>
                <input id='upload-image' type="file" className='hidden' onChange={handleUploadSubCategoryImage} />
              </label>
            </div>

          </div>

          <div>
            <label htmlFor="">select category</label>
            <div className='border border-blue-50 focus-within:border-amber-300'>
              {/* display value */}
              <div className='flex flex-wrap items-center justify-center gap-2'>
                {
                  subCategoryData.category.map((category, index) => {
                    return (
                      <div key={category?._id + "selectedValue" + index} className='bg-amber-200 my-2 shadow-sm font-semibold px-1.5 rounded flex items-center justify-center gap-1'>
                        {category?.name}
                        <div className='cursor-pointer ml-auto' onClick={() => handleRemoveCategory(category?._id)}>
                          <IoClose size={16} color='red' />
                        </div>
                      </div>
                    )
                  })

                }
              </div>
              {/* select category */}
              <select name="" id="" className='w-full p-2 bg-transparent border-none outline-none' onChange={(e) => {
                const value = e.target.value;
                const categoryDetails = allCategory.find(el => el._id == value)
                if (subCategoryData.category.some((obj) => {
                  return obj._id === categoryDetails._id
                })) return;
                setSubCategoryData((prev) => {
                  return {
                    ...prev,
                    category: [...prev.category, categoryDetails]
                  }

                })
              }}>
                <option value={""}>Select category</option>
                {
                  allCategory.map((category, index) => {
                    return (<option key={category?._id + "subcategory" + index} value={category?._id}>{category?.name}</option>)
                  })
                }
              </select>
            </div>
          </div>
          <button className={`px-4 py-1 ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length > 0 ? "bg-amber-400" : "bg-gray-300 cursor-not-allowed w-full"} rounded mt-5`}>Submit</button>
        </form>
      </div>
    </section>
  )
}

export default UploadSubCategory
