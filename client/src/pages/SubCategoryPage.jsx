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

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
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
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return <div className='flex justify-center items-center'>
          <img src={row.original.image} alt={""} className='w-10 h-10 cursor-pointer' onClick={() => setImageURL(row.original.image)} />
        </div>
      }
    }),
    columnHelper.accessor('category', {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {
              row.original.category.map((c, index) => {
                return (
                  <p key={c._id}>{c.name}</p>
                )
              })
            }
          </>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex justify-center items-center gap-3'>

            <button onClick={() => {

              setOpenEdit(true)
              setEditData(row.original)

            }
            } className='text-sm  bg-amber-400 px-3 py-1 rounded hover:cursor-pointer'>
              <LuPencil size={14} />
            </button>
            <button onClick={() => {
              setOpenConfirmBoxDelete(true)
              setDeleteSubCategory(row.original)
            }} className='text-sm  bg-red-300 px-3 py-1 rounded hover:cursor-pointer'>
              <MdDelete size={14} />
            </button>
          </div>
        )
      }
    }
    )
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
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className="font-semibold ">Category</h2>
        <button onClick={() => setOpenAddSubCategory(true)} className='text-sm  bg-amber-200 px-3 py-1 rounded hover:cursor-pointer'>Add Sub Category</button>
      </div>

      <div className='overflow-auto w-full max-w-[90vw]'>
        <Table data={data} column={columns} />
      </div>
      {/* pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      {
        openAddSubCategory && <UploadSubCategory close={() => setOpenAddSubCategory(false)} fetchData={fetchSubCategory} />
      }
      {
        imageURL && <OpenImage url={imageURL} close={() => setImageURL("")} />
      }
      {
        openEdit && <EditSubCategory data={editData} fetchData={fetchSubCategory} close={() => {
          setOpenEdit(false)
        }} />
      }
      {
        openConfirmBoxDelete && <ConfirmBoc cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDelete} close={() => setOpenConfirmBoxDelete(false)} />
      }
    </section>
  )
}

export default SubCategoryPage
