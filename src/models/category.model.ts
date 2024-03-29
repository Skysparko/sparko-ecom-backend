import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    unique: true,
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
