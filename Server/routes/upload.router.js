import { Router } from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import uploadImageController from "../controllers/uploadImage.controller.js";
const uploadRouter = Router();

uploadRouter.post("/upload", auth, upload.single('image'), uploadImageController);

export default uploadRouter;