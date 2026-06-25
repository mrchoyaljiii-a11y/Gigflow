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

// fetch the freelancers list to show in the find freelancers page
async function Fetch_FreelancerDetails(req, res) {
    try {
        const {
            pageNo = 1,
            limit = 6,
            search = "",
            recommended = "false"
        } = req.query;

        // Convert to numbers
        const page = parseInt(pageNo);
        const perPage = parseInt(limit);
       
        // Recommended Freelancers
       
        if (recommended === "true") {
            const freelancers = await userModel
                .find({ role: "freelancer" })
                .sort({ createdAt: -1 })   // latest freelancers
                .limit(6)
                .select("-password");

            return res.status(200).json({
                success: true,
                freelancers
            });
        }

        // Normal Search + Pagination
        const skip = (page - 1) * perPage;

        // search query
        const query = {
            role: "freelancer",
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { professionalTitle: { $regex: search, $options: "i" } },
                {
                    freelanerSkills: {
                        $elemMatch: { $regex: search, $options: "i" }
                    }
                }
            ]
        };

        const freelancers = await userModel
            .find(query)
            .skip(skip)
            .limit(perPage)
            .select("-password");

        // Count with search filter
        const totalFreelancers = await userModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            freelancers,
            pageNo: page,
            totalPages: Math.ceil(totalFreelancers / perPage),
            totalFreelancers
        });

    } catch (error) {
        console.error("Error fetching freelancers:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching freelancers"
        });
    }
}

// fetch freelancer by freelancerId { specific freelancer details }
async function Fetch_Freelancer(req, res) {
    try {
        const freelancerId = req.params.freelancerId;
        console.log("freelancer id",freelancerId)
        const freelancer = await userModel.findById(freelancerId);
        // console.log("freelancer", freelancer);
        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: "Freelancer not found"
            });
        }
        return res.status(200).json({
            success: true,
            freelancer
        });
    } catch (error) {
        console.log("Error in Fetch_Freelancer:", error);
        return res.status(400).json({
            success: false,
            message: "Error fetching freelancer details"
        });
    }
}

module.exports = { Fetch_UserDetails, Fetch_FreelancerDetails, Fetch_Freelancer }