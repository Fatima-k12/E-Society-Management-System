const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    securityGuard: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    entryTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
