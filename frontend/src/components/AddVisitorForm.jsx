import { useEffect, useState } from "react";
import axios from "axios";

const AddVisitorForm = ({ onAdd }) => {
  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    purpose: "",
    residentId: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await axios.get("/api/users/residents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data); // Log the response to check its structure
        if (Array.isArray(res.data)) {
          setResidents(res.data);
        } else {
          setResidents([]); // Reset to empty if the response isn't an array
        }
      } catch (err) {
        console.error("Failed to fetch residents", err);
        setResidents([]);
      }
    };
    

    fetchResidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/visitors/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Visitor added successfully!");
      setFormData({ name: "", phone: "", purpose: "", residentId: "" });

      // ✅ Call onAdd to refresh the visitor logs
      if (onAdd) onAdd();
    } catch (err) {
      setMessage("Error adding visitor.");
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h4>Add Visitor</h4>
      {message && <p className="text-info">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Visitor Name</label>
          <input
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Purpose</label>
          <input
            className="form-control"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Select Resident</label>
          <select
            className="form-select"
            value={formData.residentId}
            onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
            required
          >
            <option value="">-- Select --</option>
            {residents.map((res) => {
  if (!res._id || !res.name || !res.email) return null; // Skip invalid data

  return (
    <option key={res._id} value={res._id}>
      {res.name} ({res.email})
    </option>
  );
})}


          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Add Visitor
        </button>
      </form>
    </div>
  );
};

export default AddVisitorForm;
