import React, { useEffect, useState } from 'react'
import UploadSubCategory from '../Components/UploadSubCategory'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/axios'
import Table from '../Components/Table'
import OpenImage from '../Components/OpenImage'
import { createColumnHelper } from '@tanstack/react-table'
import { LuPencil } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'
import EditSubCategory from '../Components/EditSubCategory'
import ConfirmBoc from '../Components/ConfirmBoc'
import toast from 'react-hot-toast'
import {
  dashboardAddBtnClass,
  dashboardDangerBtnClass,
  dashboardPageClass,
  dashboardScrollAreaClass,
  dashboardSecondaryBtnClass,
  dashboardItemTitleClass,
  dashboardPaginationTextClass,
  dashboardTagMutedClass,
  dashboardTitleClass,
} from '../utils/dashboardStyles'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageURL, setImageURL] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const columnHelper = createColumnHelper()

  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
        params: { page, limit }
      })
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data)
        setTotalPages(responseData.pages);
      }
    } catch (error) {
      AxiosToastError(error);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchSubCategory();
  }, [page])

  const columns = [
    columnHelper.accessor('name', {
      header: "Name",
      cell: ({ row }) => (
        <span className={dashboardItemTitleClass}>
          {row.original.name}
        </span>
      ),
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center'>
            <button
              type="button"
              onClick={() => setImageURL(row.original.image)}
              className="rounded-lg border border-[#eeeeee] p-0.5"
            >
              <img src={row.original.image} alt="" className="h-8 w-8 object-contain" />
            </button>
          </div>
        )
      }
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.category.map((c) => (
              <span
                key={c._id}
                className={dashboardTagMutedClass}
              >
                {c.name}
              </span>
            ))}
          </div>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-2'>
            <button
              type="button"
              onClick={() => {
                setOpenEdit(true)
                setEditData(row.original)
              }}
              className={dashboardSecondaryBtnClass}
            >
              <LuPencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenConfirmBoxDelete(true)
                setDeleteSubCategory(row.original)
              }}
              className={dashboardDangerBtnClass}
            >
              <MdDelete size={14} />
            </button>
          </div>
        )
      }
    })
  ]

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenConfirmBoxDelete(false);
      }
    }
    catch (error) {
      AxiosToastError(error);
    }
  }

  return (
    <div className={dashboardPageClass}>
      <div className="shrink-0">
        <h1 className={dashboardTitleClass}>Sub category</h1>
        <button
          type="button"
          onClick={() => setOpenAddSubCategory(true)}
          className={`mt-3 ${dashboardAddBtnClass}`}
        >
          + Add sub category
        </button>
      </div>

      <div className={`mt-4 ${dashboardScrollAreaClass}`}>
        <div className="overflow-x-auto">
          <Table data={data} column={columns} loading={loading} />
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={dashboardSecondaryBtnClass}
            >
              Prev
            </button>
            <span className={dashboardPaginationTextClass}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={dashboardSecondaryBtnClass}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {openAddSubCategory && (
        <UploadSubCategory close={() => setOpenAddSubCategory(false)} fetchData={fetchSubCategory} />
      )}
      {imageURL && <OpenImage url={imageURL} close={() => setImageURL("")} />}
      {openEdit && (
        <EditSubCategory
          data={editData}
          fetchData={fetchSubCategory}
          close={() => setOpenEdit(false)}
        />
      )}
      {openConfirmBoxDelete && (
        <ConfirmBoc
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
          close={() => setOpenConfirmBoxDelete(false)}
        />
      )}
    </div>
  )
}

export default SubCategoryPage
