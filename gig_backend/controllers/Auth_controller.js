// in these user data is handle when user create account and login and logout and check login
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ClientModel = require('../model/UserModel/User_model');
const FreelancerModel = require('../model/UserModel/Freelancer_Model');
const cloudinary = require('../connections/cloudinary');
const JWT_SECRET = process.env.JWT_SECRET;

// these function are handle user info when user create account || its signup 
async function Handle_UserSignup(req, res) {
    try {
        const { profileImage, ...userData } = req.body;
        const { email, password, role } = userData;

        if (!email || !password) {
            console.error("Email and password are required");

            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (!["freelancer", "client"].includes(role)) {

            console.log("Invalid role");

            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const existingClient = await ClientModel.findOne({ email });
        const existingFreelancer = await FreelancerModel.findOne({ email });


        if (existingClient || existingFreelancer) {

            console.error("existingClient");
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        let uploadedImg = null;

        if (profileImage) {
            uploadedImg = await cloudinary.uploader.upload(profileImage, {
                folder: "profile_images",
                resource_type: "image",
            });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const Model =
            role === "freelancer"
                ? FreelancerModel
                : ClientModel;

        const newUser = new Model({
            ...userData,
            profileImage: uploadedImg
                ? {
                    url: uploadedImg.secure_url,
                    public_id: uploadedImg.public_id,
                }
                : undefined,
            password: hashpassword,
        });

        const SavedUser = await newUser.save();
        // console.log("SavedUser", SavedUser);

        const user = SavedUser.toObject();
        delete user.password;

        return res.status(201).json({
            success: true,
            user,
            message: "User registered successfully",
        });

    } catch (error) {
        console.error("Error in Handle_UserSignup:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user",
        });
    }
}

// user login
async function Handle_UserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // First search in Client collection
        let user = await ClientModel.findOne({ email });

        // If not found, search in Freelancer collection
        if (!user) {
            user = await FreelancerModel.findOne({ email });
        }

        // User not found in either collection
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email",
            });
        }

        // Compare password
        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Create JWT with id and role
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("user_token", token, {
            httpOnly: true,
            secure: false, // set to true in production with https
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            message: "User logged in successfully",
        });
        
    } catch (error) {
        console.error("Error in Handle_UserLogin:", error);

        return res.status(500).json({
            success: false,
            message: "Error logging in user",
        });
    }
}

async function Handle_CheckLogin(req, res) {
    try {
        const token = req.cookies.user_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        let user;

        if (decoded.role === "client") {
            user = await ClientModel.findById(decoded.id)
                .select("-password");
        } else if (decoded.role === "freelancer") {
            user = await FreelancerModel.findById(decoded.id)
                .select("-password");
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.log("Check Login Error:", error);

        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

async function Handle_UserLogout(req, res) {
    try {
        res.clearCookie("user_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        console.log("Error in Handle_UserLogout:", error);
        res.status(400).json({
            success: false,
            message: "Error while logging out user"
        })
    }

}

async function Handle_GetUserProfile(req, res) {

}

module.exports = { Handle_UserSignup, Handle_UserLogin, Handle_UserLogout, Handle_CheckLogin, Handle_GetUserProfile }