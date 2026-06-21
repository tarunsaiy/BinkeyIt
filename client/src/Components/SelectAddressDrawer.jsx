import React, { useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { HiOutlineHome, HiOutlinePencil } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import AddAddress from './AddAddress'
import EditAddressDetails from './EditAddressDetails'
import { formatAddressLine } from '../utils/addressHelpers'

const SelectAddressDrawer = ({ close, selectedAddressId, onSelectAddress }) => {
  const addressList = useSelector((state) => state.addresses.addressList)
  const user = useSelector((state) => state.user)
  const [openAddAddress, setOpenAddAddress] = useState(false)
  const [openEditAddress, setOpenEditAddress] = useState(false)
  const [editData, setEditData] = useState({})

  const activeAddresses = addressList.filter((address) => address.status)

  const handleSelect = (address) => {
    onSelectAddress(address._id)
    if (close) close()
  }

  return (
    <>
      <section className="fixed inset-0 z-[70] bg-black/50">
        <div className="ml-auto flex h-full w-full max-w-[420px] flex-col bg-[#f8f8f8]">
          <div className="flex shrink-0 items-center gap-3 border-b border-[#eeeeee] bg-white px-4 py-3.5">
            <button
              type="button"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1c1c1c] hover:bg-[#f3f3f3]"
              aria-label="Close address selection"
            >
              <IoArrowBack size={20} />
            </button>
            <h2 className="text-xs font-bold text-[#1c1c1c]">Select delivery address</h2>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto thin-scrollbar p-4">
            <button
              type="button"
              onClick={() => setOpenAddAddress(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-[#eeeeee] bg-white px-4 py-4 text-left shadow-sm"
            >
              <span className="text-base font-bold text-[#0C831F]">+</span>
              <span className="text-xs font-bold text-[#0C831F]">Add a new address</span>
            </button>

            {activeAddresses.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-[10px] font-normal text-[#666666]">Your saved address</p>

                <div className="flex flex-col gap-3">
                  {activeAddresses.map((address) => {
                    const isSelected = selectedAddressId === address._id

                    return (
                      <div
                        key={address._id}
                        className={`relative rounded-xl border bg-white p-4 shadow-sm ${
                          isSelected ? 'border-[#0C831F]' : 'border-[#eeeeee]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setEditData(address)
                            setOpenEditAddress(true)
                          }}
                          className="absolute right-4 top-4 text-[#0C831F] hover:opacity-80"
                          aria-label="Edit address"
                        >
                          <HiOutlinePencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelect(address)}
                          className="flex w-full items-start gap-3 pr-6 text-left"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#f3f4f6]">
                            <HiOutlineHome className="text-[#C9A227]" size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#1c1c1c]">
                              {user?.name || address.mobile}
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-[#666666]">
                              {formatAddressLine(address)}
                            </p>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {openAddAddress && (
        <AddAddress close={() => setOpenAddAddress(false)} />
      )}

      {openEditAddress && (
        <EditAddressDetails
          data={editData}
          close={() => setOpenEditAddress(false)}
        />
      )}
    </>
  )
}

export default SelectAddressDrawer
