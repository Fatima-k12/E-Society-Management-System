import { useState, useEffect } from "react";
import axios from "axios";

const ResidentPayments = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [method, setMethod] = useState("Credit Card"); // ✅ Default method
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get("http://localhost:5000/api/payments/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPayments(res.data);
        } catch (err) {
            console.error("Error fetching payments", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:5000/api/payments/add",
                { amount, description, method }, // ✅ Include method
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAmount("");
            setDescription("");
            setMethod("Credit Card"); // ✅ Reset method after submission
            fetchPayments(); // ✅ Refresh Payment History
        } catch (err) {
            console.error("Error submitting payment", err);
        }
    };

    return (
        <div className="container mt-5 mb-5"> {/* ✅ Added 'mb-5' for bottom margin */}
            <h2>Make a Payment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                        className="form-select"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        required
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Net Banking">Net Banking</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit Payment</button>
            </form>

            <h3 className="mt-4">Payment History</h3>
            {payments.length === 0 ? (
                <p>No payments made yet.</p>
            ) : (
                <ul className="list-group mb-5"> {/* ✅ Added 'mb-5' for bottom margin */}
                    {payments.map((payment) => (
                        <li key={payment._id} className="list-group-item">
                            <strong>₹{payment.amount}</strong> - {payment.description} ({payment.method})
                            <span className={`badge bg-success float-end`}>
                                {new Date(payment.createdAt).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResidentPayments;
