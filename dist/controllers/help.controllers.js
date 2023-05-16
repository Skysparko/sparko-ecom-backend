"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const help_model_1 = __importDefault(require("../models/help.model"));
dotenv_1.default.config();
// function for saving the user's questions
const createQuery = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).send("Please enter a question before submitting.");
        }
        // getting user from middleware
        const user = Object(req)["user"];
        const data = new help_model_1.default({ userID: user._id, question });
        //saving the user to the database
        await data.save();
        return res.status(200).send("Successfully submitted");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createQuery = createQuery;
