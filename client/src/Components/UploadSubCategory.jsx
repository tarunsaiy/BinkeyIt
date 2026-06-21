import React from 'react'
import { IoClose } from "react-icons/io5"
import { useState } from 'react'
import uploadImage from '../utils/uploadImage'
import { useSelector } from 'react-redux'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/axios'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import {
  dashboardCloseBtnClass,
  dashboardInputClass,
  dashboardLabelClass,
  dashboardModalBodyClass,
  dashboardModalHeaderClass,
  dashboardModalOverlayClass,
  dashboardModalTitleClass,
  dashboardModalWideClass,
  dashboardPrimaryBtnClass,
  dashboardSecondaryBtnClass,
  dashboardSelectClass,
  dashboardTagClass,
} from '../utils/dashboardStyles'

const UploadSubCategory = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  })

  const allCategory = useSelector(state => state.product.allCategory);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadSubCategoryImage = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const response = await uploadImage(file);
    const { data: ImageResponse } = response
    setLoading(false);
    setSubCategoryData((prev) => ({
      ...prev,
      image: ImageResponse.data.url
    }))
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
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((item) => item._id !== id)
    }))
  }

  const canSubmit =
    subCategoryData.name &&
    subCategoryData.image &&
    subCategoryData.category.length > 0

  return (
    <section className={dashboardModalOverlayClass}>
      <div className={dashboardModalWideClass}>
        <div className={dashboardModalHeaderClass}>
          <h2 className={dashboardModalTitleClass}>Add sub category</h2>
          <button type="button" onClick={close} className={dashboardCloseBtnClass}>
            <IoClose size={22} />
          </button>
        </div>

        <form className={dashboardModalBodyClass} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className={dashboardLabelClass}>Name</label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className={dashboardInputClass}
              type="text"
              placeholder="Enter sub category name"
            />
          </div>

          <div className="mb-4">
            <p className={dashboardLabelClass}>Image</p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-36 w-full items-center justify-center rounded-xl border border-[#eeeeee] bg-[#fafafa] sm:w-36">
                {!subCategoryData.image ? (
                  <p className="text-sm text-[#999999]">No image selected</p>
                ) : (
                  <img src={subCategoryData.image} alt="sub category" className="h-full w-full object-contain p-2" />
                )}
              </div>
              <label htmlFor="upload-image" className="cursor-pointer">
                <span className={dashboardSecondaryBtnClass}>
                  {loading ? "Uploading..." : "Upload image"}
                </span>
                <input id="upload-image" type="file" className="hidden" onChange={handleUploadSubCategoryImage} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="categorySelect" className={dashboardLabelClass}>Select category</label>
            {subCategoryData.category.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {subCategoryData.category.map((category) => (
                  <span key={category._id} className={dashboardTagClass}>
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category._id)}
                      className="text-[#666666] hover:text-red-600"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <select
              id="categorySelect"
              className={dashboardSelectClass}
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                const categoryDetails = allCategory.find(el => el._id === value)
                if (!categoryDetails) return;
                if (subCategoryData.category.some((obj) => obj._id === categoryDetails._id)) return;
                setSubCategoryData((prev) => ({
                  ...prev,
                  category: [...prev.category, categoryDetails]
                }))
                e.target.value = ""
              }}
            >
              <option value="">Select category</option>
              {allCategory.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={!canSubmit} className={dashboardPrimaryBtnClass}>
            Add sub category
          </button>
        </form>
      </div>
    </section>
  )
}

export default UploadSubCategory
