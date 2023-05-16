"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        required: true,
        enum: ["user", "admin", "owner", "editor"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "unknown"],
    },
    profileImage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        required: true,
        enum: ["pending", "active"],
    },
    otp: {
        type: String,
    },
    address: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Address",
    },
});
exports.default = mongoose_1.default.model("User", userSchema);
