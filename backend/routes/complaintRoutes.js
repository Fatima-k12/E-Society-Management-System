const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Complaint = require("../models/Complaint");

const router = express.Router();

// 1️⃣ Submit a Complaint (Resident)
router.post("/add", authMiddleware, async (req, res) => {
    if (req.user.role !== "resident") {
        return res.status(403).json({ msg: "Only residents can submit complaints" });
    }

    const { title, description } = req.body;

    try {
        const complaint = new Complaint({
            title,
            description,
            status: "Pending",
            resident: req.user.userId,
        });

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 2️⃣ Get Complaints (Resident & Admin)
router.get("/list", authMiddleware, async (req, res) => {
    try {
        let complaints;
        if (req.user.role === "admin") {
            // Admin sees only unresolved complaints
            complaints = await Complaint.find({ status: { $ne: "Resolved" } });
        } else {
            // Resident sees all their complaints
            complaints = await Complaint.find({ resident: req.user.userId });
        }
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 3️⃣ Update Complaint Status (Resident)
router.put("/update/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "resident") {
        return res.status(403).json({ msg: "Only residents can update complaints" });
    }

    try {
        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ msg: "Complaint not found" });
        }

        if (complaint.resident.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "You can only update your own complaints" });
        }

        complaint.status = "Resolved"; // Update status
        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
