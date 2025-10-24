const Product = require("../models/Product");

// GET /products (public)
async function list(req, res) {
  const items = await Product.find({ isActive: true }).lean();
  res.json(items);
}

// POST /products (Admin or Seller)
async function create(req, res) {
  const { name, price, stock, storeId } = req.body;

  // Seller: pakai id & storeId-nya sendiri
  const payload =
    req.user.role === "SELLER"
      ? { sellerId: req.user.id, storeId: req.user.storeId }
      : {
          sellerId: req.body.sellerId || req.user.id,
          storeId: storeId || req.body.storeId,
        };

  const p = await Product.create({
    name,
    price,
    stock,
    isActive: true,
    ...payload,
  });
  res.status(201).json(p);
}

// PUT /products/:id (Admin or Seller + ABAC ensureOwnsProduct)
async function update(req, res) {
  const { name, price, stock, isActive } = req.body;
  const p = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: { name, price, stock, isActive } },
    { new: true }
  );
  res.json(p);
}

// DELETE /products/:id (Admin or Seller + ABAC ensureOwnsProduct)
async function remove(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
}

module.exports = { list, create, update, remove };
