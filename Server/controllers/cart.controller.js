import CartProductModel from '../models/cartproduct.model.js';
import UserModel from '../models/user.model.js';

export const addToCartControler = async (request, response) => {
    try {
        const userId = request.userId;
        const {productId} = request.body;
        if (!productId) {
            return response.status(400).json({
                message: "Please provide product id",
                success: false,
                error: true
            })
        }
        const checkItemInCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })
        if (checkItemInCart) {
            return response.status(400).json({
                message: "Product already in cart",
                success: false,
                error: true
            })
        }
        const cartProduct = new CartProductModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })
        const savedCartProduct = await cartProduct.save();
        const updateUser = await UserModel.updateOne(
            {_id: userId},
             {$push : {
                shopping_cart : productId
             }
            }
        );
        return response.status(200).json({
            message: "Product added to cart successfully",
            data: savedCartProduct,
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}
export const getCartControler = async (request, response) => {
    try {
        const userId = request.userId;
        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId');
        return response.status(200).json({
            message: "Cart items fetched successfully",
            data: cartItem,
            success: true,
            error: false
        })
    
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}
export const updateCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId 
        const { _id,qty } = request.body

        if(!_id ||  !qty){
            return response.status(400).json({
                message : "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return response.json({
            message : "Update cart",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemQtyController = async(request,response)=>{
    try {
      const userId = request.userId 
      const { _id } = request.body 
      
      if(!_id){
        return response.status(400).json({
            message : "Provide _id",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await CartProductModel.deleteOne({_id : _id, userId : userId })

      return response.json({
        message : "Item remove",
        error : false,
        success : true,
        data : deleteCartItem
      })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}