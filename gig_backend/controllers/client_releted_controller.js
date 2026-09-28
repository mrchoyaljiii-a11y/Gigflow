const ClientModel = require('../model/UserModel/User_model');
const FreelancerModel = require('../model/UserModel/Freelancer_Model');
const cloudinary = require('../connections/cloudinary');


// these is used for both freeelancer and client to update their profile info
async function updateUserProfile(req, res) {
    try {
        const playload = req.body;

        const userId = req.user.id;
        const userRole = playload?.role;

        const UserModel =
            userRole === "client"
                ? ClientModel
                : userRole === "freelancer"
                    ? FreelancerModel
                    : null;

        if (!UserModel) {
            return res.status(403).json({
                success: false,
                message: "Invalid user role",
            });
        }

        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "gig_flow_profile_images",
                    resource_type: "image",
                }
            );

            // Delete old image from Cloudinary
            if (existingUser.profileImage?.public_id) {
                try {
                    await cloudinary.uploader.destroy(
                        existingUser.profileImage.public_id
                    );
                } catch (cloudinaryError) {
                    console.error(
                        "Failed to delete old profile image:",
                        cloudinaryError
                    );
                }
            }

            const updatedUser = await UserModel.findByIdAndUpdate(

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

            return res.status(200).json({
                success: true,
                message: "Profile image uploaded successfully",
                data: updatedUser,
            });
        }

        const updatedClient = await UserModel.findByIdAndUpdate(userId, playload, { new: true });

        res.status(200).json({ success: true, message: `${userRole} info updated successfully`, client: updatedClient });


    } catch (error) {
        console.error("Error updating user profile:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


module.exports = { updateUserProfile };