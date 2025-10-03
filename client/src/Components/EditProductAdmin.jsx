import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Loading from "../Components/Loading";
import OpenImage from "../Components/OpenImage";
import Axios from "../utils/axios.js";
import SummaryApi from "../common/summaryApi.js";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import AxiosToastError from "../utils/AxiosToastError";
// import uploadImage from "../utils/UploadImage";
// import AddFieldComponent from "../components/AddFieldComponent";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const allCategory = useSelector((state) => state.product.allCategory)
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    description: propsData.description,
    discount: propsData.discount,
    more_details: propsData.more_details || {}
  })

  const [imageLoading, setImageLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState('')
  const [selectCategory, setSelectCategory] = useState('')
  const [selectSubCategory, setSelectSubCategory] = useState('')
  const allSubCategory = useSelector((state) => state.product.subCategory)
  const [openAddFields, setOpenAddFields] = useState(false)
  const [fieldName, setFieldName] = useState('')
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    setImageLoading(false);
    setData(prev => {
      return {
        ...prev,
        image: [...prev.image, ImageResponse.data.url]
      }
    })
  }

  const handleDeleteImage = async (ind) => {
    data.image.splice(ind, 1)
    setData(prev => {
      return {
        ...prev,
      }
    })
  }
  const handleDeleteCategory = async (ind) => {
    data.category.splice(ind, 1)
    setData(prev => {
      return {
        ...prev,
      }
    })
  }
  const handleDeleteSubCategory = async (ind) => {
    data.subCategory.splice(ind, 1)
    setData(prev => {
      return {
        ...prev,
        subCategory: [...prev.subCategory]
      }
    })
  }
  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName('')
    setOpenAddFields(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data
      })
      if (response.data.success) {
       if (close) close();
        toast.success(response.data.message);
        fetchProductData();
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          description: "",
          discount: "",
          more_details: {}
        });

      }
    }
    catch (error) {
      AxiosToastError(error);
    }

  }

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black/70 z-50 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        {/* Header */}
        <div className="p-2 bg-white shadow-md flex items-center justify-between">
          <h2 className="font-semibold">Edit Product</h2>
          <button onClick={close} className="cursor-pointer">
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="grid gap-4 p-3" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="bg-slate-100 p-2 outline-none  rounded"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Enter product description"
              className="bg-slate-100 p-2 outline-none  rounded resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className="font-medium">Image</p>
            <label
              htmlFor="productImage"
              className="bg-slate-100 h-24  rounded flex justify-center items-center cursor-pointer"
            >
              <div className="text-center flex flex-col items-center">
                {imageLoading ? (
                  <Loading />
                ) : (
                  <>
                    <FaCloudUploadAlt size={35} />
                    <p>Upload Image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="productImage"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />
            </label>

            {/* Display uploaded images */}
            <div className="flex flex-wrap gap-4 mt-2">
              {data.image?.map((img, index) => (
                <div
                  key={img + index}
                  className="h-20 w-20 bg-slate-100  relative group"
                >
                  <img
                    src={img}
                    alt={img}
                    className="w-full h-full object-scale-down cursor-pointer"
                    onClick={() => setViewImageURL(img)}
                  />
                  <div
                    onClick={() => handleDeleteImage(index)}
                    className="absolute bottom-0 right-0 p-1 bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                  >
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="grid gap-1">
            <label className="font-medium">Category</label>
            <select
              className="bg-slate-100  w-full p-2 rounded"
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value;
                const category = allCategory.find((el) => el._id === value);
                if (category) {
                  setData((prev) => ({
                    ...prev,
                    category: [...prev.category, category],
                  }));
                }
                setSelectCategory("");
              }}
            >
              <option value="">Select Category</option>
              {allCategory?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-3 mt-2">
              {data.category?.map((c, index) => (
                <div
                  key={c._id + index}
                  className="text-sm flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                >
                  <p>{c.name}</p>
                  <IoClose
                    size={18}
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => handleDeleteCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sub Category */}
          <div className="grid gap-1">
            <label className="font-medium">Sub Category</label>
            <select
              className="bg-slate-100  w-full p-2 rounded"
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value;
                const subCategory = allSubCategory.find(
                  (el) => el._id === value
                );
                if (subCategory) {
                  setData((prev) => ({
                    ...prev,
                    subCategory: [...prev.subCategory, subCategory],
                  }));
                }
                setSelectSubCategory("");
              }}
            >
              <option value="">Select Sub Category</option>
              {allSubCategory?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-3 mt-2">
              {data.subCategory?.map((c, index) => (
                <div
                  key={index}
                  className="text-sm flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                >
                  <p>{c.name}</p>
                  <IoClose
                    size={18}
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => handleDeleteSubCategory(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Other Fields */}
          {["unit", "stock", "price", "discount"].map((field) => (
            <div key={field} className="grid gap-1">
              <label htmlFor={field} className="font-medium capitalize">
                {field}
              </label>
              <input
                id={field}
                name={field}
                type={field === "unit" ? "text" : "number"}
                value={data[field]}
                onChange={handleChange}
                required
                placeholder={`Enter product ${field}`}
                className="bg-slate-100 p-2 outline-none  rounded"
              />
            </div>
          ))}

          {/* Dynamic More Fields */}
          <div>
            {
              Object.keys(data?.more_details)?.map((k, ind) => {
                return (
                  <div className='grid gap-1' key={k + ind + "more_details"}>
                    <label htmlFor="k">{k}</label>
                    <input type="text"

                      value={data?.more_details[k]}

                      id={k}
                      onChange={(e) => {
                        setData((prev) => {
                          return {
                            ...prev,
                            more_details: {
                              ...prev.more_details,
                              [k]: e.target.value
                            }
                          }
                        })
                      }}
                      required
                      className='bg-slate-100 p-2 outline-none border border-transparent focus-within:border-amber-300 rounded' />
                  </div>
                )
              })
            }
          </div>

          <div onClick={() => setOpenAddFields(true)} className='flex items-center text-sm gap-0.5 font-semibold text-green-600 w-max justify-center  cursor-pointer'>
            <FaPlus size={12} />
            Add Fields
          </div>

          <button
            type="submit"
            className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold"
          >
            Update Product
          </button>
        </form>

        {/* Image Preview */}
        {viewImageURL && (
          <OpenImage url={viewImageURL} close={() => setViewImageURL("")} />
        )}

        {/* Add Field Modal */}
        {openAddFields && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddFields(false)}
          />
        )}
      </div>
    </section>
  );
};

export default EditProductAdmin;
