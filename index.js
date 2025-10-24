const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(require("express").static("public"));

// routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// db + server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  })
  .catch((err) => console.error("Mongo error:", err));
