import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // Get JWT token

    return token ? children : <Navigate to="/" />; // Redirect to login if no token
};

export default ProtectedRoute;
