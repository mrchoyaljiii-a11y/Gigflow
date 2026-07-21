const jwt = require("jsonwebtoken");
const ClientModel = require('../model/UserModel/User_model');
const FreelancerModel = require('../model/UserModel/Freelancer_Model');

const JWT_SECRET = process.env.JWT_SECRET;

// these is for backend side auth check middleware
async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.user_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required ! error in authMiddleware"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        let user;

        if (decoded.role === "client") {
            user = await ClientModel.findById(decoded.id).select("-password");
        } else if (decoded.role === "freelancer") {
            user = await FreelancerModel.findById(decoded.id).select("-password");
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid user role",
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        req.userRole = decoded.role;
        // console.log("Authenticated user:", user);
        next();

    } catch (error) {
        console.log("Auth Middleware Error:", error);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;
