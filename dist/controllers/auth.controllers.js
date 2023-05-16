"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.authenticate = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const validators_1 = require("../utils/validators");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const functions_1 = require("../utils/functions");
const email_1 = __importDefault(require("../services/email"));
const emailTemplates_1 = require("../utils/emailTemplates");
dotenv_1.default.config();
//logic for registering the user with name, email and password
const register = async (req, res) => {
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
            return res.status(400).send("Please enter a valid email address");
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
        });
        //saving the user to the database
        await newUser.save();
        // signing a jwt token for the user
        const payload = { id: newUser._id };
        const verificationToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
        const verificationLink = `${process.env.CLIENT_APP_URL}/#/authentication/verification/?token=${verificationToken}`;
        const mailOptions = {
            from: "security@example.com",
            to: newUser.email,
            cc: [],
            bcc: [],
            subject: "Please verify your email address",
            html: (0, emailTemplates_1.verificationMail)(verificationLink),
        };
        (0, email_1.default)(mailOptions);
        //returning the new created user in the response
        return res
            .status(201)
            .send("Registration successful. Please check your inbox for verification!");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.register = register;
//logic for logging in user with email and password
const login = async (req, res) => {
    try {
        //getting values from the request
        const { email, password, rememberMe } = req.body;
        //checking whether user filled all the fields or not
        if (!email || !password) {
            return res.status(400).send("Please fill all fields");
        }
        //validating email
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).send("Invalid email");
        }
        //validating password
        if (!(0, validators_1.validatePassword)(password)) {
            return res.status(400).send("Invalid password");
        }
        //finding user by email in the database
        const user = await user_model_1.default.findOne({ email });
        //checking whether user is found or not
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        if (user.status === "pending") {
            return res.status(400).send("Please verify your email before login.");
        }
        //checking whether password is correct or not
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }
        //singing a new token using user id and secret message and setting up the expiration time as options
        const bearerToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: rememberMe ? "365d" : "7d",
        });
        res.cookie("bearerToken", bearerToken, {
            expires: (0, functions_1.getTimeInDays)(rememberMe ? 365 : 7),
            secure: true,
        });
        //returning the token in the response
        return res.status(200).send("Login successful");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.login = login;
//logic for logging out user
const logout = (req, res) => {
    try {
        res.clearCookie("bearerToken");
        return res.status(200).send("Logout successfully");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.logout = logout;
//logic for forgot password it accepts email and sends a mail with reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //validating email format
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(403).send("please enter valid email");
        }
        //finding user by email address in the database
        const userExists = await user_model_1.default.findOne({ email });
        //checking if user exists
        if (!userExists) {
            return res.status(404).send("Please enter a registered email address");
        }
        // signing a jwt token for the user
        const payload = { id: userExists._id };
        const forgotToken = await jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24hr",
        });
        const resetLink = `${process.env.CLIENT_APP_URL}/#/authentication/reset-password?token=${forgotToken}`;
        // email options configuration
        const mailOptions = {
            from: "security@example.com",
            to: email,
            cc: [],
            bcc: [],
            subject: "Your password reset link",
            html: (0, emailTemplates_1.forgotPasswordMail)(resetLink, userExists.username),
        };
        //sending email to the given email address
        (0, email_1.default)(mailOptions);
        return res.status(200).send("email sent successfully");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.forgotPassword = forgotPassword;
//reset password procedure
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        // getting user from middleware
        const user = Object(req)["user"];
        //validating password
        if (!(0, validators_1.validatePassword)(password)) {
            return res.status(400).json({
                err: "Error: Invalid password: password must be at least 8 characters long and must include at least one - one uppercase letter, one lowercase letter, one digit, one special character",
            });
        }
        //checking if the given password is same as previous password
        const isSame = await bcrypt_1.default.compare(password, user.password);
        if (isSame) {
            return res
                .status(400)
                .send("Your new password must be different then the previous one");
        }
        // hashing and saving the password to the database
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        //sending a password changed email to the user
        const mailOptions = {
            from: "security@example.com",
            to: user.email,
            cc: [],
            bcc: [],
            subject: "password changed",
            html: `<h1>password changed successfully</h1>`,
        };
        (0, email_1.default)(mailOptions);
        return res.status(200).send("password changed successfully");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.resetPassword = resetPassword;
//checking whether user is logged in
const authenticate = async (req, res) => {
    try {
        const user = Object(req)["user"];
        if (!user) {
            return res.status(400).send("You are not Authenticated");
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.authenticate = authenticate;
// function for verification of email after registration
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        // checking if the token is available
        if (!token) {
            return res.status(404).send("token not found");
        }
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // checking if the id is correct or not
        if (!id) {
            return res.status(400).send("invalid token");
        }
        // getting user through id
        const user = await user_model_1.default.findById(id);
        // if user is available then user's status set to active and save it
        if (!user) {
            return res.status(404).send("Your token is not valid. Please try again.");
        }
        user.status = "active";
        await user.save();
        return res.status(200).send("Your email has been verified.");
    }
    catch (error) {
        console.log(error);
        return res.status(401).send(error.message);
    }
};
exports.verifyEmail = verifyEmail;
