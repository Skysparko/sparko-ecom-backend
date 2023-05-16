import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productID: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Cart", cartSchema);
