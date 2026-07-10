import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import users from "./routes/users.js";
import products from "./routes/products.js";

const app = express();


app.use(express.json());

app.use(cookieParser());



app.use(cors({
  origin: [
    "https://inventory-manager-hweg.onrender.com", 
    "http://localhost:5173" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/users", users);
app.use("/products", products);

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Inventory Tracker" });
});

export default app;
