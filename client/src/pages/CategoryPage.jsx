import React from 'react'
import UploadCategory from '../Components/UploadCategory'
import { useState } from 'react'
import { useEffect } from 'react';
import Loading from '../Components/Loading';
import NoData from '../Components/NoData';
import Axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/summaryApi';
import EditCategory from '../Components/EditCategory';
import ConfirmBoc from '../Components/ConfirmBoc';
import { useSelector } from 'react-redux';
import {
  dashboardAddBtnClass,
  dashboardCardClass,
  dashboardDangerBtnClass,
  dashboardPageClass,
  dashboardScrollAreaClass,
  dashboardSecondaryBtnClass,
  dashboardItemTitleClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles';

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
                toast.error("Failed to delete category");
            }
        }
        catch(error) {
            AxiosToastError(error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={dashboardPageClass}>
            <div className="shrink-0">
                <h1 className={dashboardTitleClass}>Category</h1>
                <button
                    type="button"
                    onClick={() => setOpenUploadCategory(true)}
                    className={`mt-3 ${dashboardAddBtnClass}`}
                >
                    + Add category
                </button>
            </div>

            <div className={`mt-4 ${dashboardScrollAreaClass}`}>
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loading color="green" size="w-8 h-8" />
                    </div>
                )}

                {!categoryData[0] && !loading && (
                    <div className="flex h-full min-h-[20rem] items-center justify-center">
                        <NoData />
                    </div>
                )}

                {!loading && categoryData.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {categoryData.map((category) => (
                            <div className={dashboardCardClass} key={category._id}>
                                <div className="flex aspect-square items-center justify-center bg-[#fafafa] p-3">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="border-t border-[#eeeeee] px-3 py-2">
                                    <p className={`truncate ${dashboardItemTitleClass}`}>
                                        {category.name}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenEdit(true)
                                                setEditData(category)
                                            }}
                                            className={`flex-1 ${dashboardSecondaryBtnClass}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenConfirmBoxDelete(true)
                                                setDeleteCategory(category)
                                            }}
                                            className={`flex-1 ${dashboardDangerBtnClass}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {openUploadCategory && (
                <UploadCategory fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
            )}
            {openEdit && (
                <EditCategory data={editData} fetchData={fetchCategory} close={()=>setOpenEdit(false)}/>
            )}
            {openConfirmBoxDelete && (
                <ConfirmBoc close={()=>setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDelete}/>
            )}
        </div>
    )
}

export default CategoryPage
