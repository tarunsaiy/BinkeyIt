import React, { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import UserProfileAvatarEdit from "../Components/UserProfileAvatarEdit";
import { useState } from "react";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUserDetails.js";
import Axios from "../utils/axios";
import { setUserDetails } from "../Store/userSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.name,
        email: user?.email,
        mobile: user?.mobile
    });

    useEffect(() => {
        setUserData({
            name: user?.name,
            email: user?.email,
            mobile: user?.mobile
        })
    }, [user])
    const [loading, setLoading] = useState(false);    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }

        }
        )
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data : userData
            })
            if (response.data.success) {
                toast.success(response.data.message);
                const newdata = await fetchUserDetails();
                dispatch(setUserDetails(newdata.data))
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="p-4">

            <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
                {user?.avatar ? (
                    <img alt="{user.name}" src={user.avatar} className="w-full h-full" />
                ) : (
                    <FaRegUserCircle size={60} />
                )
                }
            </div>
            <button onClick={() => setOpenProfileAvatarEdit(true)} className="text-sm min-w-20 border border-yellow-400 hover:border-yellow-500 hover:bg-yellow-500 rounded-full mt-3 py-1 ">Edit</button>
            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
                )
            }

            {/* <UserProfileAvatarEdit/>         */}
            <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
                <div className="grid">
                    <label htmlFor="">Name</label>
                    <input type="text" required placeholder="Enter your name" className="p-2 bg-blue-50 outline-none border 
                    border-blue-500/10 focus-within:border-yellow-300 rounded" value={userData?.name} onChange={handleChange} name="name" />
                </div>
                <div className="grid">
                    <label htmlFor="">Email</label>
                    <input type="email" required placeholder="Enter your email" className="p-2 bg-blue-50 outline-none border border-blue-500/10 focus-within:border-yellow-300 rounded" value={userData?.email} onChange={handleChange} name="email" />
                </div>
                <div className="grid">
                    <label htmlFor="">Mobile</label>
                    <input type="text" required placeholder="Enter your mobile number" className="p-2 bg-blue-50 outline-none border border-blue-500/10 focus-within:border-yellow-300 rounded" value={userData?.mobile} onChange={handleChange} name="mobile" />
                </div>
                <button className="bg-amber-300 hover:bg-amber-400 text-slate-900 py-2 rounded mt-4 font-semibold cursor-pointer">{
                    loading ? "Loading" : "Save Changes"
}</button>
            </form>
        </div>
    );
};

export default Profile;
