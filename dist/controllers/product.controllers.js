"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.getSubCategoryUsingId = exports.getSubCategories = exports.getCategories = exports.createSubCategory = exports.createCategory = exports.deleteProductUsingId = exports.getProductUsingId = exports.getProducts = exports.updateProductUsingId = exports.createProduct = void 0;
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
const product_model_1 = __importDefault(require("../models/product.model"));
const functions_1 = require("../utils/functions");
const category_model_1 = __importDefault(require("../models/category.model"));
const subCategory_model_1 = __importDefault(require("../models/subCategory.model"));
const createProduct = async (req, res) => {
    try {
        // getting values form request body
        const { tags, images, title, description, price, category, subCategory, status, stock, offer, freeDelivery, cashOnDelivery, returnPolicy, returnDuration, warranty, warrantyDuration, sizeList, } = req.body;
        if (!title ||
            !description ||
            !price ||
            !category ||
            !images ||
            !subCategory ||
            !status ||
            !tags ||
            !offer ||
            !stock) {
            return res.status(400).send("Fill all the required fields");
        }
        if (sizeList.length === 0) {
            return res.status(400).send("Please select at least one size");
        }
        if (images.length === 0) {
            return res.status(403).send("No images found");
        }
        if (tags.length === 0) {
            return res.status(403).send("No tags found");
        }
        let imagesUrlList = [];
        for (let i = 0; i < images.length; i++) {
            const image = await cloudinary_1.default.uploader.upload(images[i].dataURL);
            imagesUrlList.push(image.secure_url);
        }
        //new data will be added here
        const data = new product_model_1.default({
            date: (0, functions_1.getCurrentDate)(),
            tags,
            images: imagesUrlList,
            title,
            description,
            price,
            category,
            subCategory,
            status,
            stock,
            offer,
            freeDelivery,
            cashOnDelivery,
            returnPolicy,
            returnDuration,
            warranty,
            warrantyDuration,
            sizeList,
        });
        await data.save();
        console.log(data);
        return res.status(201).send("Product successfully created");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createProduct = createProduct;
const updateProductUsingId = async (req, res) => {
    try {
        //getting values form request body
        const { tags, images, title, description, price, category, subCategory, status, stock, offer, } = req.body;
        if (!title ||
            !description ||
            !price ||
            !category ||
            !images ||
            !subCategory ||
            !status ||
            !tags ||
            !offer ||
            !stock) {
            return res.status(400).send("Fill all the required fields");
        }
        if (images.length === 0) {
            return res.status(403).send("No images found");
        }
        if (tags.length === 0) {
            return res.status(403).send("No tags found");
        }
        const id = req.params.id;
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        let imagesUrlList = [];
        for (let i = 0; i < images.length; i++) {
            if (images[i].dataURL.split("/")[2] === "res.cloudinary.com") {
                imagesUrlList.push(images[i].dataURL);
                continue;
            }
            const image = await cloudinary_1.default.uploader.upload(images[i].dataURL);
            imagesUrlList.push(image.secure_url);
        }
        const data = {
            date: (0, functions_1.getCurrentDate)(),
            tags,
            images: imagesUrlList,
            title,
            description,
            price,
            category,
            subCategory,
            status,
            stock,
            offer,
        };
        await product.update(data);
        await product.save();
        console.log(product);
        return res.status(200).send("Product Successfully updated");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.updateProductUsingId = updateProductUsingId;
const getProducts = async (req, res) => {
    try {
        const products = await product_model_1.default.find();
        return res.status(200).json(products);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getProducts = getProducts;
const getProductUsingId = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        return res.status(200).json(product);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getProductUsingId = getProductUsingId;
const deleteProductUsingId = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        await product.delete();
        return res.status(200).send("Product deleted");
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.deleteProductUsingId = deleteProductUsingId;
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).send("Invalid parameters");
        }
        const data = new category_model_1.default({ name, description });
        await data.save();
        return res.status(201).json(data);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createCategory = createCategory;
const createSubCategory = async (req, res) => {
    try {
        const { categoryID, name, description } = req.body;
        if (!categoryID || !name || !description) {
            return res.status(400).send("Invalid parameters");
        }
        const data = new subCategory_model_1.default({ categoryID, name, description });
        await data.save();
        return res.status(201).send(data);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.createSubCategory = createSubCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_model_1.default.find();
        return res.status(200).json(categories);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getCategories = getCategories;
const getSubCategories = async (req, res) => {
    try {
        const subCategories = await subCategory_model_1.default.find();
        return res.status(200).json(subCategories);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getSubCategories = getSubCategories;
const getSubCategoryUsingId = async (req, res) => {
    try {
        const sub_category = await subCategory_model_1.default.find({
            categoryID: req.params.id,
        });
        if (!sub_category) {
            return res.status(404).send("Category not found");
        }
        return res.status(200).json(sub_category);
    }
    catch (error) {
        //returning the error message
        console.log(error);
        return res.status(500).send(error.message);
    }
};
exports.getSubCategoryUsingId = getSubCategoryUsingId;
const searchProduct = async (req, res) => {
    try {
        // Search for products by query from MongoDB
        if (req.query.subCategory === "" && req.query.category === "All") {
            const products = await product_model_1.default.find({
                $or: [
                    { title: { $regex: `${req.query.term}`, $options: "i" } },
                    { tags: { $regex: `${req.query.term}`, $options: "i" } },
                ],
            });
            return res.status(200).json({ products });
        }
        if (req.query.category === "All") {
            const products = await product_model_1.default.find({
                $and: [{ subCategory: req.query.subCategory }],
                $or: [
                    { title: { $regex: `${req.query.term}`, $options: "i" } },
                    { tags: { $regex: `${req.query.term}`, $options: "i" } },
                ],
            });
            return res.status(200).json({ products });
        }
        if (req.query.subCategory === "") {
            const products = await product_model_1.default.find({
                $and: [{ category: req.query.category }],
                $or: [
                    { title: { $regex: `${req.query.term}`, $options: "i" } },
                    { tags: { $regex: `${req.query.term}`, $options: "i" } },
                ],
            });
            return res.status(200).json({ products });
        }
        const products = await product_model_1.default.find({
            $and: [
                { category: req.query.category },
                { subCategory: req.query.subCategory },
            ],
            $or: [
                { title: { $regex: `${req.query.term}`, $options: "i" } },
                { tags: { $regex: `${req.query.term}`, $options: "i" } },
            ],
        });
        return res.status(200).json({ products });
    }
    catch (error) {
        console.log("<<<<<<<<<", error);
        return res.status(500).json({ error });
    }
};
exports.searchProduct = searchProduct;
