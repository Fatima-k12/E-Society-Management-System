import { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "./DashboardCard"; // Import the reusable DashboardCard component
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa"; // Icon for the sign-up button
import VisitorLogs from "./VisitorLogs";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);

  useEffect(() => {
    if (showBookings) fetchBookings();
    if (showComplaints) fetchComplaints();
    if (showVisitors) fetchVisitors();
  }, [showBookings, showComplaints, showVisitors]);

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

  const fetchVisitors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/visitor/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error("Error fetching visitors", err);
    }
  };

  const handleApproval = async (bookingId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/update/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error("Error updating booking status", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="d-flex justify-content-end mb-4">
        <Link to="/admin/signup" className="btn btn-outline-primary">
          <FaUserPlus className="me-2" />
          Add New User
        </Link>
      </div>

      {/* Admin Dashboard Icons */}
      <div className="row">
        <DashboardCard
          title="Manage Facility Bookings"
          icon="bi-calendar-check"
          onClick={() => setShowBookings((prev) => !prev)}
        />
        <DashboardCard
          title="View Complaints"
          icon="bi-exclamation-triangle"
          onClick={() => setShowComplaints((prev) => !prev)}
        />
        <DashboardCard
          title="Monitor Visitor Logs"
          icon="bi-person-check"
          onClick={() => setShowVisitors((prev) => !prev)}
        />
      </div>

      {/* Facility Bookings Section */}
      {showBookings && (
        <div className="mt-4">
          <h3>Manage Facility Bookings</h3>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <ul className="list-group">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{booking.facility}</strong> - {booking.startDate} (
                    {booking.startTime} - {booking.endTime}) for{" "}
                    {booking.duration} days
                    <span
                      className={`badge bg-${
                        booking.status === "Approved" ? "success" : "warning"
                      } ms-2`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div>
                    {booking.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleApproval(booking._id, "Approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleApproval(booking._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Complaints Section */}
      {showComplaints && (
        <div className="mt-4">
          <h3>Resident Complaints</h3>
          {complaints.length === 0 ? (
            <p>No complaints submitted.</p>
          ) : (
            <ul className="list-group">
              {complaints.map((complaint) => (
                <li key={complaint._id} className="list-group-item">
                  <strong>{complaint.title}</strong> - {complaint.description}
                  <span className="badge bg-info float-end">
                    {complaint.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Visitor Logs Section */}
      {showVisitors && <VisitorLogs /> }
    </div>
  );
};

export default AdminDashboard;
