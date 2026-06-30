const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require('../model/UserModel/User_model');
const JWT_SECRET = process.env.JWT_SECRET;

// fetch login user details
async function Fetch_UserDetails(req, res) {
    try {
        const userToken = req.cookies.user_token;
        if (!userToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const decode = jwt.verify(userToken, JWT_SECRET);
        const user = await userModel.findById(decode.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log("Error in Fetch_UserDetails:", error);
        return res.status(400).json({
            success: false,
            message: "Error fetching user details"
        });
    }

}



module.exports = { Fetch_UserDetails }