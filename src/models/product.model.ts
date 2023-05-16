import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Types.ObjectId,
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

export default mongoose.model("Product", productSchema);
