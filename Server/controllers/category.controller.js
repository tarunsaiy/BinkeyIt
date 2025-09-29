import { request, response } from "express";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";
export const AddCategoryController = async (request, response) => {
    try {
        const { name, image } = request.body
        if (!name || !image) {
            return response.status(400).json(
                {
                    success: false,
                    error: true,
                    message: "All fields are required"
                }
            );
        }
        const addCategory = new CategoryModel({
            name, image
        })
        const saveCategory = addCategory.save();
        if (!saveCategory) {
            return response.status(400).json(
                {
                    success: false,
                    error: true,
                    message: "Category not added"
                }
            );
        }
        return response.status(200).json(
            {
                success: true,
                message: "Category added successfully",
                data: saveCategory
            }
        );



    } catch (error) {
        return response.status(500).json(
            {
                success: false,
                error: true,
                message: error.message
            });
    }
}

export const getCategoryController = async (request, response) => {
    try {
        const data = await CategoryModel.find().sort({ name: 1 });
        return response.status(200).json(
            {
                success: true,
                error: false,
                message: "Category fetched successfully",
                data: data
            }
        )
    } catch (error) {
        return response.status(500).json(
            {
                success: false,
                error: true,
                message: error.message
            }
        );
    }
}

export const updateCategoryController = async (request, response) => {
    try {
        const { _id, name, image } = request.body;
        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name, image

        })
        return response.status(200).json(
            {
                success: true,
                error: false,
                message: "Category updated successfully",
                data: update
            }
        )
    } catch (error) {
        return response.status(500).json(
            {
                success: false,
                error: true,
                message: error.message
            }
        );
    }
}

export const deleteCategoryController = async (request, response) => {
    try {
        const {_id } = request.body
        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : [_id]
            }
        }).countDocuments();
        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [_id]
            }
        }).countDocuments();

        if (checkSubCategory > 0 || checkProduct > 0) {
            return response.status(400).json(
                {
                    success: false,
                    error: true,
                    message: "Category is associated with other items, cannot be deleted"
                }
            );
        }

        const deletedCategory = await CategoryModel.deleteOne({_id : _id});
        if (!deletedCategory) {
            return response.status(404).json(
                {
                    success: false,
                    error: true,
                    message: "Category not found"
                }
            );
        }
        return response.status(200).json(
            {
                success: true,
                error: false,
                message: "Category deleted successfully",
                data: deletedCategory
            }
        )
    }
    catch (error) {
        return response.status(500).json(
            {
                success: false,
                error: true,
                message: error.message
            }
        );
    }
}