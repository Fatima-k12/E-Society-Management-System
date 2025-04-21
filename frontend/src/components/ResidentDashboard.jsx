import { useState, useEffect } from "react";
import axios from "axios";
import DashboardCard from "./DashboardCard";
import ResidentComplaints from "./ResidentComplaints";
import ResidentBooking from "./ResidentBooking";

const ResidentDashboard = () => {
    const [visitors, setVisitors] = useState([]);
    const [showVisitors, setShowVisitors] = useState(false);
    const [showComplaints, setShowComplaints] = useState(false);
    const [showBookings, setShowBookings] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [complaints, setComplaints] = useState([]); // Store complaints

    useEffect(() => {
        if (showVisitors) fetchVisitors();
        if (showComplaints) fetchComplaints();
    }, [showVisitors, showComplaints]);

    const fetchVisitors = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/api/visitors/pending", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVisitors(res.data);
        } catch (err) {
            console.error("Error fetching visitors:", err.response?.data || err.message);
        }
    };

    const fetchComplaints = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/api/complaints/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching complaints:", err.response?.data || err.message);
        }
    };

    const handleApproval = async (visitorId, status) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:5000/api/visitors/update/${visitorId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVisitors(visitors.filter(v => v._id !== visitorId));
        } catch (err) {
            console.error("Error updating visitor status:", err.response?.data || err.message);
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
            fetchComplaints(); // Refresh complaints list
        } catch (err) {
            console.error("Error submitting complaint", err.response?.data || err.message);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2>Resident Dashboard</h2>

            {/* ✅ Dashboard Icons */}
            <div className="row">
                <DashboardCard title="Book Facilities" icon="bi-calendar-check" onClick={() => setShowBookings(!showBookings)} />
                <DashboardCard title="Submit Complaints" icon="bi-exclamation-triangle" onClick={() => setShowComplaints(!showComplaints)} />
                <DashboardCard title="Approve Visitors" icon="bi-person-check" onClick={() => setShowVisitors(!showVisitors)} />
            </div>

            {/* ✅ Sections Show Only When Clicked */}
            {showBookings && <ResidentBooking />}
            {showComplaints && <ResidentComplaints />}


            {/* ✅ Pending Visitors List */}
            {showVisitors && (
                <div className="mt-4 mb-5">
                    <h3>Pending Visitor Requests</h3>
                    {visitors.length === 0 ? (
                        <p>No pending requests</p>
                    ) : (
                        <ul className="list-group mb-5">
                            {visitors.map((visitor) => (
                                <li key={visitor._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {visitor.name} - {visitor.purpose}
                                    <div>
                                        <button className="btn btn-success btn-sm me-2" onClick={() => handleApproval(visitor._id, "Approved")}>
                                            Approve
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleApproval(visitor._id, "Rejected")}>
                                            Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResidentDashboard;
