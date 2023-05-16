"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const help_controllers_1 = require("../controllers/help.controllers");
const router = (0, express_1.Router)();
//@route POST api/v1/help/create
//@desc create help query
//@access Authorized user
router.post("/create", auth_middleware_1.isAuthorized, help_controllers_1.createQuery);
exports.default = router;
