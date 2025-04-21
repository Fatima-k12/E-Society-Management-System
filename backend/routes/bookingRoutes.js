const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");

const router = express.Router();

// 1️⃣ Book a Facility (Resident)
router.post("/add", authMiddleware, async (req, res) => {
    if (req.user.role !== "resident") {
        return res.status(403).json({ msg: "Only residents can book facilities" });
    }

    const { facility, startDate, duration, startTime, endTime } = req.body;

    try {
        const booking = new Booking({
            facility,
            startDate,
            duration, 
            startTime,
            endTime,
            resident: req.user.userId,
            status: "Pending"
        });

        await booking.save();
        res.json({ msg: "Booking created successfully", booking });
    } catch (error) {
        console.error("⛔ Error creating booking:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// 2️⃣ Get Bookings (Resident & Admin)
router.get("/list", authMiddleware, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === "admin") {
            bookings = await Booking.find(); // Admin sees all bookings
        } else {
            bookings = await Booking.find({ resident: req.user.userId }); // Resident sees their bookings
        }
        res.json(bookings);
    } catch (error) {
        console.error("⛔ Error fetching bookings:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// 3️⃣ Update Booking Status (Admin)
router.put("/update/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Only admins can update bookings" });
    }

    const { status } = req.body;

    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        console.error("⛔ Error updating booking:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// 4️⃣ Delete a Booking (Resident)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        // ✅ Ensure only the owner can delete their booking
        if (req.user.role !== "resident" || booking.resident.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Not authorized to delete this booking" });
        }

        await booking.deleteOne();
        res.json({ msg: "Booking deleted successfully" });
    } catch (error) {
        console.error("⛔ Error deleting booking:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// 5️⃣ Approve or Reject a Booking (Admin)
router.put("/approve/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Only admins can approve or reject bookings" });
    }

    const { status } = req.body; // Expected values: "Approved" or "Rejected"

    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        booking.status = status;
        await booking.save();
        res.json({ msg: `Booking ${status.toLowerCase()} successfully`, booking });
    } catch (error) {
        console.error("⛔ Error updating booking:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});


module.exports = router;
