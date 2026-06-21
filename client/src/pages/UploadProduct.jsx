import React from 'react'
import { useState } from 'react'
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa'
import uploadImage from '../utils/uploadImage'
import Loading from '../Components/Loading'
import OpenImage from '../Components/OpenImage'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { IoClose } from 'react-icons/io5'
import AddField from '../Components/AddField'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import toast from "react-hot-toast";
import AxiosToastError from '../utils/AxiosToastError.js'
import {
  dashboardAddBtnClass,
  dashboardInputClass,
  dashboardLabelClass,
  dashboardPageClass,
  dashboardPrimaryBtnClass,
  dashboardScrollAreaClass,
  dashboardSelectClass,
  dashboardTagClass,
  dashboardTextareaClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const UploadProduct = () => {
    const allCategory = useSelector((state) => state.product.allCategory)
    const [data, setData] = useState({
        name: '',
        image: [],
        category: [],
        subCategory: [],
        unit: "",
        stock: "",
        price: "",
        description: "",
        discount: "",
        more_details: {}
    })

    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageURL, setViewImageURL] = useState('')
    const [selectCategory, setSelectCategory] = useState('')
    const [selectSubCategory, setSelectSubCategory] = useState('')
    const allSubCategory = useSelector((state) => state.product.subCategory)
    const [openAddFields, setOpenAddFields] = useState(false)
    const [fieldName, setFieldName] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setImageLoading(true);
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setImageLoading(false);
        setData(prev => ({
            ...prev,
            image: [...prev.image, ImageResponse.data.url]
        }))
    }

    const handleDeleteImage = (ind) => {
        setData(prev => ({
            ...prev,
            image: prev.image.filter((_, index) => index !== ind)
        }))
    }

    const handleDeleteCategory = (ind) => {
        setData(prev => ({
            ...prev,
            category: prev.category.filter((_, index) => index !== ind)
        }))
    }

    const handleDeleteSubCategory = (ind) => {
        setData(prev => ({
            ...prev,
            subCategory: prev.subCategory.filter((_, index) => index !== ind)
        }))
    }

    const handleAddField = () => {
        setData((prev) => ({
            ...prev,
            more_details: {
                ...prev.more_details,
                [fieldName]: ""
            }
        }))
        setFieldName('')
        setOpenAddFields(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.createProduct,
                data : data
            })
            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    image: [],
                    category: [],
                    subCategory: [],
                    unit: "",
                    stock: "",
                    price: "",
                    description: "",
                    discount: "",
                    more_details: {}
                });
            }
        }
        catch (error) {
            AxiosToastError(error);
        }
    }

    return (
        <div className={dashboardPageClass}>
            <div className="shrink-0">
                <h1 className={dashboardTitleClass}>Upload product</h1>
            </div>

            <div className={`mt-4 ${dashboardScrollAreaClass}`}>
                <form className="grid max-w-2xl gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className={dashboardLabelClass}>Name</label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={data.name}
                            name="name"
                            id="name"
                            onChange={handleChange}
                            required
                            className={dashboardInputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className={dashboardLabelClass}>Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter product description"
                            value={data.description}
                            name="description"
                            onChange={handleChange}
                            required
                            rows={3}
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
                                    <Loading color="green" size="w-6 h-6" />
                                ) : (
                                    <>
                                        <FaCloudUploadAlt size={28} className="opacity-40" />
                                        <p className="mt-1 text-xs">Upload image</p>
                                    </>
                                )}
                            </div>
                            <input type="file" id="productImage" className="hidden" onChange={handleUploadImage} accept="image/*" />
                        </label>

                        {data.image.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {data.image.map((img, ind) => (
                                    <div key={ind} className="relative h-20 w-20 rounded-xl border border-[#eeeeee] bg-[#fafafa] p-1">
                                        <img
                                            src={img}
                                            alt="Product"
                                            className="h-full w-full cursor-pointer object-contain"
                                            onClick={() => setViewImageURL(img)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(ind)}
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
                                const value = e.target.value;
                                const category = allCategory.find(cat => cat?._id === value)
                                if (!category || data.category.some(obj => obj._id === category._id)) return;
                                setData(prev => ({
                                    ...prev,
                                    category: [...prev.category, category]
                                }))
                                setSelectCategory('')
                            }}
                        >
                            <option value="">Select category</option>
                            {allCategory.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {data.category.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {data.category.map((cat, ind) => (
                                    <span key={cat._id} className={dashboardTagClass}>
                                        {cat.name}
                                        <button type="button" onClick={() => handleDeleteCategory(ind)} className="text-[#666666] hover:text-red-600">
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
                                const value = e.target.value;
                                const subCategorydetails = allSubCategory.find(cat => cat?._id === value)
                                if (!subCategorydetails) return;
                                setData(prev => {
                                    if (prev.subCategory.some(sc => sc._id === subCategorydetails._id)) return prev
                                    return {
                                        ...prev,
                                        subCategory: [...prev.subCategory, subCategorydetails]
                                    }
                                })
                                setSelectSubCategory('')
                            }}
                        >
                            <option value="">Select sub category</option>
                            {allSubCategory?.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {data.subCategory.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {data.subCategory.map((cat, ind) => (
                                    <span key={cat._id} className={dashboardTagClass}>
                                        {cat.name}
                                        <button type="button" onClick={() => handleDeleteSubCategory(ind)} className="text-[#666666] hover:text-red-600">
                                            <IoClose size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="unit" className={dashboardLabelClass}>Unit</label>
                        <input
                            type="text"
                            placeholder="Enter product unit"
                            value={data.unit}
                            name="unit"
                            id="unit"
                            onChange={handleChange}
                            required
                            className={dashboardInputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="stock" className={dashboardLabelClass}>Number of stock</label>
                        <input
                            type="number"
                            placeholder="Enter number of stock"
                            value={data.stock}
                            name="stock"
                            id="stock"
                            onChange={handleChange}
                            required
                            min={1}
                            className={dashboardInputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className={dashboardLabelClass}>Price</label>
                        <input
                            type="text"
                            id="price"
                            placeholder="Enter product price"
                            value={data.price}
                            name="price"
                            onChange={handleChange}
                            required
                            min={1}
                            className={dashboardInputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="discount" className={dashboardLabelClass}>Discount</label>
                        <input
                            type="text"
                            placeholder="Enter product discount"
                            value={data.discount}
                            name="discount"
                            id="discount"
                            min={0}
                            onChange={handleChange}
                            className={dashboardInputClass}
                        />
                    </div>

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
                                            [k]: e.target.value
                                        }
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
                        Upload product
                    </button>
                </form>
            </div>

            {viewImageURL && (
                <OpenImage url={viewImageURL} close={() => setViewImageURL('')} />
            )}
            {openAddFields && (
                <AddField
                    close={() => setOpenAddFields(false)}
                    onChange={(e) => setFieldName(e.target.value)}
                    onClick={handleAddField}
                    value={fieldName}
                />
            )}
        </div>
    )
}

export default UploadProduct
