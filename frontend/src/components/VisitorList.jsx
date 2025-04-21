import { useEffect, useState } from "react";
import axios from "axios";

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await axios.get("/api/visitors", {
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
  }, []);

  return (
    <div className="mt-4">
      <h4>Visitor Logs</h4>
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
              <td>{v.resident?.name}</td>
              <td>{v.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorList;
