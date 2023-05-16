"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const help_routes_js_1 = __importDefault(require("./routes/help.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const address_routes_js_1 = __importDefault(require("./routes/address.routes.js"));
const cart_routes_js_1 = __importDefault(require("./routes/cart.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express_1.default.text({ limit: "200mb" }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//routes
app.use("/api/v1/order", order_routes_js_1.default);
app.use("/api/v1/auth", auth_routes_js_1.default);
app.use("/api/v1/user", user_routes_js_1.default);
app.use("/api/v1/help", help_routes_js_1.default);
app.use("/api/v1/address", address_routes_js_1.default);
app.use("/api/v1/product", product_routes_js_1.default);
app.use("/api/v1/cart", cart_routes_js_1.default);
//listening on port 8080
app.listen(process.env.PORT || 8080, () => {
    console.log("server is running");
    (0, db_js_1.default)();
});
