import mongoose from "mongoose";

// Схема товару супермаркету August
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    emoji: {
      type: String,
      trim: true,
      default: "🛒",
    },
  },
  { timestamps: true } // createdAt і updatedAt створюються автоматично
);

const Product = mongoose.model("Product", productSchema);

export default Product;
