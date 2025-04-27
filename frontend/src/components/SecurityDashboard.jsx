import { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard";
import AddVisitorForm from "./AddVisitorForm";
import VisitorLogs from "./VisitorLogs";

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
      const res = await fetch('http://localhost:5000/api/visitor'); 
      const data = await res.json(); 
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
          <VisitorLogs role="security"/>
        
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
