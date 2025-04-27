import axios from "axios";
import { useEffect, useState } from "react";

const AddVisitorForm = () => {
  const [residents, setResidents] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [residentId, setResidentId] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get("/api/auth/users/residents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(response.data)) {
        setResidents(response.data);
      } else {
        console.error("Residents API did not return an array:", response.data);
        setResidents([]);
      }
    } catch (error) {
      console.error("Error fetching residents:", error);
      setResidents([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/visitor/add", {
        name,
        phone,
        purpose,
        residentId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      

      alert("Visitor Added Successfully");
      setName("");
      setPhone("");
      setPurpose("");
      setResidentId("");
    } catch (error) {
      console.error("Error adding visitor:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <h2 className="mb-4">Add Visitor</h2>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name:</label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone:</label>
        <input
          id="phone"
          type="text"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="purpose" className="form-label">Purpose:</label>
        <input
          id="purpose"
          type="text"
          className="form-control"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="residentId" className="form-label">Resident:</label>
        <select
          id="residentId"
          className="form-select"
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
          required
        >
          <option value="">Select Resident</option>
          {residents.map((resident) => (
            <option key={resident._id} value={resident._id}>
              {resident.name} ({resident.email})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">Add Visitor</button>
    </form>
  );
};

export default AddVisitorForm;
