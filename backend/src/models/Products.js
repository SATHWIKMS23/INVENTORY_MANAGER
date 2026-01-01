import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductCategory: {
      type: String,
      required: true,
    },
    ProductQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", ProductSchema);
export default Products;
