import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { updateAvatar } from "../Store/userSlice";
import { IoClose } from "react-icons/io5";
const UserProfileAvatarEdit = ({close}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleSumbit = (e) => {
    e.preventDefault();
  };
  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
        const response = await Axios({
      ...SummaryApi.uploadAvatar,
      data: formData,
    });
    const {data: responsedData} = response;
    dispatch(updateAvatar(responsedData.data.avatar))
    }
     catch (error) {
        toast.error(error.response.data.message);
    } finally {
        setLoading(false);
  
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/70 flex justify-center items-center">
      <div
        className="bg-white max-sm w-100 rounded p-4 flex flex-col items-center
      justify-center"
      >
        <button className="w-fit block ml-auto cursor-pointer" onClick={close}>
          <IoClose size = {20}/>
        </button>
        <div className="w-20 h-20 bg-gray-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
          {user.avatar ? (
            <img
              alt="{user.name}"
              src={user.avatar}
              className="w-full h-full"
            />
          ) : (
            <FaRegUserCircle size={60} />
          )}
        </div>
        <form onSubmit={handleSumbit}>
          <label htmlFor="uploadProfile">
            <div className="border border-yellow-300 hover:bg-yellow-300  rounded px-4 py-2 my-3 text-sm">
              {loading ? "Uploading..." : "Upload"}
            </div>
          </label>
          <input
            type="file"
            onChange={handleUploadAvatarImage}
            id="uploadProfile"
           
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
