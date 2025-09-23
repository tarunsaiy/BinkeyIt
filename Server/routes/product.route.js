import {Router} from 'express';
import auth from '../middleware/auth.js';
import { createProduct } from '../controllers/product.controller.js';
const productRouter = Router();
productRouter.post('/create', auth, createProduct);

export default productRouter