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
        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !stock || !price || !discount || !description) {
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