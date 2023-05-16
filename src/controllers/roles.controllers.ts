import { Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { getGender, getProfileImages } from "../utils/functions";

//creating a owner manually
export const createOwner = async (req: Request, res: Response) => {
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
    if (!validateName(username)) {
      return res.status(400).send("Invalid name");
    }
    //validating email(email should be in the email address format)
    if (!validateEmail(email)) {
      return res.status(400).send("Invalid email");
    }
    //validating password(Password must be at least 8 character long and it must include at least - one uppercase letter, one lowercase letter, one digit, one special character)
    if (!validatePassword(password)) {
      return res.status(400).send("Invalid password");
    }
    //checking whether the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    //encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);

    // getting setting up the user's gender in the database
    const gender = await getGender(username);

    //assigning a random image according to the user's gender
    const profileImage = await getProfileImages(gender);

    //creating a new user
    const newUser = new User({
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
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//creating admin
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).send("Invalid email");
    }

    const workingUser = await User.findOne({ email });
    workingUser?.role;
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};
