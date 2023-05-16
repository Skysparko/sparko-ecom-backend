"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOrderById = exports.getOrders = exports.createOrder = void 0;
const validators_1 = require("../utils/validators");
const dotenv_1 = __importDefault(require("dotenv"));
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const address_model_1 = __importDefault(require("../models/address.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const emailTemplates_1 = require("../utils/emailTemplates");
const email_1 = __importDefault(require("../services/email"));
dotenv_1.default.config();
// function for creating a new order
const createOrder = async (req, res) => {
    try {
        const { products, payment, addressID, contact, cartItems, price } = req.body;
        if (!products ||
            !payment ||
            !addressID ||
            !contact ||
            !cartItems ||
            !price) {
            return res.status(400).send("Data is missing.");
        }
        if (!(0, validators_1.validateEmail)(contact)) {
            return res.status(400).send("Email is invalid.");
        }
        for (let i = 0; i < products.length; i++) {
            const productExist = await product_model_1.default.findById(products[i].productID);
            if (!productExist) {
                return res.status(404).send("Product not found.");
            }
        }
        let items = cartItems.filter((item) => item !== "");
        const addressExist = await address_model_1.default.findById(addressID);
        if (!addressExist) {
            return res.status(404).send("Address not found.");
        }
        for (let i = 0; i < items.length; i++)
            await cart_model_1.default.findByIdAndDelete(items[i]);
        // getting user from middleware
        const user = Object(req)["user"];
        //saving the order to the database
        const data = new order_model_1.default({
            userID: user._id,
            products,
            addressID,
            payment,
            contact,
            date: new Date(),
            price,
        });
        await data.save();
        const mailData = {
            name: addressExist.fullName,
            id: `${data._id}`,
            address: `${addressExist.address1} ${addressExist.city} ${addressExist.state} ${addressExist.pinCode} ${addressExist.country} `,
            price: price,
            date: new Date().toLocaleDateString(),
            payment: `${payment}`,
            link: process.env.CLIENT_APP_URL,
        };
        //sending otp through mail
        const mailOptions = {
            from: "security@example.com",
            to: contact,
            cc: [],
            bcc: [],
            subject: "Your Sstore.com order # " + data._id,
            html: (0, emailTemplates_1.orderConfirmationEmail)(mailData),
        };
        (0, email_1.default)(mailOptions);
        return res.status(201).send("Order successfully created.");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createOrder = createOrder;
//getting all the orders
const getOrders = async (req, res) => {
    try {
        const user = Object(req)["user"];
        const orders = await order_model_1.default.find({ userID: user._id });
        return res.status(200).send(orders);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getOrders = getOrders;
const removeOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        await order_model_1.default.findByIdAndDelete(id);
        return res.status(200).send("Order successfully removed");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.removeOrderById = removeOrderById;
