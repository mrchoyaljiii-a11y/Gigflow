// in these user data is handle when user create account and login and logout and check login

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require('../model/UserModel/User_model');
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

        const existingClient = await userModel.findOne({ email });
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
                : userModel;

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
        const userByemail = await userModel.findOne({ email: email });
        if (!userByemail) {
            return res.status(400).json({
                success: false,
                message: "User not found with this email"
            })
        }
        const userBypassword = await bcrypt.compare(password, userByemail.password);
        if (!userBypassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: userByemail._id }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie("user_token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',// Set to 'None' or 'lax' based on your requirements
            maxAge: 24 * 60 * 60 * 1000, //1 day
        });

        return res.status(200).json({
            success: true,
            user: {
                _id: userByemail._id,
                firstName: userByemail.firstName,
                lastName: userByemail.lastName,
                email: userByemail.email
            },
            message: "User logged in successfully"
        });

    }
    catch (error) {
        console.log("Error in Handle_UserLogin:", error);
        return res.status(400).json({
            success: false,
            message: "Error logging in user"
        })
    }
}

async function Handle_CheckLogin(req, res) {

    const token = req.cookies.user_token;
    if (!token) {
        return res.status(401).json({ success: false });
    }
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(decode.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false });
        }
        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid/expired token seller login time out " });
    }
}

async function Handle_UserLogout(req, res) {
    try {
        res.clearCookie("user_token");
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