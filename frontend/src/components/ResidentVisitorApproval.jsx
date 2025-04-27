import { useEffect, useState } from "react";
import axios from "axios";

const ResidentVisitorApproval = () => {
  const [visitors, setVisitors] = useState([]);

  const fetchPendingVisitors = async () => {
    try {
      const res = await axios.get("/api/visitor/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error("Failed to fetch pending visitors", err);
    }
  };

  const updateVisitorStatus = async (visitorId, status) => {
    try {
      const endpoint =
        status === "Approved"
          ? `api/visitor/approve/${visitorId}`
          : `api/visitor/reject/${visitorId}`;
  
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      fetchPendingVisitors(); // Refresh the list after updating
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} visitor`, err);
    }
  };
  
  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  return (
    <div className="mt-4">
      <h4>Pending Visitor Approvals</h4>
      {visitors.length === 0 ? (
        <p>No pending visitors.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th>Phone</th>
              <th>Purpose</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.phone}</td>
                <td>{v.purpose}</td>
                <td>
                  <button
                    onClick={() => updateVisitorStatus(v._id, "Approved")}
                    className="btn btn-success btn-sm mx-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateVisitorStatus(v._id, "Rejected")}
                    className="btn btn-danger btn-sm mx-1"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResidentVisitorApproval;
