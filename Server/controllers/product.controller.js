import ProductModel from '../models/product.model.js';
import Product from '../models/product.model.js';
export const createProduct = async (request, response) => {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        } = request.body;
        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !stock || !price || !description) {
            return response.status(400).json(
                {
                    message: "Please provide all required fields",
                    success: false,
                    error: true
                }
            );
        }
        const payload = {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        }
        const product = new Product(payload);
        const saveproduct = await product.save();
        return response.status(201).json({
            message: "Product created successfully",
            data: saveproduct,
            success: true,
            error: false
        });
    }
    catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}
export const getProduct = async (request, response) => {
    try {
        let { search, page, limit } = request.body;
        const query = search ? {
            $text: {
                $search: search
            }
        } : {};
        const total = await Product.countDocuments(query);
        const data = await Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).populate('category').populate('subCategory');
        return response.status(200).json({
            message: "Product fetched successfully",
            data: data,
            error: false,
            success: true,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total: total
        });

    }
    catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}
export const getProductByCategory = async (request, response) => {
    try {
        const { id } = request.body
        if (!id) {
            return response.status(400).json(
                {
                    message: "Please provide category id",
                    success: false,
                    error: true
                }
            );
        }
        const product = await Product.find({
            category: { $in: id }
        }).limit(15)
        return response.json({
            message: "Product fetched successfully",
            data: product,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}
export const getProductByCategoryAndSubCategory = async (request, response) => {
    try {
        const {categoryId, subCategoryId, limit, page} = request.body
        if (!categoryId || !subCategoryId) {
            return response.status(400).json(
                {
                    message: "Please provide category and subCategory id",
                    success: false,
                    error: true
                }
            );
        }
        if ( !page) page = 1
        if (!limit) limit = 15
        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId }
        }
        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            ProductModel.countDocuments(query)
        ])
        return response.status(200).json({
            message: "Product fetched successfully",
            data: data,
            error: false,
            success: true,
            page: Number(page),
            pages: Math.ceil(dataCount / limit),
            total: dataCount
        });
    } catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}
export const getProductDetails = async (request, response) => {
    try {
        const {productId} = request.body;
        if (!productId) {
            return response.status(400).json(
                {
                    message: "Please provide product id",
                    success: false,
                    error: true
                }
            );
        }
        const product = await Product.findById(productId);
        if (!product) {
            return response.status(404).json(
                {
                    message: "Product not found",
                    success: false,
                    error: true
                }
            );
        }
        return response.status(200).json({
            message: "Product fetched successfully",
            data: product,
            error: false,
            success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}

export const updateProduct = async (request, response) => {
    try {
        const { _id } = request.body;
        if (!_id) {    
            return response.status(400).json(
                {
                    message: "Please provide product id",
                    success: false,
                    error: true
                }
            );
        }
        const updatedProduct = await Product.updateOne({ _id: _id }, {...request.body});
        return response.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
            error: false,
            success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: error.message,
                success: false,
                error: true
            }
        );
    }
}
export const deleteProduct = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }
        const deleteProduct = await ProductModel.findByIdAndDelete(_id)
        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
