// in these user extra info will handle and update in DB when user update their profile info
const userModel = require('../model/UserModel/User_model');
const cloudinary = require('../connections/cloudinary');
const fs = require("fs");

// this function is used to add the freelancer profolio info
async function Handle_Add_portfolio(req, res) {
    try {
        const userId = req.user.id;
        const {
            project_title,

            role_in_portfolio_project,

            portfolio_project_description,

            skills_and_deliverables_of_portfolio_project,

            portfolio_created_at,

        } = req.body;

        if (
            !project_title ||
            !portfolio_project_description
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        // PARSE SKILLS ARRAY
        let parsedSkills = [];

        try {

            parsedSkills = JSON.parse(
                skills_and_deliverables_of_portfolio_project
            );

        }

        catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid skills format",
            });
        }
        // IMAGE VALIDATION

        if (
            !req.files ||
            req.files.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        // CLOUDINARY IMAGE UPLOAD
        const uploadedImages = [];

        // LOOP THROUGH FILES
        for (const file of req.files) {

            // UPLOAD IMAGE
            const result = await cloudinary.uploader.upload(file.path,
                {
                    folder: "gig_flow_portfolio_images",

                    resource_type: "image",
                }
            );

            // STORE IMPORTANT DATA
            uploadedImages.push({
                public_id: result.public_id,
                secure_url: result.secure_url,
            });

            // DELETE TEMP FILE
            fs.unlinkSync(file.path);
        }

        // UPDATE USER
        const updatedUser = await userModel.findByIdAndUpdate(

            userId,

            {

                $push: {

                    portfolioProjects: {

                        project_title,

                        role_in_portfolio_project,

                        portfolio_project_description,

                        skills_and_deliverables_of_portfolio_project: parsedSkills,

                        Portfolio_images: uploadedImages,

                        portfolio_created_at: new Date(),
                    },
                },
            },

            {
                new: true,
            }
        );

        // USER NOT FOUND
        if (!updatedUser) {
            console.log("User not found with ID:", userId);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("Updated user with extra info:", updatedUser);

        // SUCCESS RESPONSE
        return res.status(200).json({
            success: true,
            message: "Portfolio project added successfully",
            data: updatedUser,
        });
    }

    catch (error) {

        console.log(
            "Error in Handle_Add_portfolio:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// these funtion is used to add the freelancer extra info like links , workexperiance , eudaction till now
async function Handle_Add_Extra_info(req, res) {
    const userId = req.user.id;
    try {

        const extraInfo = req.body;

        // console.log("Received extra info:", extraInfo);

        if (!extraInfo) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        const fieldName = Object.keys(extraInfo)[0];
        const fieldData = extraInfo[fieldName];


        if (!fieldName || !fieldData) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid extra info data",
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                    [fieldName]: fieldData,
                },
            },

            {
                new: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Extra info added successfully",
            data: updatedUser,   // return full updated user
        });


    } catch (error) {
        console.log(
            "Error in Handle_Add_Extra_User_Info :",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }

}


// for update or upload the profile img 
async function Handle_Add_Extra_profileImg(req, res) {

    try {

        const userId = req.user.id;
        // console.log("user profile img", req.file);

        // CHECK FILE
        if (!req.file) {
            console.log("error aagya");
            return res.status(400).json({
                success: false,
                message: "No image received from user",
            });
        }

        // UPLOAD TO CLOUDINARY
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "gig_flow_profile_images",
                resource_type: "image",
            }
        );

        const existingUser = await userModel.findById(userId);

        if (existingUser?.profileImage?.public_id) {

            await cloudinary.uploader.destroy(
                existingUser.profileImage.public_id
            );
        }

        // DELETE TEMP FILE
        fs.unlinkSync(req.file.path);

        // UPDATE USER
        const updatedUser = await userModel.findByIdAndUpdate(

            userId,

            {
                $set: {
                    profileImage: {
                        url: result.secure_url,
                        public_id: result.public_id,
                    },
                },
            },

            {
                new: true,
            }
        );

        // USER NOT FOUND
        if (!updatedUser) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // SUCCESS RESPONSE
        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            data: updatedUser,
        });

    } catch (error) {

        console.log(
            "Error in Handle_Add_Extra_profileImg:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


module.exports = {
    Handle_Add_portfolio, Handle_Add_Extra_info, Handle_Add_Extra_profileImg
};