import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

//setting options for mongoose server
const dbOptions: Object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

//checking the connection of mongoose server
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI!, dbOptions)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err.message));
};

export default connectDB;
