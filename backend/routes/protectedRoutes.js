const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Route - Only Authenticated Users Can Access
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ msg: `Welcome, ${req.user.role}! You have access to the dashboard.` });
});

module.exports = router;
