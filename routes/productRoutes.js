const router = require("express").Router();
const {
  list,
  create,
  update,
  remove,
} = require("../controllers/productController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { ensureOwnsProduct } = require("../middleware/checkOwnership");

// publik
router.get("/", list);

// create product (Admin atau Seller)
router.post("/", authenticate, authorize(["ADMIN", "SELLER"]), create);

// update/delete (Gabungan RBAC + ABAC)
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "SELLER"]),
  ensureOwnsProduct,
  update
);
router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN", "SELLER"]),
  ensureOwnsProduct,
  remove
);

module.exports = router;
