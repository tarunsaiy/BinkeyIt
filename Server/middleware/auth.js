import jwt from 'jsonwebtoken';
const auth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request.headers.authorization.split(" ")[1]

        if (!token) {
            return response.status(401).json({
                message: "No token provided",
                error: true,
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!decode) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }

        request.userId = decode.id;
        next();
    } catch (error) {
        console.log("Auth middleware error:");
        return response.status(401).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export default auth;
