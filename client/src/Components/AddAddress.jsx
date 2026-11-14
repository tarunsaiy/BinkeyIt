import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { HiOutlineHome, HiOutlineLocationMarker } from 'react-icons/hi'
import { MdOutlineApartment, MdOutlineHotel } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios.js'
import { useGlobalContext } from '../Provider/GlobalProvider'
import useGeolocation from '../hooks/useGeolocation'
import { useSelector } from 'react-redux'
import { buildAddressPayload } from '../utils/addressHelpers'

const ADDRESS_TYPES = [
  { id: 'home', label: 'Home', icon: HiOutlineHome },
  { id: 'work', label: 'Work', icon: MdOutlineApartment },
  { id: 'hotel', label: 'Hotel', icon: MdOutlineHotel },
  { id: 'other', label: 'Other', icon: HiOutlineLocationMarker },
]

const FieldLabel = ({ htmlFor, children, required = false }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-[#666666]">
    {children}
    {required && <span className="text-[#666666]"> *</span>}
  </label>
)

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { fetchAddress } = useGlobalContext()
  const { address: geoAddress } = useGeolocation()
  const user = useSelector((state) => state.user)
  const [addressType, setAddressType] = useState('home')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const payload = buildAddressPayload({
        flat: data.flat,
        floor: data.floor,
        area: data.area,
        landmark: data.landmark,
        mobile: data.mobile || user?.mobile,
      })

      const response = await Axios({
        ...SummaryApi.createAddress,
        data: payload,
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        reset()
        fetchAddress()
        if (close) close()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[#eeeeee] px-4 py-4">
          <h2 className="text-base font-bold text-[#1c1c1c]">Enter complete address</h2>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666666] hover:bg-[#f3f3f3]"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form
          className="min-h-0 flex-1 overflow-y-auto thin-scrollbar px-4 py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldLabel required>Save address as</FieldLabel>
          <div className="mb-4 flex flex-wrap gap-2">
            {ADDRESS_TYPES.map(({ id, label, icon: Icon }) => {
              const isActive = addressType === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAddressType(id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold ${
                    isActive
                      ? 'border-[#0C831F] bg-[#f0fdf4] text-[#1c1c1c]'
                      : 'border-[#eeeeee] bg-white text-[#666666]'
                  }`}
                >
                  <Icon size={14} className="text-[#C9A227]" />
                  {label}
                </button>
              )
            })}
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="flat" required>
              Flat / House no / Building name
            </FieldLabel>
            <input
              type="text"
              id="flat"
              placeholder="Flat / House no / Building name"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('flat', { required: 'This field is required' })}
            />
            {errors.flat && (
              <p className="mt-1 text-xs text-red-500">{errors.flat.message}</p>
            )}
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="floor">Floor (optional)</FieldLabel>
            <input
              type="text"
              id="floor"
              placeholder="Floor (optional)"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('floor')}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="area" required>
              Area / Sector / Locality
            </FieldLabel>
            <input
              type="text"
              id="area"
              defaultValue={geoAddress && geoAddress !== 'Enable location access' ? geoAddress : ''}
              placeholder="Area / Sector / Locality"
              className="w-full rounded-xl border border-[#eeeeee] bg-[#fafafa] px-3 py-3 text-sm font-semibold text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('area', { required: 'This field is required' })}
            />
            {errors.area && (
              <p className="mt-1 text-xs text-red-500">{errors.area.message}</p>
            )}
          </div>

          <div className="mb-5">
            <FieldLabel htmlFor="landmark">Nearby landmark (optional)</FieldLabel>
            <input
              type="text"
              id="landmark"
              placeholder="Nearby landmark (optional)"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('landmark')}
            />
          </div>

          <p className="mb-4 text-xs text-[#999999]">
            Enter your details for seamless delivery experience
          </p>

          <div className="mb-4">
            <FieldLabel htmlFor="name" required>
              Your name
            </FieldLabel>
            <input
              type="text"
              id="name"
              defaultValue={user?.name || ''}
              placeholder="Your name"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <FieldLabel htmlFor="mobile">Your phone number (optional)</FieldLabel>
            <input
              type="text"
              id="mobile"
              defaultValue={user?.mobile || ''}
              placeholder="Your phone number"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('mobile')}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-[#0C831F] py-3.5 text-sm font-bold text-white disabled:opacity-70"
          >
            {submitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Save address'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AddAddress
