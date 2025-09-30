
import UserModel from "../models/user.model.js";
export const admin = async(request, response, next) => {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId);
        if (user.role !== "ADMIN") {
            return response.status(403).json(
                {
                     message: "Access Denied",
                     success: false,
                     error: true
                }
            );
        }
        next();
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