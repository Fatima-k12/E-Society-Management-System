const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    facility: { type: String, required: true },
    startDate: { type: String, required: true },
    duration: { type: Number, required: true }, // ✅ Store duration (days/weeks/months)
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });




module.exports = mongoose.model("Booking", BookingSchema);
