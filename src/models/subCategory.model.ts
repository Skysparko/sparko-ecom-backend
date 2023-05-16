import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  categoryID: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("SubCategory", subCategorySchema);
