"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_controllers_1 = require("../controllers/order.controllers");
const router = (0, express_1.Router)();
//@route POST api/v1/order/create
//@desc create Order
//@access Authorized user
router.post("/create", auth_middleware_1.isAuthorized, order_controllers_1.createOrder);
//@route GET /api/v1/orders
//@desc get orders
//@access Authorized user
router.get("/", auth_middleware_1.isAuthorized, order_controllers_1.getOrders);
//@route DELETE /api/v1/orders/:id
//@desc remove order using id
//@access Authorized user
router.delete("/:id", auth_middleware_1.isAuthorized, order_controllers_1.removeOrderById);
exports.default = router;
