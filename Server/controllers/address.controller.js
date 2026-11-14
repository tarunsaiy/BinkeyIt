import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
    try {
        const { address_line, city, state, pincode, country, mobile } = request.body;
        const userId = request.userId;
        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId: userId
        })
        const saveAddress = await createAddress.save();
        const user = await UserModel.findByIdAndUpdate(userId,
            {
                $push: {
                    address_details: saveAddress._id
                }
            });
        return response.status(201).json({
            message: "Address added successfully",
            data: saveAddress,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const getAddressController = async (request, response) => {
    try {
        const userId = request.userId;
        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 });
        return response.status(200).json({
            message: "Address fetched successfully",
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }
}

export const updateAddressController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, address_line, city, state, country, pincode, mobile } = request.body

        const updateAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
            address_line,
            city,
            state,
            country,
            mobile,
            pincode
        })

        return response.json({
            message: "Address Updated",
            error: false,
            success: true,
            data: updateAddress
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const deleteAddresscontroller = async (request, response) => {
    try {
        const userId = request.userId // auth middleware    
        const { _id } = request.body

        const disableAddress = await AddressModel.updateOne({ _id: _id, userId }, {
            status: false
        })
        const user = await UserModel.findByIdAndUpdate(userId,
            {
                $pull: {
                    address_details: _id
                }
            });
        const deleteAddress = await AddressModel.deleteOne({ _id: _id, userId })
        return response.json({
            message: "Address remove",
            error: false,
            success: true,
            data: disableAddress
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
