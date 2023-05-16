import { Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators";

import dotenv from "dotenv";
import Help from "../models/help.model";
dotenv.config();

// function for saving the user's questions
export const createQuery = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).send("Please enter a question before submitting.");
    }
    // getting user from middleware
    const user = Object(req)["user"];
    const data = new Help({ userID: user._id, question });

    //saving the user to the database
    await data.save();

    return res.status(200).send("Successfully submitted");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};
