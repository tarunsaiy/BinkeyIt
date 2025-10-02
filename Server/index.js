import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import uploadRouter from './routes/upload.router.js';
import subCategoryRouter from './routes/subcategory.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import addressRouter from './routes/address.route.js';
import orderRouter from './routes/order.router.js';
const app = express();
dotenv.config();

app.use(cors({
    credentials: true, //allow the frontend to send cookies/auth headers to the backend
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    contentSecurityPolicy: false
}));

const PORT = process.env.PORT || 8080;

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
