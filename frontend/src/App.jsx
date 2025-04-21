import Navbar from "./components/Navbar";
import { jwtDecode } from "jwt-decode";
import DashboardCard from "./components/DashboardCard";
import ResidentDashboard from "./components/ResidentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SecurityDashboard from "./components/SecurityDashboard";


function App() {
  const token = localStorage.getItem("token");
  let userRole = "";
  let DashboardComponent = (
    <div>
      <h4>⚠️ No dashboard available. Please log in.</h4>
    </div>
  );

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;

      if (userRole === "admin") DashboardComponent = <AdminDashboard />;
      else if (userRole === "resident")
        DashboardComponent = <ResidentDashboard />;
      else if (userRole === "security")
        DashboardComponent = <SecurityDashboard />;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>
          Welcome to the{" "}
          {userRole
            ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
            : "Unknown"}{" "}
          Dashboard!
        </h2>

        {DashboardComponent}
      </div>
    </>
  );
}


export default App;
