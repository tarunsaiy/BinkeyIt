import { Router } from "express";
import auth from "../middleware/auth.js";
import { CashOnDeliveryOrderController } from "../controllers/order.controller.js";
const orderRouter = Router();
orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController)
export default orderRouter;