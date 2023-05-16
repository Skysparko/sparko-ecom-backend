import { Response, Request } from "express";
import cloudinary from "../services/cloudinary";
import Product from "../models/product.model";
import { getCurrentDate } from "../utils/functions";
import Category from "../models/category.model";
import subCategory from "../models/subCategory.model";
import axios from "axios";

export const createProduct = async (req: Request, res: Response) => {
  try {
    // getting values form request body
    const {
      tags,
      images,
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
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !images ||
      !subCategory ||
      !status ||
      !tags ||
      !offer ||
      !stock
    ) {
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
      const image = await cloudinary.uploader.upload(images[i].dataURL);

      imagesUrlList.push(image.secure_url);
    }
    //new data will be added here
    const data = new Product({
      date: getCurrentDate(),
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
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const updateProductUsingId = async (req: Request, res: Response) => {
  try {
    //getting values form request body
    const {
      tags,
      images,
      title,
      description,
      price,
      category,
      subCategory,
      status,
      stock,
      offer,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !images ||
      !subCategory ||
      !status ||
      !tags ||
      !offer ||
      !stock
    ) {
      return res.status(400).send("Fill all the required fields");
    }

    if (images.length === 0) {
      return res.status(403).send("No images found");
    }

    if (tags.length === 0) {
      return res.status(403).send("No tags found");
    }

    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    let imagesUrlList = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i].dataURL.split("/")[2] === "res.cloudinary.com") {
        imagesUrlList.push(images[i].dataURL);
        continue;
      }
      const image = await cloudinary.uploader.upload(images[i].dataURL);
      imagesUrlList.push(image.secure_url);
    }

    const data = {
      date: getCurrentDate(),
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
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const getProductUsingId = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    return res.status(200).json(product);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const deleteProductUsingId = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    await product.delete();
    return res.status(200).send("Product deleted");
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).send("Invalid parameters");
    }

    const data = new Category({ name, description });
    await data.save();
    return res.status(201).json(data);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { categoryID, name, description } = req.body;

    if (!categoryID || !name || !description) {
      return res.status(400).send("Invalid parameters");
    }

    const data = new subCategory({ categoryID, name, description });
    await data.save();

    return res.status(201).send(data);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await subCategory.find();

    return res.status(200).json(subCategories);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const getSubCategoryUsingId = async (req: Request, res: Response) => {
  try {
    const sub_category = await subCategory.find({
      categoryID: req.params.id,
    });
    if (!sub_category) {
      return res.status(404).send("Category not found");
    }
    return res.status(200).json(sub_category);
  } catch (error) {
    //returning the error message
    console.log(error);
    return res.status(500).send((error as Error).message);
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  try {
    // Search for products by query from MongoDB
    if (req.query.subCategory === "" && req.query.category === "All") {
      const products = await Product.find({
        $or: [
          { title: { $regex: `${req.query.term}`, $options: "i" } },

          { tags: { $regex: `${req.query.term}`, $options: "i" } },
        ],
      });
      return res.status(200).json({ products });
    }

    if (req.query.category === "All") {
      const products = await Product.find({
        $and: [{ subCategory: req.query.subCategory }],
        $or: [
          { title: { $regex: `${req.query.term}`, $options: "i" } },

          { tags: { $regex: `${req.query.term}`, $options: "i" } },
        ],
      });
      return res.status(200).json({ products });
    }

    if (req.query.subCategory === "") {
      const products = await Product.find({
        $and: [{ category: req.query.category }],
        $or: [
          { title: { $regex: `${req.query.term}`, $options: "i" } },

          { tags: { $regex: `${req.query.term}`, $options: "i" } },
        ],
      });
      return res.status(200).json({ products });
    }

    const products = await Product.find({
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
  } catch (error) {
    console.log("<<<<<<<<<", error);
    return res.status(500).json({ error });
  }
};
