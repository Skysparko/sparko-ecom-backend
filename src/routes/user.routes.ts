import { Router } from "express";
import { isAuthorized } from "../middlewares/auth.middleware";
import {
  emailUpdate,
  passwordUpdate,
  userUpdate,
  verifyUpdatedEmail,
} from "../controllers/user.controllers";
const router = Router();

//@route PUT api/v1/user/update-user
//@desc update-user
//@access Authorized user
router.put("/update-user", isAuthorized, userUpdate);

//@route POST api/v1/user/verify-email
//@desc verify-email
//@access Authorized user
router.post("/verify-email", isAuthorized, verifyUpdatedEmail);

//@route PUT api/v1/user/update-email
//@desc update-email
//@access Authorized user
router.put("/update-email", isAuthorized, emailUpdate);

//@route PUT api/v1/user/update-password
//@desc update-password
//@access Authorized user
router.put("/update-password", isAuthorized, passwordUpdate);

export default router;
