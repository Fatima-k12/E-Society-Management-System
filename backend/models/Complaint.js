const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
