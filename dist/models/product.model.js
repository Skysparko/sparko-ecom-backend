"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategory: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "SubCategory",
        required: false,
    },
    images: {
        type: [String],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        default: "Public",
        required: true,
        enum: ["Public", "Private"],
    },
    offer: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    freeDelivery: {
        type: Boolean,
        default: false,
        required: true,
    },
    cashOnDelivery: {
        type: Boolean,
        default: false,
        required: true,
    },
    returnPolicy: {
        type: Boolean,
        default: false,
        required: true,
    },
    returnDuration: {
        type: Number,
        required: true,
    },
    warranty: {
        type: Boolean,
        default: false,
        required: true,
    },
    warrantyDuration: {
        type: Number,
        required: true,
    },
    sizeList: {
        type: [String],
    },
    date: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Product", productSchema);
