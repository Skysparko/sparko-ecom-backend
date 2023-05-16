"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = exports.createOwner = void 0;
const validators_1 = require("../utils/validators");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const functions_1 = require("../utils/functions");
//creating a owner manually
const createOwner = async (req, res) => {
    try {
        //getting values from the request
        const { username, email, password } = req.body;
        //checking whether user filled all the fields or not
        if (!username) {
            return res.status(400).send("Please Enter your name");
        }
        if (!email) {
            return res.status(400).send("Please Enter your email");
        }
        if (!password) {
            return res.status(400).send("Please Enter your password");
        }
        //validating username(Name must be at least 3 character long and must not include numbers or special characters)
        if (!(0, validators_1.validateName)(username)) {
            return res.status(400).send("Invalid name");
        }
        //validating email(email should be in the email address format)
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).send("Invalid email");
        }
        //validating password(Password must be at least 8 character long and it must include at least - one uppercase letter, one lowercase letter, one digit, one special character)
        if (!(0, validators_1.validatePassword)(password)) {
            return res.status(400).send("Invalid password");
        }
        //checking whether the user already exists in the database
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(409).send("User already exists");
        }
        //encrypting password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // getting setting up the user's gender in the database
        const gender = await (0, functions_1.getGender)(username);
        //assigning a random image according to the user's gender
        const profileImage = await (0, functions_1.getProfileImages)(gender);
        //creating a new user
        const newUser = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            gender,
            profileImage,
            status: "active",
            role: "owner",
        });
        //saving the user to the database
        await newUser.save();
        //returning the new created user in the response
        return res.status(201).send("Owner created Successful");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createOwner = createOwner;
//creating admin
const createAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !(0, validators_1.validateEmail)(email)) {
            return res.status(400).send("Invalid email");
        }
        const workingUser = await user_model_1.default.findOne({ email });
        workingUser?.role;
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createAdmin = createAdmin;
