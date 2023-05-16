"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressUsingID = exports.setAsDefault = exports.deleteAddress = exports.getUserAddresses = exports.editSpecificAddress = exports.createAddress = exports.getCities = exports.getStates = exports.getCountryDetails = exports.getCountries = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const address_model_1 = __importDefault(require("../models/address.model"));
dotenv_1.default.config();
// for getting countries from external api
const getCountries = async (req, res) => {
    try {
        const response = await axios_1.default.get(`${process.env.COUNTRIES_API_URL}/countries`, {
            headers: {
                "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
            },
        });
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getCountries = getCountries;
// for getting given country details from external api
const getCountryDetails = async (req, res) => {
    try {
        const country = req.params.country;
        const response = await axios_1.default.get(`${process.env.COUNTRIES_API_URL}/countries/${country}`, {
            headers: {
                "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
            },
        });
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getCountryDetails = getCountryDetails;
// for getting states of specific country from external api
const getStates = async (req, res) => {
    try {
        const country = req.params.country;
        if (!country) {
            return res.status(400).send("Please provide country");
        }
        const response = await axios_1.default.get(`${process.env.COUNTRIES_API_URL}/countries/${country}/states`, {
            headers: {
                "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
            },
        });
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getStates = getStates;
// for getting cities using state and country from external api
const getCities = async (req, res) => {
    try {
        const state = req.params.state;
        const country = req.params.country;
        if (!state) {
            return res.status(400).send("Please provide state");
        }
        const response = await axios_1.default.get(`${process.env.COUNTRIES_API_URL}/countries/${country}/states/${state}/cities`, {
            headers: {
                "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
            },
        });
        return res.status(200).json(response.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getCities = getCities;
// for creating address and saving data to the database
const createAddress = async (req, res) => {
    try {
        const { country, state, mobileNumber, fullName, defaultAddress, pinCode, address1, address2, landmark, city, } = req.body;
        if (!country ||
            !state ||
            !mobileNumber ||
            !fullName ||
            !defaultAddress ||
            !pinCode ||
            !address1 ||
            !address2 ||
            !landmark ||
            !city) {
            return res.status(400).send("Please fill all the required fields");
        }
        // getting user and saving data to the database
        const user = Object(req)["user"];
        const data = new address_model_1.default({
            userID: user._id,
            country,
            state,
            mobileNumber,
            fullName,
            pinCode,
            address1,
            address2,
            landmark,
            city,
        });
        await data.save();
        // if default address is true then save the id to the user database and make it default
        if (defaultAddress === "true") {
            user.address = data._id;
            await user.save();
        }
        return res.status(200).json({ user, data });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createAddress = createAddress;
// for editing specific address and saving data to the database using id
const editSpecificAddress = async (req, res) => {
    try {
        const { country, state, mobileNumber, fullName, defaultAddress, pinCode, address1, address2, landmark, city, } = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("Please provide an id");
        }
        if (!country ||
            !state ||
            !mobileNumber ||
            !fullName ||
            !defaultAddress ||
            !pinCode ||
            !address1 ||
            !address2 ||
            !landmark ||
            !city) {
            return res.status(400).send("Please fill all the required fields");
        }
        const user = Object(req)["user"];
        // if address is found then save the changes
        const address = await address_model_1.default.findById(id);
        if (!address) {
            return res.status(404).send("Address not found");
        }
        await address.updateOne({
            country,
            state,
            mobileNumber,
            fullName,
            pinCode,
            address1,
            address2,
            landmark,
            city,
        });
        // if default address is true then save the id to the user database and make it default
        if (defaultAddress === "true") {
            user.address = id;
            await user.save();
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.editSpecificAddress = editSpecificAddress;
// for getting specific user's addresses
const getUserAddresses = async (req, res) => {
    try {
        const user = Object(req)["user"];
        const addresses = await address_model_1.default.find({ userID: user._id });
        if (!addresses) {
            return res.status(404).send("No address found");
        }
        return res.status(200).send(addresses);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getUserAddresses = getUserAddresses;
// for deleting address using id
const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("Please provide an id");
        }
        // getting address using id
        const address = await address_model_1.default.findById(id);
        //if address found then delete it
        if (!address) {
            return res.status(404).send("Address not found");
        }
        await address.deleteOne();
        return res.status(200).send("Address deleted");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.deleteAddress = deleteAddress;
//for setting default address using id
const setAsDefault = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("Please provide an id");
        }
        // getting address using id
        const address = await address_model_1.default.findById(id);
        // if address found then save id into user's address
        if (!address) {
            return res.status(404).send("Address not found");
        }
        const user = Object(req)["user"];
        user.address = id;
        user.save();
        return res.status(200).send("Address set as default");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.setAsDefault = setAsDefault;
// getting specific address using id
const getAddressUsingID = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("Please provide an id");
        }
        // if address found then send it to the client
        const address = await address_model_1.default.findById(id);
        if (!address) {
            return res.status(404).send("Address not found");
        }
        return res.status(200).json(address);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getAddressUsingID = getAddressUsingID;
