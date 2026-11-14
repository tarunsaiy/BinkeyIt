import React, { useEffect, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import UserProfileAvatarEdit from '../Components/UserProfileAvatarEdit'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import fetchUserDetails from '../utils/fetchUserDetails.js'
import Axios from '../utils/axios'
import { setUserDetails } from '../Store/userSlice'
import {
  dashboardInputClass,
  dashboardLabelClass,
  dashboardOutlineBtnClass,
  dashboardPageClass,
  dashboardPrimaryBtnClass,
  dashboardScrollAreaClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
  const [userData, setUserData] = useState({
    name: user?.name,
    email: user?.email,
    mobile: user?.mobile,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserData({
      name: user?.name,
      email: user?.email,
      mobile: user?.mobile,
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      })
      if (response.data.success) {
        toast.success(response.data.message)
        const newdata = await fetchUserDetails()
        dispatch(setUserDetails(newdata.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={dashboardPageClass}>
      <div className="shrink-0">
        <h1 className={dashboardTitleClass}>Account privacy</h1>
      </div>

      <div className={`mt-4 ${dashboardScrollAreaClass}`}>
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#eeeeee] bg-[#fafafa]">
          {user?.avatar ? (
            <img alt={user.name} src={user.avatar} className="h-full w-full object-cover" />
          ) : (
            <FaRegUserCircle size={56} className="text-[#666666]" />
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpenProfileAvatarEdit(true)}
          className={`mt-3 ${dashboardOutlineBtnClass}`}
        >
          Edit photo
        </button>

        {openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
        )}

        <form className="mt-6 grid max-w-lg gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={dashboardLabelClass}>Name</label>
            <input
              type="text"
              id="name"
              required
              placeholder="Enter your name"
              className={dashboardInputClass}
              value={userData?.name}
              onChange={handleChange}
              name="name"
            />
          </div>

          <div>
            <label htmlFor="email" className={dashboardLabelClass}>Email</label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className={dashboardInputClass}
              value={userData?.email}
              onChange={handleChange}
              name="email"
            />
          </div>

          <div>
            <label htmlFor="mobile" className={dashboardLabelClass}>Mobile</label>
            <input
              type="text"
              id="mobile"
              required
              placeholder="Enter your mobile number"
              className={dashboardInputClass}
              value={userData?.mobile}
              onChange={handleChange}
              name="mobile"
            />
          </div>

          <button type="submit" disabled={loading} className={dashboardPrimaryBtnClass}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
