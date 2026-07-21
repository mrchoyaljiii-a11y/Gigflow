const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ClientModel = require('../model/UserModel/User_model');
const FreelancerModel = require("../model/UserModel/Freelancer_Model");
const JWT_SECRET = process.env.JWT_SECRET;

// fetch login user details 
async function Fetch_UserDetails(req, res) {
    try {
        const userToken = req.cookies.user_token;

        if (!userToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const decoded = jwt.verify(userToken, JWT_SECRET);

        // First search in Client collection
        let user = await ClientModel.findById(decoded.id).select("-password");

        // If not found, search in Freelancer collection
        if (!user) {
            user = await FreelancerModel.findById(decoded.id).select("-password");
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // console.log("Fetched user details:", user);

        return res.status(200).json({
            success: true,
            user,
        });
        
    } catch (error) {
        console.error("Error in Fetch_UserDetails:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching user details",
        });
    }
}

module.exports = { Fetch_UserDetails }