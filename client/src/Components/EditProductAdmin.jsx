import React, { useState } from 'react'
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import Loading from '../Components/Loading'
import OpenImage from '../Components/OpenImage'
import AddField from '../Components/AddField'
import Axios from '../utils/axios.js'
import SummaryApi from '../common/summaryApi.js'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import uploadImage from '../utils/uploadImage'
import {
  dashboardAddBtnClass,
  dashboardCloseBtnClass,
  dashboardInputClass,
  dashboardLabelClass,
  dashboardModalBodyClass,
  dashboardModalHeaderClass,
  dashboardModalOverlayClass,
  dashboardModalTitleClass,
  dashboardModalWideClass,
  dashboardPrimaryBtnClass,
  dashboardSelectClass,
  dashboardTagClass,
  dashboardTextareaClass,
} from '../utils/dashboardStyles'

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const allCategory = useSelector((state) => state.product.allCategory)
  const allSubCategory = useSelector((state) => state.product.subCategory)

  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    description: propsData.description,
    discount: propsData.discount,
    more_details: propsData.more_details || {},
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState('')
  const [selectCategory, setSelectCategory] = useState('')
  const [selectSubCategory, setSelectSubCategory] = useState('')
  const [openAddFields, setOpenAddFields] = useState(false)
  const [fieldName, setFieldName] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    setImageLoading(false)
    setData((prev) => ({
      ...prev,
      image: [...prev.image, ImageResponse.data.url],
    }))
  }

  const handleDeleteImage = (ind) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== ind),
    }))
  }

  const handleDeleteCategory = (ind) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, index) => index !== ind),
    }))
  }

  const handleDeleteSubCategory = (ind) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, index) => index !== ind),
    }))
  }

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: '',
      },
    }))
    setFieldName('')
    setOpenAddFields(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data,
      })
      if (response.data.success) {
        if (close) close()
        toast.success(response.data.message)
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className={dashboardModalOverlayClass}>
      <div className={dashboardModalWideClass}>
        <div className={dashboardModalHeaderClass}>
          <h2 className={dashboardModalTitleClass}>Edit product</h2>
          <button type="button" onClick={close} className={dashboardCloseBtnClass}>
            <IoClose size={22} />
          </button>
        </div>

        <form className={`${dashboardModalBodyClass} grid gap-4`} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={dashboardLabelClass}>Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className={dashboardInputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={dashboardLabelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Enter product description"
              className={dashboardTextareaClass}
            />
          </div>

          <div>
            <p className={dashboardLabelClass}>Image</p>
            <label
              htmlFor="productImage"
              className="flex h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#eeeeee] bg-[#fafafa] hover:border-[#0C831F]"
            >
              <div className="flex flex-col items-center text-[#666666]">
                {imageLoading ? (
                  <Loading color="green" size="w-6 h-6" className="p-0" />
                ) : (
                  <>
                    <FaCloudUploadAlt size={28} className="opacity-40" />
                    <p className="mt-1 text-xs">Upload image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="productImage"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />
            </label>

            {data.image?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.image.map((img, index) => (
                  <div
                    key={img + index}
                    className="relative h-20 w-20 rounded-xl border border-[#eeeeee] bg-[#fafafa] p-1"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full cursor-pointer object-contain"
                      onClick={() => setViewImageURL(img)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                    >
                      <MdDelete size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="categorySelect" className={dashboardLabelClass}>Category</label>
            <select
              id="categorySelect"
              className={dashboardSelectClass}
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value
                const category = allCategory.find((el) => el._id === value)
                if (!category || data.category.some((obj) => obj._id === category._id)) return
                setData((prev) => ({
                  ...prev,
                  category: [...prev.category, category],
                }))
                setSelectCategory('')
              }}
            >
              <option value="">Select category</option>
              {allCategory?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {data.category?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.category.map((c, index) => (
                  <span key={c._id + index} className={dashboardTagClass}>
                    {c.name}
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(index)}
                      className="text-[#666666] hover:text-red-600"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="subCategorySelect" className={dashboardLabelClass}>Sub category</label>
            <select
              id="subCategorySelect"
              className={dashboardSelectClass}
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value
                const subCategory = allSubCategory.find((el) => el._id === value)
                if (!subCategory || data.subCategory.some((obj) => obj._id === subCategory._id)) return
                setData((prev) => ({
                  ...prev,
                  subCategory: [...prev.subCategory, subCategory],
                }))
                setSelectSubCategory('')
              }}
            >
              <option value="">Select sub category</option>
              {allSubCategory?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {data.subCategory?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.subCategory.map((c, index) => (
                  <span key={c._id + index} className={dashboardTagClass}>
                    {c.name}
                    <button
                      type="button"
                      onClick={() => handleDeleteSubCategory(index)}
                      className="text-[#666666] hover:text-red-600"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {['unit', 'stock', 'price', 'discount'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className={dashboardLabelClass}>
                {field === 'stock' ? 'Number of stock' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'unit' ? 'text' : field === 'price' || field === 'discount' ? 'text' : 'number'}
                value={data[field]}
                onChange={handleChange}
                required={field !== 'discount'}
                placeholder={`Enter product ${field}`}
                className={dashboardInputClass}
              />
            </div>
          ))}

          {Object.keys(data?.more_details || {}).map((k) => (
            <div key={k}>
              <label htmlFor={k} className={dashboardLabelClass}>{k}</label>
              <input
                type="text"
                value={data.more_details[k]}
                id={k}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [k]: e.target.value,
                    },
                  }))
                }}
                required
                className={dashboardInputClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setOpenAddFields(true)}
            className={`flex w-fit items-center gap-1 ${dashboardAddBtnClass}`}
          >
            <FaPlus size={12} />
            Add field
          </button>

          <button type="submit" className={dashboardPrimaryBtnClass}>
            Update product
          </button>
        </form>

        {viewImageURL && (
          <OpenImage url={viewImageURL} close={() => setViewImageURL('')} />
        )}
        {openAddFields && (
          <AddField
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            onClick={handleAddField}
            close={() => setOpenAddFields(false)}
          />
        )}
      </div>
    </section>
  )
}

export default EditProductAdmin
