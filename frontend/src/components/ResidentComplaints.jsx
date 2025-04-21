import { useEffect, useState } from "react";
import axios from "axios";

const ResidentComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/api/complaints/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching complaints", err);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:5000/api/complaints/add",
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle("");
            setDescription("");
            fetchComplaints(); // Refresh list after submitting
        } catch (err) {
            console.error("Error submitting complaint", err);
        }
    };

    const markResolved = async (complaintId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:5000/api/complaints/update/${complaintId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Update only the status in UI
            setComplaints(complaints.map(c =>
                c._id === complaintId ? { ...c, status: "Resolved" } : c
            ));
        } catch (err) {
            console.error("Error resolving complaint", err);
        }
    };

    const pending = complaints.filter(c => c.status !== "Resolved");
    const resolved = complaints.filter(c => c.status === "Resolved");

    return (
        <div className="container mt-4">
            {/* ✅ Complaint Form */}
            <h3>Submit a Complaint</h3>
            <form onSubmit={handleComplaintSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit Complaint</button>
            </form>

            {/* ✅ Pending Complaints */}
            <h4 className="mt-5">Pending Complaints</h4>
            {pending.length === 0 ? (
                <p>No pending complaints.</p>
            ) : (
                <ul className="list-group">
                    {pending.map((complaint) => (
                        <li key={complaint._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{complaint.title}</strong> - {complaint.description}
                                <span className="badge bg-warning text-dark ms-2">{complaint.status}</span>
                            </div>
                            <button className="btn btn-success btn-sm" onClick={() => markResolved(complaint._id)}>
                                Mark as Resolved
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ✅ Resolved Complaints */}
            <h4 className="mt-4">Resolved Complaints</h4>
            {resolved.length === 0 ? (
                <p>No resolved complaints.</p>
            ) : (
                <ul className="list-group">
                    {resolved.map((complaint) => (
                        <li key={complaint._id} className="list-group-item">
                            <strong>{complaint.title}</strong> - {complaint.description}
                            <span className="badge bg-success float-end">{complaint.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResidentComplaints;
