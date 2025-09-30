import {Router} from 'express';
import auth from '../middleware/auth.js';
import {admin} from '../middleware/admin.js';
import { createProduct, deleteProduct, getProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails, updateProduct } from '../controllers/product.controller.js';
const productRouter = Router();
productRouter.post('/create', auth, createProduct);
productRouter.post('/get', getProduct)
productRouter.post('/get-product-by-category',getProductByCategory);
productRouter.post('/get-product-by-category-and-sub-category', getProductByCategoryAndSubCategory);
productRouter.post('/get-product-details', getProductDetails)
productRouter.put('/update', auth, admin, updateProduct);
productRouter.delete('/delete',auth, admin, deleteProduct);
export default productRouter