import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../Provider/GlobalProvider'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/axios'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const FieldLabel = ({ htmlFor, children, required = false }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-[#666666]">
    {children}
    {required && <span className="text-[#666666]"> *</span>}
  </label>
)

const EditAddressDetails = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile,
    },
  })
  const { fetchAddress } = useGlobalContext()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: {
          ...formData,
          address_line: formData.address_line,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          mobile: formData.mobile,
        },
      })

      if (response.data.success) {
        toast.success(response.data.message)
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
          <h2 className="text-base font-bold text-[#1c1c1c]">Edit address</h2>
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
          <div className="mb-4">
            <FieldLabel htmlFor="address_line" required>
              Address
            </FieldLabel>
            <input
              type="text"
              id="address_line"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('address_line', { required: true })}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="city" required>
              City
            </FieldLabel>
            <input
              type="text"
              id="city"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('city', { required: true })}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="state" required>
              State
            </FieldLabel>
            <input
              type="text"
              id="state"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('state', { required: true })}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="pincode" required>
              Pincode
            </FieldLabel>
            <input
              type="text"
              id="pincode"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('pincode', { required: true })}
            />
          </div>

          <div className="mb-4">
            <FieldLabel htmlFor="country" required>
              Country
            </FieldLabel>
            <input
              type="text"
              id="country"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('country', { required: true })}
            />
          </div>

          <div className="mb-6">
            <FieldLabel htmlFor="mobile" required>
              Mobile number
            </FieldLabel>
            <input
              type="text"
              id="mobile"
              className="w-full rounded-xl border border-[#eeeeee] px-3 py-3 text-sm text-[#1c1c1c] outline-none focus:border-[#0C831F]"
              {...register('mobile', { required: true })}
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

export default EditAddressDetails
