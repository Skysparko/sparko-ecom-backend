import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    type: mongoose.Types.ObjectId,
    ref: "Address",
  },
});

export default mongoose.model("User", userSchema);
