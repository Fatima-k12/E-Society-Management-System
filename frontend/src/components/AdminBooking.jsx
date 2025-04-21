import { useEffect, useState } from "react";
import axios from "axios";

const AdminBooking = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get("http://localhost:5000/api/bookings/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data);
        } catch (err) {
            console.error("Error fetching bookings", err);
        }
    };

    const handleApproval = async (bookingId, status) => {
        const token = localStorage.getItem("token");

        try {
            await axios.put(
                `http://localhost:5000/api/bookings/approve/${bookingId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings(); // Refresh list after approval/rejection
        } catch (err) {
            console.error("Error updating booking status", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Manage Facility Bookings</h2>

            {bookings.length === 0 ? (
                <p>No booking requests.</p>
            ) : (
                <ul className="list-group mb-5 p-3">
                    {bookings.map((booking) => (
                        <li key={booking._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{booking.facility}</strong> - {booking.startDate} ({booking.startTime} - {booking.endTime}) for {booking.duration} days
                                <span className={`badge bg-${booking.status === "Approved" ? "success" : "warning"} ms-3`}>
                                    {booking.status}
                                </span>
                            </div>
                            {booking.status === "Pending" && (
                                <div>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleApproval(booking._id, "Approved")}>
                                        Approve
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleApproval(booking._id, "Rejected")}>
                                        Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminBooking;
