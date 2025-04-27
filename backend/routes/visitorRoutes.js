const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Visitor = require("../models/Visitor");

const router = express.Router();

// 1️⃣ Add a Visitor Entry (Security Guard)
router.post("/add", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "security") {
            return res.status(403).json({ msg: "Only security guards can add visitors." });
        }

        const { name, phone, purpose, residentId } = req.body;

        const visitor = new Visitor({
            name,
            phone,
            purpose,
            resident: residentId,
            securityGuard: req.user.userId,
        });

        await visitor.save();
        res.status(201).json({ msg: "Visitor added successfully.", visitor });
    } catch (error) {
        console.error("Error adding visitor:", error);
        res.status(500).json({ msg: "Server error while adding visitor." });
    }
});

// 2️⃣ Approve a Visitor (Resident)
router.put("/approve/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "resident") {
            return res.status(403).json({ msg: "Only residents can approve visitors." });
        }

        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ msg: "Visitor not found." });
        }

        if (visitor.resident.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "You can only approve your own visitors." });
        }

        visitor.status = "Approved";
        await visitor.save();
        res.json({ msg: "Visitor approved successfully.", visitor });
    } catch (error) {
        console.error("Error approving visitor:", error);
        res.status(500).json({ msg: "Server error while approving visitor." });
    }
});

// 3️⃣ Reject a Visitor (Resident)
router.put("/reject/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "resident") {
            return res.status(403).json({ msg: "Only residents can reject visitors." });
        }

        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ msg: "Visitor not found." });
        }

        if (visitor.resident.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "You can only reject your own visitors." });
        }

        visitor.status = "Rejected";
        await visitor.save();
        res.json({ msg: "Visitor rejected successfully.", visitor });
    } catch (error) {
        console.error("Error rejecting visitor:", error);
        res.status(500).json({ msg: "Server error while rejecting visitor." });
    }
});

// 4️⃣ Get Visitor Logs (Security Guard & Resident)
router.get("/logs", authMiddleware, async (req, res) => {
    try {
        let visitors;

        if (req.user.role === "security") {
            visitors = await Visitor.find({ securityGuard: req.user.userId })
                .populate("resident", "name email");
        } else if (req.user.role === "resident") {
            visitors = await Visitor.find({ resident: req.user.userId })
                .populate("securityGuard", "name email");
        } else {
            return res.status(403).json({ msg: "Unauthorized access." });
        }

        res.json(visitors);
    } catch (error) {
        console.error("Error fetching visitor logs:", error);
        res.status(500).json({ msg: "Server error while fetching logs." });
    }
});

// 5️⃣ Get Pending Visitors (Residents only)
router.get("/pending", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "resident") {
            return res.status(403).json({ msg: "Only residents can view pending visitors." });
        }

        const visitors = await Visitor.find({
            resident: req.user.userId,
            status: "Pending"
        }).populate("securityGuard", "name email");

        res.json(visitors);
    } catch (error) {
        console.error("Error fetching pending visitors:", error);
        res.status(500).json({ msg: "Server error while fetching pending visitors." });
    }
});

// 6️⃣ Admin: Get All Visitor Logs
router.get("/all", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admins can view all visitor logs." });
        }

        const visitors = await Visitor.find()
            .populate("resident", "name email")
            .populate("securityGuard", "name email");

        res.json(visitors);
    } catch (error) {
        console.error("Error fetching all visitors:", error);
        res.status(500).json({ msg: "Server error while fetching all visitor logs." });
    }
});

// Get all visitors (for security dashboard)
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('resident', 'name'); // Populate resident name
    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

  
module.exports = router;
