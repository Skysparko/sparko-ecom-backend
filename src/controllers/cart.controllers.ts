import { Request, Response } from "express";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators";

import dotenv from "dotenv";
import Help from "../models/help.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
dotenv.config();

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productID } = req.body;

    if (!productID) {
      return res.status(400).send("Product ID is required");
    }

    const isProductFound = await Cart.findOne({ productID: productID });
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    if (isProductFound) {
      isProductFound.quantity += 1;

      await isProductFound.save();
      return res.status(200).send(isProductFound);
    }
    const user = Object(req)["user"];
    const data = new Cart({ userID: user._id, productID, quantity: 1 });
    await data.save();

    return res.status(201).send(data);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const user = Object(req)["user"];
    const products = await Cart.find({ userID: user._id });

    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send("cartItem id is required");
    }

    const isCartItem = await Cart.findById(id);
    if (!isCartItem) {
      return res.status(404).send("CartItem not found");
    }
    const user = Object(req)["user"];

    if (isCartItem.quantity === 1) {
      await isCartItem.delete();

      return res.status(200).send("Successfully deleted");
    }

    isCartItem.quantity -= 1;
    await isCartItem.save();

    return res.status(200).send("Successfully removed");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
};

export const emptyMyCart = async (req: Request, res: Response) => {
  try {
    const user = Object(req)["user"];

    await Cart.deleteMany({ userID: user._id });

    return res.status(200).json("Items deleted successfully");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
};
