import { Router } from "express";
import { isAuthorized } from "../middlewares/auth.middleware";
import { createQuery } from "../controllers/help.controllers";
const router = Router();

//@route POST api/v1/help/create
//@desc create help query
//@access Authorized user
router.post("/create", isAuthorized, createQuery);

export default router;
