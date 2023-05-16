import { Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators";
import dotenv from "dotenv";
import axios from "axios";
import Address from "../models/address.model";
dotenv.config();

// for getting countries from external api
export const getCountries = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.COUNTRIES_API_URL}/countries`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for getting given country details from external api
export const getCountryDetails = async (req: Request, res: Response) => {
  try {
    const country = req.params.country;
    const response = await axios.get(
      `${process.env.COUNTRIES_API_URL}/countries/${country}`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for getting states of specific country from external api
export const getStates = async (req: Request, res: Response) => {
  try {
    const country = req.params.country;
    if (!country) {
      return res.status(400).send("Please provide country");
    }

    const response = await axios.get(
      `${process.env.COUNTRIES_API_URL}/countries/${country}/states`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for getting cities using state and country from external api
export const getCities = async (req: Request, res: Response) => {
  try {
    const state = req.params.state;
    const country = req.params.country;
    if (!state) {
      return res.status(400).send("Please provide state");
    }
    const response = await axios.get(
      `${process.env.COUNTRIES_API_URL}/countries/${country}/states/${state}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.COUNTRIES_API_KEY,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for creating address and saving data to the database
export const createAddress = async (req: Request, res: Response) => {
  try {
    const {
      country,
      state,
      mobileNumber,
      fullName,
      defaultAddress,
      pinCode,
      address1,
      address2,
      landmark,
      city,
    } = req.body;

    if (
      !country ||
      !state ||
      !mobileNumber ||
      !fullName ||
      !defaultAddress ||
      !pinCode ||
      !address1 ||
      !address2 ||
      !landmark ||
      !city
    ) {
      return res.status(400).send("Please fill all the required fields");
    }

    // getting user and saving data to the database
    const user = Object(req)["user"];
    const data = new Address({
      userID: user._id,
      country,
      state,
      mobileNumber,
      fullName,
      pinCode,
      address1,
      address2,
      landmark,
      city,
    });
    await data.save();

    // if default address is true then save the id to the user database and make it default
    if (defaultAddress === "true") {
      user.address = data._id;
      await user.save();
    }

    return res.status(200).json({ user, data });
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for editing specific address and saving data to the database using id
export const editSpecificAddress = async (req: Request, res: Response) => {
  try {
    const {
      country,
      state,
      mobileNumber,
      fullName,
      defaultAddress,
      pinCode,
      address1,
      address2,
      landmark,
      city,
    } = req.body;

    const id = req.params.id;

    if (!id) {
      return res.status(400).send("Please provide an id");
    }

    if (
      !country ||
      !state ||
      !mobileNumber ||
      !fullName ||
      !defaultAddress ||
      !pinCode ||
      !address1 ||
      !address2 ||
      !landmark ||
      !city
    ) {
      return res.status(400).send("Please fill all the required fields");
    }

    const user = Object(req)["user"];
    // if address is found then save the changes
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).send("Address not found");
    }

    await address.updateOne({
      country,
      state,
      mobileNumber,
      fullName,
      pinCode,
      address1,
      address2,
      landmark,
      city,
    });
    // if default address is true then save the id to the user database and make it default
    if (defaultAddress === "true") {
      user.address = id;
      await user.save();
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for getting specific user's addresses
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const user = Object(req)["user"];
    const addresses = await Address.find({ userID: user._id });
    if (!addresses) {
      return res.status(404).send("No address found");
    }
    return res.status(200).send(addresses);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// for deleting address using id
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send("Please provide an id");
    }
    // getting address using id
    const address = await Address.findById(id);

    //if address found then delete it
    if (!address) {
      return res.status(404).send("Address not found");
    }
    await address.deleteOne();
    return res.status(200).send("Address deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

//for setting default address using id
export const setAsDefault = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Please provide an id");
    }
    // getting address using id

    const address = await Address.findById(id);
    // if address found then save id into user's address
    if (!address) {
      return res.status(404).send("Address not found");
    }
    const user = Object(req)["user"];
    user.address = id;
    user.save();
    return res.status(200).send("Address set as default");
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

// getting specific address using id
export const getAddressUsingID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Please provide an id");
    }

    // if address found then send it to the client
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).send("Address not found");
    }
    return res.status(200).json(address);
  } catch (error) {
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};
