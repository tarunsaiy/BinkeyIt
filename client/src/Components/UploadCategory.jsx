import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/axios';
import SummaryApi from '../common/summaryApi';
import { toast } from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError.js';
import {
  dashboardCloseBtnClass,
  dashboardInputClass,
  dashboardLabelClass,
  dashboardModalBodyClass,
  dashboardModalClass,
  dashboardModalHeaderClass,
  dashboardModalOverlayClass,
  dashboardModalTitleClass,
  dashboardPrimaryBtnClass,
  dashboardSecondaryBtnClass,
} from '../utils/dashboardStyles';

const UploadCategory = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setLoading(true);
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setLoading(false);
        setData((prev) => ({
            ...prev,
            image: ImageResponse.data.url
        }))
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

    const canSubmit = data.name && data.image

    return (
        <section className={dashboardModalOverlayClass}>
            <div className={dashboardModalClass}>
                <div className={dashboardModalHeaderClass}>
                    <h2 className={dashboardModalTitleClass}>Add category</h2>
                    <button type="button" onClick={close} className={dashboardCloseBtnClass}>
                        <IoClose size={22} />
                    </button>
                </div>

                <form className={dashboardModalBodyClass} onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="categoryName" className={dashboardLabelClass}>Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={data.name}
                            placeholder="Enter category name"
                            name="name"
                            onChange={handleChange}
                            className={dashboardInputClass}
                        />
                    </div>

                    <div className="mb-6">
                        <p className={dashboardLabelClass}>Image</p>
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-36 w-full items-center justify-center rounded-xl border border-[#eeeeee] bg-[#fafafa] sm:w-36">
                                {data.image ? (
                                    <img src={data.image} alt="category" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <p className="text-sm text-[#999999]">No image</p>
                                )}
                            </div>
                            <label htmlFor="image" className="cursor-pointer">
                                <span className={dashboardSecondaryBtnClass}>
                                    {loading ? "Uploading..." : "Upload image"}
                                </span>
                                <input
                                    disabled={!data.name}
                                    onChange={handleUpload}
                                    name="image"
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className={dashboardPrimaryBtnClass}
                    >
                        Add category
                    </button>
                </form>
            </div>
        </section>
    )
}

export default UploadCategory
