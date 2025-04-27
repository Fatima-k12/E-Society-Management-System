// VisitorLogs.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const VisitorLogs = ({ role }) => {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await axios.get("/api/visitor", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setVisitors(res.data);
      } catch (err) {
        console.error("Failed to fetch visitor logs", err);
      }
    };

    fetchVisitors();
  }, [role]);

  return (
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
            {visitors
              .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime)) // Sort by latest first
              .map((v) => (
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
  );
};

export default VisitorLogs;
