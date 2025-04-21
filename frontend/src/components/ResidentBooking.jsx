import { useEffect, useState } from "react";
import axios from "axios";

const ResidentBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [facility, setFacility] = useState("");
    const [startDate, setStartDate] = useState("");
    const [duration, setDuration] = useState("1");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Available facilities
    const facilities = ["Clubhouse", "Gym", "Tennis Court", "Banquet Hall"];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:5000/api/bookings/add",
                { facility, startDate, duration, startTime, endTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFacility("");
            setStartDate("");
            setDuration("1");
            setStartTime("");
            setEndTime("");
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error("Error submitting booking", err);
        }
    };

    const handleCancel = async (bookingId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:5000/api/bookings/delete/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error("Error canceling booking", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Book a Facility</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Select Facility</label>
                    <select className="form-select" value={facility} onChange={(e) => setFacility(e.target.value)} required>
                        <option value="">Choose a facility</option>
                        {facilities.map((fac, index) => (
                            <option key={index} value={fac}>{fac}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Select Start Date</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)} required>
                        <option value="1">1 Day</option>
                        <option value="7">1 Week</option>
                        <option value="30">1 Month</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Start Time</label>
                    <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">End Time</label>
                    <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Book Facility</button>
            </form>

            <h3 className="mt-4">Pending Bookings</h3>
            {bookings.filter(b => b.status === "Pending").length === 0 ? (
                <p>No pending bookings.</p>
            ) : (
                <ul className="list-group mb-3 p-3">
                    {bookings.filter(b => b.status === "Pending").map((booking) => (
                        <li key={booking._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{booking.facility}</strong> - {booking.startDate} ({booking.startTime} - {booking.endTime}) for {booking.duration} days
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking._id)}>
                                Cancel
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h3 className="mt-4">Approved Bookings</h3>
            {bookings.filter(b => b.status === "Approved").length === 0 ? (
                <p>No approved bookings.</p>
            ) : (
                <ul className="list-group mb-5 p-3">
                    {bookings.filter(b => b.status === "Approved").map((booking) => (
                        <li key={booking._id} className="list-group-item">
                            <strong>{booking.facility}</strong> - {booking.startDate} ({booking.startTime} - {booking.endTime}) for {booking.duration} days
                            <span className="badge bg-success float-end">Approved</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResidentBooking;
