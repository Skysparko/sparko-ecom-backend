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

const router = express.Router();

//@route (POST /api/v1/user/register)
//@desc Register user
//@access Public
router.post("/register", register);

//@route (POST /api/v1/user/login)
//@desc Login user
//@access Public
router.post("/login", login);

//@route (GET /api/v1/user/logout)
//@desc Logout user
//@access Authorized user
router.get("/logout", isAuthorized, logout);

//@route (POST /api/v1/user/authenticate)
//@desc Authenticating user
//@access Authorized user
router.post("/authenticate", isAuthorized, authenticate);

//@route POST api/v1/user/forget-password
//@desc Forgot password
//@access Public
router.post("/forgot-password", forgotPassword);

//@route PUT api/v1/user/reset-password
//@desc Reset password
//@access reset-token
router.put("/reset-password", isResetTokenValid, resetPassword);

//@route PUT api/v1/user/verify-reset-token
//@desc verify-reset-token
//@access reset-token
router.put("/verify-reset-token", isResetTokenValid, (req, res) => {
  res.status(200).send("Reset token is valid");
});

//@route POST api/v1/user/create-owner
//@desc Create Owner
//@access Manually using code
router.post("/create-owner", createOwner);

//@route POST api/v1/user/verify-email
//@desc Verify email address
//@access verification-token
router.post("/verify-email", verifyEmail);

export default router;
