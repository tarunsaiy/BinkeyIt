import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/axios';
import SummaryApi from '../common/summaryApi';
import { toast } from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError.js';
import Loading from '../Components/Loading.jsx';
const UploadCategory = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setLoading(true);
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setLoading(false);

        setData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
           
            const response = await Axios({
                ...SummaryApi.addCategory,
                data : data
            })
            const {data : responseData} = response;
            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        }
        catch (error) {
            AxiosToastError(error);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 flex items-center justify-center'>
            <div className="bg-white max-w-4xl w-full p-4 rounded">
                <div className="flex items-center justify-between">
                    <h1>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto hover:cursor-pointer'>
                        <IoClose size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-3'>
                        <label id='categoryName'>Name</label>
                        <input type="text" id='categoryName' value={data.name} placeholder='Enter category name' name='name' onChange={handleChange}
                            className='bg-blue-50 p-2 border border-blue-100 focus-within:border-amber-200 outline-none rounded' />
                    </div>
                    <div className='grid gap-4'>
                        <p>Image</p>
                        <div className="flex gap-5 flex-col lg:flex-row items-center">
                            <div className="border border-blue-100 bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                                {
                                    data.image ? (
                                        <img src={data.image} alt="category" className='w-full h-full object-scale-down' />
                                    ) : (
                                        <p className="text-sm text-neutral-500">No Image</p>
                                    )
                                }

                            </div>
                            <label htmlFor='image' className='cursor-pointer'>
                                <div className={`${!data.name ? "bg-gray-400" : "bg-amber-300"} px-4 py-2 rounded lg:h-auto w-auto cursor-pointer`}>{
                                    loading ? "Uploading..." : "Upload Image"
}</div>

                                <input disabled={!data.name} onChange={handleUpload} name="image" type="file" id="image" className='hidden' />

                            </label>
                        </div>
                    </div>
                    <button className={`${data.name && data.image ? "bg-amber-400" : "bg-gray-400"} px-4 py-2 w-full mt-6 rounded hover:cursor-pointer`} disabled={!data.name || !data.image}>Add Category</button>
                </form>
                
            </div >

        </section >
    )
}

export default UploadCategory
