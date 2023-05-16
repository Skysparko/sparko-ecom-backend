"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdate = exports.emailUpdate = exports.verifyUpdatedEmail = exports.userUpdate = void 0;
const validators_1 = require("../utils/validators");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
const email_1 = __importDefault(require("../services/email"));
const emailTemplates_1 = require("../utils/emailTemplates");
const speakeasy_1 = __importDefault(require("speakeasy"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//updating user information
const userUpdate = async (req, res) => {
    try {
        const { username, gender, profileImage, x, y, height, width } = req.body;
        if (!username || !gender || !profileImage) {
            return res.status(400).send(" Please fill all the required fields");
        }
        //validating username(Name must be at least 3 character long and must not include numbers or special characters)
        if (!(0, validators_1.validateName)(username)) {
            return res.status(400).send("Invalid name");
        }
        // getting user from middleware
        const user = Object(req)["user"];
        if (x === 0 && y === 0 && height === 0 && width === 0) {
            user.username = username;
            user.gender = gender;
        }
        else {
            user.username = username;
            user.gender = gender;
            const result = await cloudinary_1.default.uploader.upload(profileImage, {
                crop: "crop",
                height,
                width,
                x,
                y,
            });
            user.profileImage = result.secure_url;
        }
        await user.save();
        return res.status(200).send("User successfully updated");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.userUpdate = userUpdate;
//verification of the email through otp
const verifyUpdatedEmail = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send(" Please fill all the required fields");
        }
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).send("Invalid email");
        }
        // getting user from middleware
        const user = Object(req)["user"];
        if (email === user.email) {
            return res.status(403).send("You cannot use the same email");
        }
        const isExist = await user_model_1.default.findOne({ email: email });
        if (isExist) {
            return res.status(403).send("User already exists");
        }
        //creating otp
        const otp = speakeasy_1.default.totp({
            secret: process.env.OTP_SECRET,
            step: 300,
            digits: 6,
        });
        //saving otp into the database
        user.otp = otp;
        await user.save();
        //sending otp through mail
        const mailOptions = {
            from: "security@example.com",
            to: email,
            cc: [],
            bcc: [],
            subject: "Your Email Verification One-Time Password",
            html: (0, emailTemplates_1.emailUpdateOtpMail)(otp),
        };
        (0, email_1.default)(mailOptions);
        return res.status(200).send("Please check your email address for otp.");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.verifyUpdatedEmail = verifyUpdatedEmail;
//updating the email address using otp
const emailUpdate = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(400).send("Please provide email address");
        }
        if (!(0, validators_1.validateEmail)(email)) {
            return res.status(400).send("Invalid email");
        }
        // getting user from middleware
        if (!otp) {
            return res.status(400).send("Please Provide Otp");
        }
        const user = Object(req)["user"];
        //checking if the otp is valid or not
        var isOtpValid = speakeasy_1.default.totp.verify({
            secret: process.env.OTP_SECRET,
            token: otp,
            step: 300,
            digits: 6,
        });
        if (!isOtpValid || otp !== user.otp) {
            return res.status(400).send("Invalid or expired otp");
        }
        // saving email and setting up otp as 0000
        user.email = email;
        user.otp = "000000";
        await user.save();
        return res.status(200).send("Email successfully updated");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.emailUpdate = emailUpdate;
//updating the password using the current password
const passwordUpdate = async (req, res) => {
    try {
        const { currPassword, newPassword } = req.body;
        if (!newPassword || !currPassword) {
            return res.status(400).send("Please fill all the required fields");
        }
        if (!(0, validators_1.validatePassword)(newPassword) || !(0, validators_1.validatePassword)(currPassword)) {
            return res.status(400).send("Invalid password");
        }
        const user = Object(req)["user"];
        // checking if the curr and new password are the same
        if (currPassword === newPassword) {
            return res
                .status(400)
                .send("Your new password must be different than the current password");
        }
        // checking curr password with database's password
        const isMatch = await bcrypt_1.default.compare(currPassword, user.password);
        if (!isMatch) {
            return res.status(400).send("Your current password is incorrect");
        }
        //hashing and saving the password to the database
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).send("Password updated successfully");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.passwordUpdate = passwordUpdate;
