const router = require("express").Router();
const { updateRole } = require("../controllers/authController");
const {
  loginLocal,
  register,
  googleAuth,
  googleCallback,
} = require("../controllers/authController");

// local
router.post("/login", loginLocal);
router.put("/role/:id", updateRole);

router.post("/register", register);

// google
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/google/fail", (_req, res) =>
  res.status(401).json({ message: "Google auth failed" })
);

module.exports = router;
