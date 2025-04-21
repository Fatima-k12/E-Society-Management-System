import { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import AddVisitorForm from "./AddVisitorForm";
import axios from "axios";

const SecurityDashboard = () => {
  const [activeSection, setActiveSection] = useState("");
  const [visitors, setVisitors] = useState([]);
  
  // Function to handle card click
  const handleCardClick = (title) => {
    if (title === "Monitor Visitor Entries") {
      setActiveSection("visitor");
    }
    // Add more logic for other icons if needed
  };

  // Fetch visitor logs when section is active
  const fetchVisitors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/visitors'); // ✅ Make sure this is the correct backend route
      const data = await res.json(); // ❌ This will fail if `res` is not JSON
      console.log('Fetched visitors:', data);
      setVisitors(data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
    }
  };
  
  // Fetch visitors when activeSection changes
  useEffect(() => {
    if (activeSection === "visitor") {
      fetchVisitors();
    }
  }, [activeSection]);

  return (
    <div className="container mt-5 mb-5">
      <h2>Security Dashboard</h2>

      {/* Dashboard Icons */}
      <div className="row mb-4">
        <DashboardCard
          title="Monitor Visitor Entries"
          icon="bi-door-open"
          onClick={() => handleCardClick("Monitor Visitor Entries")}
        />
        <DashboardCard title="Verify Deliveries" icon="bi-truck" />
        <DashboardCard title="Log Maintenance Staff" icon="bi-wrench" />
      </div>

      {/* Conditional Section for Monitoring Visitors */}
      {activeSection === "visitor" && (
        <div>
          <AddVisitorForm onAdd={fetchVisitors} />

          <div className="mt-5">
            <h4>Visitor Logs</h4>
            {visitors.length === 0 ? (
              <p>No visitors found.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Phone</th>
                    <th>Purpose</th>
                    <th>Resident</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v._id}>
                      <td>{v.name}</td>
                      <td>{v.phone}</td>
                      <td>{v.purpose}</td>
                      <td>{v.resident?.name || "N/A"}</td>
                      <td>{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
