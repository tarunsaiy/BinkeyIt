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
import successSound from '../assets/success-sound.mp3';
import  AxiosToastError from '../utils/AxiosToastError.js'
import playSound from '../utils/playsound.js'
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
        setData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setImageLoading(true);
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setImageLoading(false);
        setData(prev => {
            return {
                ...prev,
                image: [...prev.image, ImageResponse.data.url]
            }
        })
    }
    const handleDeleteImage = async (ind) => {
        data.image.splice(ind, 1)
        setData(prev => {
            return {
                ...prev,
            }
        })
    }
    const handleDeleteCategory = async (ind) => {
        data.category.splice(ind, 1)
        setData(prev => {
            return {
                ...prev,
            }
        })
    }
    const handleDeleteSubCategory = async (ind) => {
        data.subCategory.splice(ind, 1)
        setData(prev => {
            return {
                ...prev,
                subCategory: [...prev.subCategory]
            }
        })
    }
    const handleAddField = () => {
        setData((prev) => {
            return {
                ...prev,
                more_details: {
                    ...prev.more_details,
                    [fieldName]: ""
                }
            }
        })
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
                // playSound(successSound)
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
        <section>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className="font-semibold ">Upload Product</h2>
            </div>
            <div className='grid p-3 '>
                <form className='grid gap-3 ' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name</label>
                        <input type="text"
                            placeholder='Enter product name'
                            value={data.name}
                            name='name'
                            id='name'
                            onChange={handleChange}
                            required
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="description">Descrption</label>
                        <textarea type="text"
                            id='description'
                            placeholder='Enter product description'
                            value={data.description}
                            name='description'
                            onChange={handleChange}
                            required
                            rows={3}
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div>
                        <p>Image</p>
                        <div>
                            <label htmlFor='productImage' className='bg-slate-100 h-24 outline-none border border-transparent focus-within:border-amber-300 rounded flex justify-center items-center cursor-pointer'>
                                <div className='flex flex-col items-center'>
                                    {
                                        imageLoading ? <Loading /> : (
                                            <>
                                                <FaCloudUploadAlt size={30} opacity={0.3} />
                                                <p>Upload Image</p>
                                            </>
                                        )
                                    }

                                </div>
                                <input type="file" id='productImage' className='hidden' onChange={handleUploadImage} accept='image/*' />
                            </label>
                            {
                                data.image.length > 0 && (
                                    <div className='my-4 bg-slate-100 flex gap-2 p-2'>
                                        {
                                            data.image.map((img, ind) => {
                                                return (
                                                    <div key={ind} className='h-20 w-20 min-w-20 bg-slate-100 relative border border-amber-300 rounded p-1'>
                                                        <img src={img} alt="Image" className='h-full w-full object-scale-down cursor-pointer' onClick={() => setViewImageURL(img)} />
                                                        <div onClick={() => handleDeleteImage(ind)} className='absolute top-1 right-0 hover:cursor-pointer bg-black rounded hover:bg-white hover:border'>
                                                            <MdDelete size={18} color='limegreen' />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }

                        </div>

                    </div>
                    <div>
                        <label htmlFor="">Category</label>
                        <div>
                            <select name="" id="" className='bg-slate-100 border border-blue-50 w-full p-2 rounded' value={selectCategory}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const category = allCategory.find(cat => cat?._id === value)
                                    if (data.category.some(obj => obj._id === category._id)) return;
                                    setData(prev => {
                                        return {
                                            ...prev,
                                            category: [...prev.category, category]
                                        }
                                    })
                                    setSelectCategory('')
                                }}>
                                <option value="">Select Category</option>
                                {
                                    allCategory.map((cat, ind) => {
                                        return (
                                            <option key={ind + "categ"} value={cat?._id}>{cat.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className='flex flex-wrap gap-3 mt-3'>
                                {
                                    data.category.map((cat, ind) => {
                                        return (
                                            <div
                                                key={cat._id}
                                                className="text-sm flex items-center justify-center gap-1 bg-red-500 rounded text-red-50 font-semibold p-0.5 relative overflow-hidden"
                                            >
                                                <p key={ind + "cat"}>{cat.name}</p>
                                                <div className='cursor-pointer' onClick={() => handleDeleteCategory(ind)}>
                                                    <IoClose />
                                                </div>

                                                {/* Shine overlay */}
                                                <span
                                                    className="absolute top-0 left-[-50%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 pointer-events-none rounded"
                                                    style={{
                                                        animation: "shine 2s ease-in-out infinite",
                                                    }}
                                                ></span>
                                                {/* Inline keyframes */}
                                                <style>
                                                    {`
                                                        @keyframes shine {
                                                            0% { left: -50%; }
                                                            100% { left: 100%; }
                                                        }
                                                    `}
                                                </style>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="">Sub Category</label>
                        <div>
                            <select name="" id="" className='bg-slate-100 border border-blue-50 w-full p-2 rounded' value={selectSubCategory}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const subCategorydetails = allSubCategory.find(cat => cat?._id === value)

                                    setData(prev => {
                                        if (!prev.subCategory.some(sc => sc._id === subCategorydetails._id)) {
                                            return {
                                                ...prev,
                                                subCategory: [...prev.subCategory, subCategorydetails]
                                            }
                                        }
                                        return prev

                                    })
                                    setSelectSubCategory('')
                                }}>
                                <option value="">Select Sub Category</option>
                                {
                                    allSubCategory?.map((cat, ind) => {
                                        return (
                                            <option key={ind + "categ"} value={cat?._id}>{cat.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className='flex flex-wrap gap-3 mt-3'>
                                {
                                    data.subCategory?.map((cat, ind) => {
                                        return (
                                            <div
                                                key={cat._id + "subcat"}
                                                className="text-sm flex items-center justify-center gap-1 bg-red-500 rounded text-red-50 font-semibold p-0.5 relative overflow-hidden"
                                            >
                                                <p key={ind + "subcat"}>{cat.name}</p>
                                                <div className='cursor-pointer' onClick={() => handleDeleteSubCategory(ind)}>
                                                    <IoClose />
                                                </div>

                                                {/* Shine overlay */}
                                                <span
                                                    className="absolute top-0 left-[-50%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 pointer-events-none rounded"
                                                    style={{
                                                        animation: "shine 2s ease-in-out infinite",
                                                    }}
                                                ></span>
                                                {/* Inline keyframes */}
                                                <style>
                                                    {`
                                                        @keyframes shine {
                                                            0% { left: -50%; }
                                                            100% { left: 100%; }
                                                        }
                                                    `}
                                                </style>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="unit">Unit</label>
                        <input type="text"
                            placeholder='Enter product unit'
                            value={data.unit}
                            name='unit'
                            id='unit'
                            onChange={handleChange}
                            required
                            min={1}
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="stock">Number of Stock</label>
                        <input type="number"
                            placeholder='Enter number of stock'
                            value={data.stock}
                            name='stock'
                            id='stock'
                            onChange={handleChange}
                            required
                            min={1}
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="price">Price</label>
                        <input type="text"
                            id='price'
                            placeholder='Enter product price'
                            value={data.price}
                            name='price'
                            onChange={handleChange}
                            required
                            min={1}
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="discount">Discount</label>
                        <input type="text"
                            placeholder='Enter product discount'
                            value={data.discount}
                            name='discount'
                            id='discount'
                            min={0}
                            onChange={handleChange}
                           
                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>

                    <div>
                        {
                            Object.keys(data?.more_details)?.map((k, ind) => {
                                return (
                                    <div className='grid gap-1' key={k+ ind + "more_details"}>
                                        <label htmlFor="k">{k}</label>
                                        <input type="text"
                                            
                                            value={data?.more_details[k]}

                                            id={k}
                                            onChange={(e) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        more_details: {
                                                            ...prev.more_details,
                                                            [k]: e.target.value
                                                        }
                                                    }
                                                })
                                            }}
                                            required
                                            className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div onClick={() => setOpenAddFields(true)} className='flex items-center text-sm gap-0.5 font-semibold text-green-600 w-max justify-center  cursor-pointer'>
                        <FaPlus size={12} />
                        Add Fields
                    </div>

                    <button type='submit' className='bg-amber-400 py-1 px-2 rounded mt-3'>Upload</button>
                </form>
            </div>
            {
                viewImageURL && (

                    <OpenImage url={viewImageURL} close={() => setViewImageURL('')} />
                )
            }
            {
                openAddFields && (
                    <AddField
                        close={() => setOpenAddFields(false)}
                        onChange={(e) => setFieldName(e.target.value)}
                        onClick={handleAddField}
                        value={fieldName}
                    />
                )
            }
        </section>
    )
}

export default UploadProduct
