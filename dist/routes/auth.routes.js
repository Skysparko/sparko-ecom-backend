"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const auth_controllers_2 = require("../controllers/auth.controllers");
const roles_controllers_1 = require("../controllers/roles.controllers");
const router = express_1.default.Router();
//@route (POST /api/v1/user/register)
//@desc Register user
//@access Public
router.post("/register", auth_controllers_1.register);
//@route (POST /api/v1/user/login)
//@desc Login user
//@access Public
router.post("/login", auth_controllers_1.login);
//@route (GET /api/v1/user/logout)
//@desc Logout user
//@access Authorized user
router.get("/logout", auth_middleware_2.isAuthorized, auth_controllers_1.logout);
//@route (POST /api/v1/user/authenticate)
//@desc Authenticating user
//@access Authorized user
router.post("/authenticate", auth_middleware_2.isAuthorized, auth_controllers_1.authenticate);
//@route POST api/v1/user/forget-password
//@desc Forgot password
//@access Public
router.post("/forgot-password", auth_controllers_2.forgotPassword);
//@route PUT api/v1/user/reset-password
//@desc Reset password
//@access reset-token
router.put("/reset-password", auth_middleware_1.isResetTokenValid, auth_controllers_1.resetPassword);
//@route PUT api/v1/user/verify-reset-token
//@desc verify-reset-token
//@access reset-token
router.put("/verify-reset-token", auth_middleware_1.isResetTokenValid, (req, res) => {
    res.status(200).send("Reset token is valid");
});
//@route POST api/v1/user/create-owner
//@desc Create Owner
//@access Manually using code
router.post("/create-owner", roles_controllers_1.createOwner);
//@route POST api/v1/user/verify-email
//@desc Verify email address
//@access verification-token
router.post("/verify-email", auth_controllers_1.verifyEmail);
exports.default = router;
