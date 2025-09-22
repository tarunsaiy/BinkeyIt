import {Router} from 'express'
import auth from '../middleware/auth.js'
import { AddSubCategory, deleteSubCategory, GetSubCategory, updateSubCategory } from '../controllers/subCategory.controller.js'
const subCategoryRouter = Router()

subCategoryRouter.post('/create', auth, AddSubCategory)
subCategoryRouter.post('/get', GetSubCategory);
subCategoryRouter.put('/update', auth, updateSubCategory);
subCategoryRouter.delete('/delete', auth, deleteSubCategory);
export default subCategoryRouter