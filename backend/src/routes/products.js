import express from "express";
const router = express.Router();

import {
  addProd,
  editProd,
  deleteProd,
  getProds,
} from "../controllers/productController.js";

import { protect } from "../middleware/protect.js";

router.get("/", protect, (req, res) => {
  res.json({ message: "Products Section" });
});

router.post("/add", protect, addProd);
router.put("/edit/:id", protect, editProd);
router.delete("/delete/:id", protect, deleteProd);
// backend/routes/products.js
router.get("/getall", protect, getProds);

export default router;
