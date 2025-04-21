const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // ✅ Ensure token is provided in correct format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        // ✅ Extract token
        const token = authHeader.split(" ")[1];

        // ✅ Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        console.error("⛔ JWT Verification Error:", err.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = authMiddleware;
