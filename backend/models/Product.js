const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  details: { type: String, default: "" },
  highlights: { type: [String], default: [] },
  brand: { type: String, default: "EthioMarket Select" },
  sku: { type: String, default: "" },
  warranty: { type: String, default: "" },
  color: { type: String, default: "" },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "https://placehold.co/700x500?text=EthioMarket" },
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Text index for high-performance product title, description, and brand search
schema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", schema);
