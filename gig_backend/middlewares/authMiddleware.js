const jwt = require("jsonwebtoken");
const userModel = require('../model/UserModel/User_model');

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

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        // console.log("Authenticated user:", user);
        next();            

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;
