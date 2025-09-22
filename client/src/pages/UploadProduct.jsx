import React from 'react'
import { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import uploadImage from '../utils/uploadImage'
import Loading from '../components/Loading'
import OpenImage from '../Components/OpenImage'
import { MdDelete } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { IoClose } from 'react-icons/io5'
const UploadProduct = () => {
    const allCategory = useSelector((state) => state.product.allCategory)
    const [data, setData] = useState({
        name: '',
        image: [],
        category: [],
        subCategoty: [],
        unit: [],
        stock: "",
        price: "",
        description: "",
        discount: "",
        more_details: {}
    })
    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageURL, setViewImageURL] = useState('')
    const [selectCategory, setSelectCategory] = useState('')
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
    return (
        <section>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className="font-semibold ">Upload Product</h2>
            </div>
            <div className='grid p-3 '>
                <form className='grid gap-3 '>
                    <div className='grid gap-1'>
                        <label htmlFor="name">Name</label>
                        <input type="text"
                            placeholder='Enter product name'
                            value={data.name}
                            name='name'
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
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
                            className='bg-blue-50 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                    </div>
                    <div>
                        <p>Image</p>
                        <div>
                            <label htmlFor='productImage' className='bg-blue-50 h-24 outline-none border border-transparent focus-within:border-amber-300 rounded flex justify-center items-center cursor-pointer'>
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
                                    <div className='my-4 bg-blue-50 flex gap-2 p-2'>
                                        {
                                            data.image.map((img, ind) => {
                                                return (
                                                    <div key={ind} className='h-20 w-20 min-w-20 bg-blue-50 relative border border-amber-300 rounded p-1'>
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
                            <select name="" id="" className='bg-blue-50 border border-blue-50 w-full p-2 rounded' value={selectCategory}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const category = allCategory.find(cat => cat?._id === value)
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
                            {
                                data.category.map((cat, ind) => {
                                    return (
                                        <div key = {cat._id}>
                                            <p key={ind + "cat"}>{cat.name}</p>
                                            <div>
                                                <IoClose />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </form>
            </div>
            {
                viewImageURL && (

                    <OpenImage url={viewImageURL} close={() => setViewImageURL('')} />
                )
            }
        </section>
    )
}

export default UploadProduct
