import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineHome } from 'react-icons/hi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useGlobalContext } from '../Provider/GlobalProvider'
import EditAddressDetails from '../Components/EditAddressDetails'
import AddAddress from '../Components/AddAddress'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import toast from 'react-hot-toast'
import {
  dashboardAddBtnClass,
  dashboardBodyTextClass,
  dashboardItemTitleClass,
  dashboardPageClass,
  dashboardScrollAreaClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const formatAddressLine = (address) =>
  [address.address_line, address.city, address.state, address.country, address.pincode]
    .filter(Boolean)
    .join(', ')

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList)
  const user = useSelector((state) => state.user)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [openMenuId, setOpenMenuId] = useState(null)
  const { fetchAddress } = useGlobalContext()

  useEffect(() => {
    if (!openMenuId) return

    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-address-menu]')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      })
      if (response.data.success) {
        toast.success('Address removed')
        setOpenMenuId(null)
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const activeAddresses = addressList.filter((address) => address.status)

  return (
    <div className={dashboardPageClass}>
      <div className="shrink-0">
        <h1 className={dashboardTitleClass}>My addresses</h1>
        <button
          type="button"
          onClick={() => setOpenAddress(true)}
          className={`mt-3 ${dashboardAddBtnClass}`}
        >
          + Add new address
        </button>
      </div>

      <div className={`mt-4 ${dashboardScrollAreaClass}`}>
        {activeAddresses.map((address) => (
          <div
            key={address._id}
            className="flex items-start gap-3 border-b border-[#eeeeee] py-4 last:border-b-0"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#FFF8E1]">
              <HiOutlineHome className="text-[#C9A227]" size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className={dashboardItemTitleClass}>
                {user?.name || address.mobile}
              </p>
              <p className={`mt-1 ${dashboardBodyTextClass} text-[#666666]`}>
                {formatAddressLine(address)}
              </p>
            </div>

            <div className="relative shrink-0" data-address-menu>
              <button
                type="button"
                onClick={() =>
                  setOpenMenuId((current) =>
                    current === address._id ? null : address._id
                  )
                }
                className="rounded p-1 text-[#666666] hover:bg-[#f3f3f3]"
                aria-label="Address options"
              >
                <BsThreeDotsVertical size={18} />
              </button>

              {openMenuId === address._id && (
                <div className="absolute right-0 top-8 z-10 min-w-[120px] overflow-hidden rounded-lg border border-[#eeeeee] bg-white shadow-md">
                  <button
                    type="button"
                    onClick={() => {
                      setEditData(address)
                      setOpenEdit(true)
                      setOpenMenuId(null)
                    }}
                    className="block w-full px-4 py-2.5 text-left text-xs font-semibold text-[#1c1c1c] hover:bg-[#f8f8f8]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDisableAddress(address._id)}
                    className="block w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-[#f8f8f8]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {openEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  )
}

export default Address
