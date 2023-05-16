import { Router } from "express";
import { isAuthorized } from "../middlewares/auth.middleware";
import { createQuery } from "../controllers/help.controllers";
import {
  editSpecificAddress,
  getAddressUsingID,
} from "../controllers/address.controllers";
import {
  createAddress,
  deleteAddress,
  getCities,
  getCountries,
  getCountryDetails,
  getStates,
  getUserAddresses,
  setAsDefault,
} from "../controllers/address.controllers";
const router = Router();

//@route GET api/v1/address/countries
//@desc get all countries
//@access Authorized user
router.get("/countries", isAuthorized, getCountries);

//@route GET api/v1/address/countries
//@desc get specific country's details
//@access Authorized user
router.get("/countries/:country", isAuthorized, getCountryDetails);

//@route GET api/v1/address/states/:country
//@desc get all states of a specific country
//@access Authorized user
router.get("/states/:country", isAuthorized, getStates);

//@route GET api/v1/address/cities/:state/:country
//@desc get all cities of a specific state of a specific country
//@access Authorized user
router.get("/cities/:state/:country", isAuthorized, getCities);

//@route POST api/v1/address/add
//@desc creating new address
//@access Authorized user
router.post("/add", isAuthorized, createAddress);

//@route DELETE api/v1/address/delete/:id
//@desc deleting specific address using id
//@access Authorized user
router.delete("/delete/:id", isAuthorized, deleteAddress);

//@route GET api/v1/address/default/:id
//@desc set default specific address using id
//@access Authorized user
router.get("/default/:id", isAuthorized, setAsDefault);

//@route PUT api/v1/address/edit/:id
//@desc edit specific address using id
//@access Authorized user
router.put("/edit/:id", isAuthorized, editSpecificAddress);

//@route GET api/v1/address/
//@desc to get all the addresses of the user
//@access Authorized user
router.get("/", isAuthorized, getUserAddresses);

//@route GET api/v1/address/:id
//@desc to get specific address of the user
//@access Authorized user
router.get("/:id", isAuthorized, getAddressUsingID);

export default router;
