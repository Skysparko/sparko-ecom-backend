import { Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { getGender, getProfileImages } from "../utils/functions";
import cloudinary from "../services/cloudinary";
import sendEmail from "../services/email";
import { emailUpdateOtpMail } from "../utils/emailTemplates";
import speakeasy from "speakeasy";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

//updating user information
export const userUpdate = async (req: Request, res: Response) => {
  try {
    const { username, gender, profileImage, x, y, height, width } = req.body;

    if (!username || !gender || !profileImage) {
      return res.status(400).send(" Please fill all the required fields");
    }

    //validating username(Name must be at least 3 character long and must not include numbers or special characters)
    if (!validateName(username)) {
      return res.status(400).send("Invalid name");
    }
    // getting user from middleware
    const user = Object(req)["user"];
    if (x === 0 && y === 0 && height === 0 && width === 0) {
      user.username = username;
      user.gender = gender;
    } else {
      user.username = username;
      user.gender = gender;
      const result = await cloudinary.uploader.upload(profileImage, {
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
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//verification of the email through otp
export const verifyUpdatedEmail = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send(" Please fill all the required fields");
    }
    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email");
    }
    // getting user from middleware
    const user = Object(req)["user"];

    if (email === user.email) {
      return res.status(403).send("You cannot use the same email");
    }

    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(403).send("User already exists");
    }

    //creating otp
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET!,
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
      html: emailUpdateOtpMail(otp),
    };
    sendEmail(mailOptions);
    return res.status(200).send("Please check your email address for otp.");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//updating the email address using otp
export const emailUpdate = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).send("Please provide email address");
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email");
    }
    // getting user from middleware
    if (!otp) {
      return res.status(400).send("Please Provide Otp");
    }

    const user = Object(req)["user"];
    //checking if the otp is valid or not
    var isOtpValid = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET!,
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
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//updating the password using the current password
export const passwordUpdate = async (req: Request, res: Response) => {
  try {
    const { currPassword, newPassword } = req.body;

    if (!newPassword || !currPassword) {
      return res.status(400).send("Please fill all the required fields");
    }
    if (!validatePassword(newPassword) || !validatePassword(currPassword)) {
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
    const isMatch = await bcrypt.compare(currPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Your current password is incorrect");
    }
    //hashing and saving the password to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};
