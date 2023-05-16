"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEmailVerification = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const emailTemplates_1 = require("../utils/emailTemplates");
const email_1 = __importDefault(require("../services/email"));
dotenv_1.default.config();
//verify user email address
const userEmailVerification = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = Object(req)["user"];
        if (user.email === email) {
            next();
        }
        user.status = "pending";
        user.save();
        const payload = { id: user._id };
        const verificationToken = await jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
        const verificationLink = `${process.env.CLIENT_APP_URL}/#/user?token=${verificationToken}`;
        const mailOptions = {
            from: "security@example.com",
            to: user.email,
            cc: [],
            bcc: [],
            subject: "Please verify your email address",
            html: (0, emailTemplates_1.verificationMail)(verificationLink),
        };
        (0, email_1.default)(mailOptions);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.userEmailVerification = userEmailVerification;
