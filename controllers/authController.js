const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// ---------- Local login (email + password -> JWT) ----------
async function loginLocal(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password)
    return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user._id, role: user.role, storeId: user.storeId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "15m" }
  );
  return res.json({ accessToken: token });
}

// ---------- Register (untuk testing) ----------
async function register(req, res) {
  const { name, email, password, role, storeId } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already used" });

  const hashed = password ? await bcrypt.hash(password, 10) : undefined;
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "CUSTOMER",
    storeId,
  });
  return res
    .status(201)
    .json({ id: user._id, email: user.email, role: user.role });
}

// ---------- Google OAuth setup ----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_a, _r, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            email,
            role: "CUSTOMER",
            googleId: profile.id,
          });
        }
        done(null, user);
      } catch (e) {
        done(e, null);
      }
    }
  )
);

// passport serialization not needed (no sessions)
function googleAuth(req, res, next) {
  const handler = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  });
  handler(req, res, next);
}

function googleCallback(req, res, next) {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/auth/google/fail" },
    (err, user) => {
      if (err || !user) return res.redirect("/auth/google/fail");
      const token = jwt.sign(
        { sub: user._id, role: user.role, storeId: user.storeId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || "15m" }
      );
      // untuk demo sederhana: balas JSON token
      return res.json({ accessToken: token, provider: "google" });
    }
  )(req, res, next);
}

// Update role (hanya admin boleh)
async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Role updated", user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

module.exports = {
  loginLocal,
  register,
  googleAuth,
  googleCallback,
  updateRole,
};
