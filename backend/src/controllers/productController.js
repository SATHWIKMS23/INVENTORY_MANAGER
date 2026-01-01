import Product from '../models/Products.js'


export const addProd = async (req, res) => {
  const { ProductName, ProductCategory, ProductQuantity } = req.body;

  if (!ProductName || !ProductCategory || !ProductQuantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (ProductQuantity < 1) {
    return res
      .status(400)
      .json({ message: "Quantity must be at least 1" });
  }

  const prod = await Product.findOne({
    ProductName,
    user: req.user._id,
  });

  if (prod) {
    return res.status(400).json({ message: "Product already exists" });
  }

  const newProduct = new Product({
    ProductName,
    ProductCategory,
    ProductQuantity,
    user: req.user._id,
  });

  await newProduct.save();
  res.status(201).json(newProduct);
};


export const editProd = async (req, res) => {
  const { id } = req.params;
  const { ProductName, ProductCategory, ProductQuantity } = req.body;

  const product = await Product.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.ProductName = ProductName;
  product.ProductCategory = ProductCategory;
  product.ProductQuantity = ProductQuantity;

  await product.save();
  res.json(product);
};


export const deleteProd = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
};

// backend/controllers/productController.js
export const getProds = async (req, res) => {
  try {
    // Finds products where the user ID matches the authenticated user
    const products = await Product.find({ user: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};