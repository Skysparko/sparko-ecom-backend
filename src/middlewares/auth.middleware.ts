import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import dotenv from "dotenv";
import { string } from "joi";
import { validateEmail } from "../utils/validators";
dotenv.config();

interface JwtPayload {
  id: string;
}

//! Error on expired token server is crashing work on that issue

//logic to check if user is logged in
export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    //checking if there is token available or not
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
        error: true,
      });
    }
    // checking if token is valid
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        error: true,
      });
    }

    // decrypting token
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!id) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
      });
    }

    //getting user information from database
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
      });
    }

    //assigning user to request
    Object.assign(req, { user: user });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//checking if the user is owner or not
export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // getting user from middleware
    const user = Object(req)["user"];

    if (user.role !== "owner") {
      return res.status(401).json({
        message: "You are not allowed to access this route",
        error: true,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const isResetTokenValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(404).send("token not found");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!id) {
      return res.status(400).send("invalid token");
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send("Your token is not valid. Please try again.");
    }
    Object.assign(req, { user: user });
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send((error as Error).message);
  }
};
