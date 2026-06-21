import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBoc from '../Components/ConfirmBoc'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../Components/Loading'
import Axios from '../utils/axios'
import SummaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import {
  dashboardCardClass,
  dashboardDangerBtnClass,
  dashboardSecondaryBtnClass,
  dashboardItemMetaClass,
  dashboardItemTitleClass,
  dashboardPriceClass,
} from '../utils/dashboardStyles'

const formatAdminPrice = (price) =>
  DisplayPriceInRupees(price).replace(/\.00$/, '')

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data,
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success('Product deleted successfully')
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setOpenDelete(false)
      setLoading(false)
    }
  }

  return (
    <>
      <div className={dashboardCardClass}>
        <div className="flex aspect-square items-center justify-center bg-[#fafafa] p-3">
          <img
            src={data?.image?.[0]}
            alt={data.name}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="border-t border-[#eeeeee] px-3 py-2">
          <p className={`line-clamp-2 ${dashboardItemTitleClass}`}>
            {data.name}
          </p>
          <p className={`mt-0.5 ${dashboardItemMetaClass}`}>{data.unit}</p>
          <p className={`mt-1 ${dashboardPriceClass}`}>
            {formatAdminPrice(data.price)}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className={`flex-1 ${dashboardSecondaryBtnClass}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setOpenDelete(true)}
              className={`flex-1 ${dashboardDangerBtnClass}`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}
      {openDelete && (
        <ConfirmBoc
          close={() => setOpenDelete(false)}
          cancel={() => setOpenDelete(false)}
          confirm={handleDelete}
        />
      )}
      {loading && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30">
          <Loading color="green" size="w-10 h-10" className="p-0" />
        </div>
      )}
    </>
  )
}

export default ProductCardAdmin
