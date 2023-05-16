"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const address_controllers_1 = require("../controllers/address.controllers");
const address_controllers_2 = require("../controllers/address.controllers");
const router = (0, express_1.Router)();
//@route GET api/v1/address/countries
//@desc get all countries
//@access Authorized user
router.get("/countries", auth_middleware_1.isAuthorized, address_controllers_2.getCountries);
//@route GET api/v1/address/countries
//@desc get specific country's details
//@access Authorized user
router.get("/countries/:country", auth_middleware_1.isAuthorized, address_controllers_2.getCountryDetails);
//@route GET api/v1/address/states/:country
//@desc get all states of a specific country
//@access Authorized user
router.get("/states/:country", auth_middleware_1.isAuthorized, address_controllers_2.getStates);
//@route GET api/v1/address/cities/:state/:country
//@desc get all cities of a specific state of a specific country
//@access Authorized user
router.get("/cities/:state/:country", auth_middleware_1.isAuthorized, address_controllers_2.getCities);
//@route POST api/v1/address/add
//@desc creating new address
//@access Authorized user
router.post("/add", auth_middleware_1.isAuthorized, address_controllers_2.createAddress);
//@route DELETE api/v1/address/delete/:id
//@desc deleting specific address using id
//@access Authorized user
router.delete("/delete/:id", auth_middleware_1.isAuthorized, address_controllers_2.deleteAddress);
//@route GET api/v1/address/default/:id
//@desc set default specific address using id
//@access Authorized user
router.get("/default/:id", auth_middleware_1.isAuthorized, address_controllers_2.setAsDefault);
//@route PUT api/v1/address/edit/:id
//@desc edit specific address using id
//@access Authorized user
router.put("/edit/:id", auth_middleware_1.isAuthorized, address_controllers_1.editSpecificAddress);
//@route GET api/v1/address/
//@desc to get all the addresses of the user
//@access Authorized user
router.get("/", auth_middleware_1.isAuthorized, address_controllers_2.getUserAddresses);
//@route GET api/v1/address/:id
//@desc to get specific address of the user
//@access Authorized user
router.get("/:id", auth_middleware_1.isAuthorized, address_controllers_1.getAddressUsingID);
exports.default = router;
