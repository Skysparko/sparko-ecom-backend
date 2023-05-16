import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verificationMail } from "../utils/emailTemplates";
import sendEmail from "../services/email";
dotenv.config();

//verify user email address
export const userEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const user = Object(req)["user"];
    if (user.email === email) {
      next();
    }
    user.status = "pending";
    user.save();
    const payload = { id: user._id };
    const verificationToken = await jwt.sign(payload, process.env.JWT_SECRET!);
    const verificationLink = `${process.env.CLIENT_APP_URL}/user?token=${verificationToken}`;

    const mailOptions = {
      from: "security@example.com",
      to: user.email,
      cc: [],
      bcc: [],
      subject: "Please verify your email address",
      html: verificationMail(verificationLink),
    };

    sendEmail(mailOptions);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};
