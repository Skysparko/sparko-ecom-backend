import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Help", helpSchema);
