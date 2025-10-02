import React from 'react'
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios.js'
import { useGlobalContext } from '../Provider/GlobalProvider';

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { fetchAddress } = useGlobalContext();
    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                if (close) {
                    close();
                    reset();
                    fetchAddress();
                }
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='bg-black/70 fixed top-0 left-0 right-0 bottom-0 z-50 h-screen overflow-auto'>
            <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold'>Add Address</h2>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>

                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                        <label htmlFor='addressline'>Address Line :</label>
                        <input
                            type='text'
                            id='addressline'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("addressline", { required: "Address line is required" })}
                        />
                        {errors.addressline && <p className="text-red-500 text-sm">{errors.addressline.message}</p>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='city'>City :</label>
                        <input
                            type='text'
                            id='city'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("city", { required: "City is required" })}
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='state'>State :</label>
                        <input
                            type='text'
                            id='state'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("state", { required: "State is required" })}
                        />
                        {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='pincode'>Pincode :</label>
                        <input
                            type='text'
                            id='pincode'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("pincode", { required: "Pincode is required" })}
                        />
                        {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='country'>Country :</label>
                        <input
                            type='text'
                            id='country'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("country", { required: "Country is required" })}
                        />
                        {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='mobile'>Mobile No. :</label>
                        <input
                            type='text'
                            id='mobile'
                            className='border bg-blue-50 p-2 rounded'
                            {...register("mobile", { required: "Mobile number is required" })}
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                    </div>

                    <button type='submit' className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress;
