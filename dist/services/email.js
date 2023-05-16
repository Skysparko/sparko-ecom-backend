"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
require("dotenv").config();
// create new transporter for email
const Transporter = nodemailer.createTransport({
    host: process.env.HOST_SERVICE,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
//sending email to the given email address
const sendEmail = (mailOptions) => {
    Transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Email sended with=", info);
        }
    });
};
exports.default = sendEmail;
