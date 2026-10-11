import mongoose from "mongoose";
import Product from "../models/Product.js";

// Перевірка коректності id (щоб не отримати помилку Mongoose)
function badId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Некоректний id" });
    return true;
  }
  return false;
}

// GET /api/products — усі товари (спочатку найновіші)
export async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET /api/products/:id — один товар
export async function getProductById(req, res) {
  if (badId(req.params.id, res)) return;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// POST /api/products — створити товар
export async function createProduct(req, res) {
  try {
    const { name, price, emoji } = req.body;
    const product = await Product.create({ name, price, emoji });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// PUT /api/products/:id — оновити товар
export async function updateProduct(req, res) {
  if (badId(req.params.id, res)) return;
  try {
    const { name, price, emoji } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, emoji },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// DELETE /api/products/:id — видалити товар
export async function deleteProduct(req, res) {
  if (badId(req.params.id, res)) return;
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }
    res.status(200).json({ message: "Товар успішно видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
