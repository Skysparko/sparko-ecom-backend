"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controllers_1 = require("../controllers/user.controllers");
const router = (0, express_1.Router)();
//@route PUT api/v1/user/update-user
//@desc update-user
//@access Authorized user
router.put("/update-user", auth_middleware_1.isAuthorized, user_controllers_1.userUpdate);
//@route POST api/v1/user/verify-email
//@desc verify-email
//@access Authorized user
router.post("/verify-email", auth_middleware_1.isAuthorized, user_controllers_1.verifyUpdatedEmail);
//@route PUT api/v1/user/update-email
//@desc update-email
//@access Authorized user
router.put("/update-email", auth_middleware_1.isAuthorized, user_controllers_1.emailUpdate);
//@route PUT api/v1/user/update-password
//@desc update-password
//@access Authorized user
router.put("/update-password", auth_middleware_1.isAuthorized, user_controllers_1.passwordUpdate);
exports.default = router;
