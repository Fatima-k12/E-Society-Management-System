const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");

const router = express.Router();

// 1️⃣ Make a Payment (Resident)
router.post("/add", authMiddleware, async (req, res) => {
    if (req.user.role !== "resident") {
        return res.status(403).json({ msg: "Only residents can make payments" });
    }

    const { amount, description, method } = req.body;  // ✅ Include payment method

    try {
        const payment = new Payment({
            amount,
            description,
            method,  // ✅ Store payment method
            resident: req.user.userId,
        });

        await payment.save();
        res.json({ msg: "Payment successful", payment });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 2️⃣ Get Payment History (Resident)
router.get("/list", authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ resident: req.user.userId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
