import { Router } from "express";
import { isAuthorized } from "../middlewares/auth.middleware";
import {
  getSubCategoryUsingId,
  searchProduct,
} from "../controllers/product.controllers";
import {
  getCategories,
  getSubCategories,
} from "../controllers/product.controllers";
import {
  createCategory,
  createSubCategory,
} from "../controllers/product.controllers";
import {
  deleteProductUsingId,
  updateProductUsingId,
} from "../controllers/product.controllers";
import {
  createProduct,
  getProducts,
  getProductUsingId,
} from "../controllers/product.controllers";

const router = Router();

//@route POST api/v1/product/create
//@desc create a new product
//@access Authorized user
router.post("/create", isAuthorized, createProduct);

//@route GET api/v1/product/all
//@desc get all products
//@access Authorized user
router.get("/", getProducts);

//@route GET api/v1/product/categories
//@desc get all categories
//@access everyone
router.get("/categories", getCategories);

//@route GET api/v1/product/sub-categories
//@desc get all sub-categories
//@access everyone
router.get("/sub-categories", getSubCategories);

//@route GET api/v1/product/search
//@desc search product using query
//@access everyone
router.get("/search", searchProduct);

//@route GET api/v1/product/:id
//@desc get product using id
//@access Authorized user
router.get("/:id", getProductUsingId);

//@route GET api/v1/product/delete/:id
//@desc delete product using id
//@access Authorized user
router.delete("/delete/:id", isAuthorized, deleteProductUsingId);

//@route PUT api/v1/product/update
//@desc update product using id
//@access Authorized user
router.put("/update/:id", isAuthorized, updateProductUsingId);

//@route POST api/v1/product/category/add
//@desc add category
//@access Authorized user
router.post("/category/add", isAuthorized, createCategory);

//@route GET api/v1/product/sub-categories/add
//@desc get sub-categories using category id
//@access Authorized user
router.get("/sub-categories/:id", getSubCategoryUsingId);

export default router;
