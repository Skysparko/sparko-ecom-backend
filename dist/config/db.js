"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
//setting options for mongoose server
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.set("strictQuery", false);
//checking the connection of mongoose server
const connectDB = () => {
    mongoose_1.default
        .connect(process.env.MONGO_URI, dbOptions)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((err) => console.log(err.message));
};
exports.default = connectDB;
