"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const product_controllers_1 = require("../controllers/product.controllers");
const product_controllers_2 = require("../controllers/product.controllers");
const product_controllers_3 = require("../controllers/product.controllers");
const product_controllers_4 = require("../controllers/product.controllers");
const product_controllers_5 = require("../controllers/product.controllers");
const router = (0, express_1.Router)();
//@route POST api/v1/product/create
//@desc create a new product
//@access Authorized user
router.post("/create", auth_middleware_1.isAuthorized, product_controllers_5.createProduct);
//@route GET api/v1/product/all
//@desc get all products
//@access Authorized user
router.get("/", product_controllers_5.getProducts);
//@route GET api/v1/product/categories
//@desc get all categories
//@access everyone
router.get("/categories", product_controllers_2.getCategories);
//@route GET api/v1/product/sub-categories
//@desc get all sub-categories
//@access everyone
router.get("/sub-categories", product_controllers_2.getSubCategories);
//@route GET api/v1/product/search
//@desc search product using query
//@access everyone
router.get("/search", product_controllers_1.searchProduct);
//@route GET api/v1/product/:id
//@desc get product using id
//@access Authorized user
router.get("/:id", product_controllers_5.getProductUsingId);
//@route GET api/v1/product/delete/:id
//@desc delete product using id
//@access Authorized user
router.delete("/delete/:id", auth_middleware_1.isAuthorized, product_controllers_4.deleteProductUsingId);
//@route PUT api/v1/product/update
//@desc update product using id
//@access Authorized user
router.put("/update/:id", auth_middleware_1.isAuthorized, product_controllers_4.updateProductUsingId);
//@route POST api/v1/product/category/add
//@desc add category
//@access Authorized user
router.post("/category/add", auth_middleware_1.isAuthorized, product_controllers_3.createCategory);
//@route GET api/v1/product/sub-categories/add
//@desc get sub-categories using category id
//@access Authorized user
router.get("/sub-categories/:id", product_controllers_1.getSubCategoryUsingId);
exports.default = router;
