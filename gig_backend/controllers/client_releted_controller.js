const ClientModel = require('../model/UserModel/User_model');
const cloudinary = require('../connections/cloudinary');
const fs = require("fs");

async function updateClientProfile(req, res) {
    try {
        const clientId = req.user.id;
        const playload = req.body;

        console.log("Payload:", playload);
        console.log("profile image:", req.file);

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "gig_flow_profile_images",
                    resource_type: "image",
                }
            );

            const existingUser = await ClientModel.findById(clientId);

            if (existingUser?.profileImage?.public_id) {

                await cloudinary.uploader.destroy(
                    existingUser.profileImage.public_id
                );
            }

            const updatedUser = await ClientModel.findByIdAndUpdate(

                clientId,

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


        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        const updatedClient = await ClientModel.findByIdAndUpdate(clientId, playload, { new: true });

        res.status(200).json({ success: true, message: 'Client updated successfully', client: updatedClient });

    }
    catch (error) {
        console.error('Error updating client profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { updateClientProfile };