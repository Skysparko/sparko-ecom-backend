import { Router } from "express";
import { isAuthorized } from "../middlewares/auth.middleware";
import {
  createOrder,
  getOrders,
  removeOrderById,
} from "../controllers/order.controllers";
const router = Router();

//@route POST api/v1/order/create
//@desc create Order
//@access Authorized user
router.post("/create", isAuthorized, createOrder);

//@route GET /api/v1/orders
//@desc get orders
//@access Authorized user
router.get("/", isAuthorized, getOrders);

//@route DELETE /api/v1/orders/:id
//@desc remove order using id
//@access Authorized user
router.delete("/:id", isAuthorized, removeOrderById);

export default router;
