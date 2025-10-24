const jwt = require("jsonwebtoken");

// Autentikasi via Bearer <token>
function authenticate(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      role: payload.role,
      storeId: payload.storeId,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

// RBAC: izinkan role tertentu
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden (RBAC)" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
