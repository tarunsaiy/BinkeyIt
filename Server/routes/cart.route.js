import {Router} from 'express'
import auth from '../middleware/auth.js'
import { addToCartControler, deleteCartItemQtyController, getCartControler, updateCartItemQtyController } from '../controllers/cart.controller.js'
const cartRouter = Router()
cartRouter.post('/create', auth, addToCartControler)
cartRouter.get('/get', auth, getCartControler)
cartRouter.put('/update-qty', auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item', auth, deleteCartItemQtyController);
export default cartRouter