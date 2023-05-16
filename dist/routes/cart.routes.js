"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cart_controllers_1 = require("../controllers/cart.controllers");
const router = express_1.default.Router();
//@route POST /api/v1/cart/add
//@desc Add product to cart
//@access Authorized only
router.post("/add", auth_middleware_1.isAuthorized, cart_controllers_1.addToCart);
//@route GET /api/v1/cart
//@desc get cart items
//@access Authorized only
router.get("/", auth_middleware_1.isAuthorized, cart_controllers_1.getCartItems);
//@route DELETE ALL /api/v1/cart/
//@desc empty the  cart
//@access Authorized only
router.delete("/empty", auth_middleware_1.isAuthorized, cart_controllers_1.emptyMyCart);
//@route DELETE /api/v1/cart/:id
//@desc delete cart item using id
//@access Authorized only
router.delete("/:id", auth_middleware_1.isAuthorized, cart_controllers_1.removeFromCart);
exports.default = router;
