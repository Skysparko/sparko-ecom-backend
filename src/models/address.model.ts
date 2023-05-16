import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Address", addressSchema);
