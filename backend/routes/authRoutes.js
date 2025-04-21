const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Visitor = require("../models/Visitor"); // ✅ Add this
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ------------------ User Registration ------------------
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["admin", "resident", "security"]).withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("⛔ Error in Registration:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// ------------------ User Login ------------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`🔓 Login attempt: ${email}`);

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("⛔ Error in Login:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// ------------------ Get All Residents (Security Only) ------------------
router.get("/users/residents", authMiddleware, async (req, res) => {
  console.log("User Role:", req.user.role);
  if (req.user.role !== "security") {
    return res.status(403).json({ msg: "Only security guards can view residents list" });
  }

  try {
    const residents = await User.find({ role: "resident" }).select("name email");
    res.json(residents);
  } catch (err) {
    console.error("Error fetching residents:", err);
    res.status(500).json({ message: "Error fetching residents" });
  }
});

// ------------------ Get All Visitors ------------------
router.get("/visitors", authMiddleware, async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (err) {
    console.error("Error fetching visitors:", err.message);
    res.status(500).json({ message: "Error fetching visitors" });
  }
});

module.exports = router;
