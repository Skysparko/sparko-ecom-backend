import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import helpRoutes from "./routes/help.routes.js";
import productRoutes from "./routes/product.routes.js";
import addressRoutes from "./routes/address.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getProfileImages } from "./utils/functions.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.text({ limit: "200mb" }));
app.use(logger("dev"));
app.use(
  cors({
     origin: "https://sstore-ecom-frontend.onrender.com",
    credentials: true, // You may need this if your frontend sends credentials (e.g., cookies)
exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());

//routes
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/help", helpRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);

//listening on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log("server is running");
  connectDB();
});
