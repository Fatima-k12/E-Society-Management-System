const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Visitor = require("../models/Visitor");

const router = express.Router();

// 1️⃣ Add a Visitor Entry (Security Guard)
router.post("/add", authMiddleware, async (req, res) => {
    if (req.user.role !== "security") {
        return res.status(403).json({ msg: "Only security guards can add visitors" });
    }

    const { name, phone, purpose, residentId } = req.body;

    try {
        const visitor = new Visitor({
            name,
            phone,
            purpose,
            resident: residentId,
            securityGuard: req.user.userId,
        });

        await visitor.save();
        res.json(visitor);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 2️⃣ Approve/Reject Visitor (Resident)
router.put("/update/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "resident") {
        return res.status(403).json({ msg: "Only residents can approve visitors" });
    }

    const { status } = req.body;

    try {
        let visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ msg: "Visitor not found" });
        }

        if (visitor.resident.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "You can only approve your own visitors" });
        }

        visitor.status = status;
        await visitor.save();
        res.json(visitor);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 3️⃣ Get Visitor Logs (Resident & Security)
router.get("/logs", authMiddleware, async (req, res) => {
    try {
        let visitors;

        if (req.user.role === "security") {
            visitors = await Visitor.find({ securityGuard: req.user.userId }).populate("resident", "name email");
        } else if (req.user.role === "resident") {
            visitors = await Visitor.find({ resident: req.user.userId }).populate("securityGuard", "name email");
        } else {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        res.json(visitors);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 4️⃣ Get Pending Visitors for Residents
router.get("/pending", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "resident") {
            return res.status(403).json({ msg: "Access denied" });
        }
        const visitors = await Visitor.find({ resident: req.user.userId, status: "Pending" });
        res.json(visitors);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Get All Visitor Logs (Admin Only)
router.get("/all", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Only admins can view all visitors" });
    }

    try {
        const visitors = await Visitor.find().populate("resident", "name email");
        res.json(visitors);
    } catch (error) {
        console.error("Error fetching visitor logs:", error);
        res.status(500).json({ msg: "Server error" });
    }
});



module.exports = router;
