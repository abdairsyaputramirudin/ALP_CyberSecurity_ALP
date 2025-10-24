const Product = require("../models/Product");

// ABAC untuk produk: Admin bypass; Seller harus pemilik (sellerId/storeId sama)
async function ensureOwnsProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Admin boleh apa saja
    if (req.user.role === "ADMIN") {
      req.product = product;
      return next();
    }

    // Seller harus cocok sellerId dan/atau storeId
    if (req.user.role === "SELLER") {
      const sellerMatch = String(product.sellerId) === String(req.user.id);
      const storeMatch =
        product.storeId &&
        req.user.storeId &&
        product.storeId === req.user.storeId;
      if (sellerMatch || storeMatch) {
        req.product = product;
        return next();
      }
      return res
        .status(403)
        .json({ message: "Forbidden (ABAC: ownership/store mismatch)" });
    }

    // Customer tidak boleh modifikasi
    return res.status(403).json({ message: "Forbidden (Not owner)" });
  } catch (e) {
    return res.status(400).json({ message: "Invalid product id" });
  }
}

module.exports = { ensureOwnsProduct };
