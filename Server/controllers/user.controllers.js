import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return response.status(400).json({
                message: "User already exists",
                error: true,
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashpassword
        }

        // also const newUser = await UserModel.create(payload)
        // const newUser = await new UserModel(payload).save();

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        const verify_email = await sendEmail({
            sendTo: email,
            subject: "Please verify your email",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        return response.status(201).json({
            message: "User registered successfully. ",
            error: false,
            success: true,
            data: save
        })
    } catch (error) {
        console.error("Register error:", error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
        const user = await UserModel.findOne({ _id: code });
        if (!user) {
            return response.status(400).json({
                message: "Invalid verification code",
                error: true,
                success: false
            });
        }

        const updatedUser = await UserModel.updateOne(
            { _id: code },
            { verify_email: true }
        );

        return response.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true,
            data: updatedUser
        });
    }
    catch (error) {
        return response.status(500).json({
            message: "email error",
            error: true,
            success: false
        });
    }
}

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "User does not exist",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Your account is not active. Please contact support.",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: "Invalid credentials",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login: new Date(),
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }

        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);

        return response.status(200).json({
            message: "Login successful",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return response.status(500).json({
            message: "login error",
            error: true,
            success: false
        });
    }
}

export async function logoutController(request, response) {
    try {
        const userid = request.userId;
        await UserModel.findByIdAndUpdate(userid, { refresh_token: "" });
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };
        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);
        return response.status(200).json({
            message: "Logout successful",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }

}

export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;
        const image = request.file;
        const upload = await uploadImageCloudinary(image)

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: upload.url }
        );
        return response.status(200).json({
            message: "Avatar uploaded successfully",
            error: false,
            success: true,
            data: {
                _id: userId,
                avatar: upload.url
            }
        });
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;

        let hashPassword = "";
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                ...(name && { name: name }),
                ...(email && { email: email }),
                ...(mobile && { mobile: mobile }),
                ...(password && { password: hashPassword }),
            }
        );

        return response.status(200).json({
            message: "User details updated successfully",
            error: false,
            success: true,
            data: updatedUser
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPassword(request, response) {
    try {
        const { email } = request.body;
        if (!email) {
            return response.status(400).json({
                message: "Please provide your email",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "User does not exist",
                error: true,
                success: false
            });
        }

        const otp = generateOtp();
        const expireTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime)
        });
        await sendEmail({
            sendTo: email,
            subject: "Password Reset OTP",
            html: forgotPasswordTemplate({name : user.name, otp})
        });
        return response.status(200).json({
            message: "Password reset email sent successfully",
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Forgot Password error:", error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }

}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;
        if (!email || !otp) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({email : email});
        if(!user) {
            return response.status(400).json({
                message: "User does not exist",
                error: true,
                success: false
            });
        }   

        const currentTime = new Date()
        if(currentTime > new Date(user.forgot_password_expiry)) {
            return response.status(400).json({
                message: "expired OTP",
                error: true,
                success: false
            });
        }
        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        const updateUser = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });
        return response.status(200).json({
            message: "OTP verified successfully",
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

export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({email : email});
        if(!user) {
            return response.status(400).json({
                message: "User does not exist",
                error: true,
                success: false
            });
        }   
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Passwords do not match",
                error: true,
                success: false
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(newPassword, salt);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password : hashpassword,
            forgot_password_otp : "",
            forgot_password_expiry : ""
        });

        return response.status(200).json({
            message: "Password reset successfully",
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

export async function refreshTokenController(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request.headers.Authorization.split(" ")[1];
        if (!refreshToken) {
            return response.status(401).json({
                message: "No refresh token provided",
                error: true,
                success: false
            });
        }
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
        if (!verifyToken) {
            return response.status(403).json({
                message: "token expired",
                error: true,
                success: false
            });
        }
        const userId = verifyToken.id;
        const newAccessToken = await generatedAccessToken(userId);
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }
        response.cookie('accessToken', newAccessToken, cookieOption);
        return response.status(200).json({
            message: "Token refreshed successfully",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken,
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
    
}

export async function userDetails(request, response) {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId).select("-password -refresh_token");
        return response.status(200).json({
            message: "User details fetched successfully",
            error: false,
            success: true,
            data : user
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
    
}