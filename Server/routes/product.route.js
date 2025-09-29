import {Router} from 'express';
import auth from '../middleware/auth.js';
import { createProduct, getProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductDetails } from '../controllers/product.controller.js';
const productRouter = Router();
productRouter.post('/create', auth, createProduct);
productRouter.post('/get', getProduct)
productRouter.post('/get-product-by-category',getProductByCategory);
productRouter.post('/get-product-by-category-and-sub-category', getProductByCategoryAndSubCategory);
productRouter.post('/get-product-details', getProductDetails)
export default productRouter