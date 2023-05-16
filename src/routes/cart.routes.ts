import { isResetTokenValid } from "../middlewares/auth.middleware";
import express from "express";
import {
  authenticate,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controllers";
import { isAuthorized } from "../middlewares/auth.middleware";
import { forgotPassword } from "../controllers/auth.controllers";
import { userUpdate } from "../controllers/user.controllers";
import { createOwner } from "../controllers/roles.controllers";
import {
  addToCart,
  emptyMyCart,
  getCartItems,
  removeFromCart,
} from "../controllers/cart.controllers";

const router = express.Router();

//@route POST /api/v1/cart/add
//@desc Add product to cart
//@access Authorized only
router.post("/add", isAuthorized, addToCart);

//@route GET /api/v1/cart
//@desc get cart items
//@access Authorized only
router.get("/", isAuthorized, getCartItems);

//@route DELETE ALL /api/v1/cart/
//@desc empty the  cart
//@access Authorized only
router.delete("/empty", isAuthorized, emptyMyCart);

//@route DELETE /api/v1/cart/:id
//@desc delete cart item using id
//@access Authorized only
router.delete("/:id", isAuthorized, removeFromCart);

export default router;
