import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productID: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  payment: {
    type: String,
    required: true,
  },
  addressID: {
    type: mongoose.Types.ObjectId,
    ref: "Address",
    required: true,
  },

  contact: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Order", orderSchema);
