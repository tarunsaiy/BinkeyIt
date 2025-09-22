import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImageController = async(request, response) => {
    try {
        const file = request.file;
        const uploadImage = await uploadImageCloudinary(file)
        if (!uploadImage) {
            return response.status(400).json(
                {
                    message: "Image not uploaded",
                    success: false,
                    error: true
                }
            );
        }
        return response.status(200).json(
            {
                message: "Image uploaded successfully",
                success: true,
                error: false,
                data : uploadImage
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
export default uploadImageController;