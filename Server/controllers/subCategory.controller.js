import SubCategoryModel from "../models/subCategory.model.js";
export const AddSubCategory = async (request, response) => {
    try {
        const { name, image, category } = request.body;
        if (!name || !image ||!category[0]) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }
        const payload = { name, image, category };
        const createSubCategory = new SubCategoryModel(payload);
        const save = await createSubCategory.save();
        return response.status(201).json({
            message: "SubCategory created successfully",
            data: save,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export const GetSubCategory = async (request, response) => {
    try {
        const {page, limit} = request.query
        const total = await SubCategoryModel.countDocuments();
        const data = await SubCategoryModel.find().populate('category').sort({ name: 1 }).skip((page - 1) * limit).limit(parseInt(limit));
        return response.status(200).json({
            message: "SubCategory fetched successfully",
            data : data,
            error: false,
            success: true,
            page : Number(page),
            pages : Math.ceil(total / limit)
        });
    
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false  
        });
    }
}

export const updateSubCategory = async (request, response) => {
    try {
        const {_id, name, image, category } = request.body;
        const checkSub = await SubCategoryModel.findById(_id);
        if (!checkSub) {
            return response.status(404).json({
                message: "SubCategory not found",
                error: true,
                success: false
            });
        }
        const updateSubcat = await SubCategoryModel.findByIdAndUpdate(_id, {
            name, image, category
        })
        return response.status(200).json({
            message: "SubCategory updated successfully",
            data: updateSubcat,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export const deleteSubCategory = async (request,response) => {
    try {
        const {_id} = request.body;
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);
        if (!deleteSub) {
            return response.status(404).json({
                message: "SubCategory not found",
                error: true,
                success: false
            });
        }
        return response.status(200).json({
            message: "SubCategory deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}