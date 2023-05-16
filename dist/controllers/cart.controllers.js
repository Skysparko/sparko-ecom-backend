"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyMyCart = exports.removeFromCart = exports.getCartItems = exports.addToCart = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
dotenv_1.default.config();
const addToCart = async (req, res) => {
    try {
        const { productID } = req.body;
        if (!productID) {
            return res.status(400).send("Product ID is required");
        }
        const isProductFound = await cart_model_1.default.findOne({ productID: productID });
        const product = await product_model_1.default.findById(productID);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        if (isProductFound) {
            isProductFound.quantity += 1;
            await isProductFound.save();
            return res.status(200).send(isProductFound);
        }
        const user = Object(req)["user"];
        const data = new cart_model_1.default({ userID: user._id, productID, quantity: 1 });
        await data.save();
        return res.status(201).send(data);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};
exports.addToCart = addToCart;
const getCartItems = async (req, res) => {
    try {
        const user = Object(req)["user"];
        const products = await cart_model_1.default.find({ userID: user._id });
        return res.status(200).send(products);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};
exports.getCartItems = getCartItems;
const removeFromCart = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("cartItem id is required");
        }
        const isCartItem = await cart_model_1.default.findById(id);
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
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};
exports.removeFromCart = removeFromCart;
const emptyMyCart = async (req, res) => {
    try {
        const user = Object(req)["user"];
        await cart_model_1.default.deleteMany({ userID: user._id });
        return res.status(200).json("Items deleted successfully");
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};
exports.emptyMyCart = emptyMyCart;
