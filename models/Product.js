const { Schema, model, Types } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sellerId: { type: Types.ObjectId, ref: "User", required: true },
    storeId: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Product", ProductSchema);
