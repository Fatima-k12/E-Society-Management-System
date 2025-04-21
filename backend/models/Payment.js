const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash"], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
