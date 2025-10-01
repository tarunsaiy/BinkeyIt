import React from 'react'
import UploadCategory from '../Components/UploadCategory'
import { useState } from 'react'
import { useEffect } from 'react';
import Loading from '../Components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/summaryApi';
import EditCategory from '../Components/EditCategory';
import ConfirmBoc from '../Components/ConfirmBoc';
import { useSelector } from 'react-redux';
const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: "",
    });
    const allCategory = useSelector(state => state.product.allCategory);
    useEffect(() => {
        setCategoryData(allCategory)
    }, [])

    const fetchCategory = async () => {
        // to load all the categorys
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response;
            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error);
        }
        finally {
            setLoading(false);
        }
    }

    
    const handleDelete = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })
            const {data : responseData} = response;
            if (responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
            else {
                toast.error("pi");
            }
        }
        catch(error) {
            AxiosToastError(error);
        }
    }
    return (
        <section>
            <div className='p-2 bg-white shadow-md flex items-center justify-between'>
                <h2 className="font-semibold ">Category</h2>
                <button onClick={() => setOpenUploadCategory(true)} className='text-sm  bg-amber-200 px-3 py-1 rounded hover:cursor-pointer'>Add Category</button>
            </div>
            {
                !categoryData[0] && !loading && (
                    <NoData />
                )
            }
            <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 '>
                {
                    categoryData.map((category, index) => {
                        return (
                            <div className='w-32 my-2  h-auto  bg-[#edf4ff] rounded shadow-md' key={category._id}>
                              <img src={category.image} alt={category.name} className='w-52 object-scale-down' />
                              <div className='flex items-center gap-2'>
                                <button onClick={()=> {
                                    setOpenEdit(true)
                                    setEditData(category)
                                    }} className='flex-1 bg-amber-400 cursor-pointer rounded font-medium'>
                                    Edit
                                </button>
                                <button onClick={()=>{
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }} className='flex-1 cursor-pointer bg-red-200 rounded font-medium'>
                                    Delete
                                </button>
                              </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                loading && (
                    <Loading />
                )
            }
            {
                openUploadCategory && (
                    <UploadCategory fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
                )
            }
            {
                openEdit && (
                    <EditCategory data={editData} fetchData={fetchCategory} close={()=>setOpenEdit(false)}/>
                )
            }
            {
                openConfirmBoxDelete && (
                    <ConfirmBoc close={()=>setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDelete}/>
                )
            }
        </section>
    )
}

export default CategoryPage
