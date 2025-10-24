const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "CUSTOMER"],
      default: "CUSTOMER",
    },
    storeId: { type: String },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
