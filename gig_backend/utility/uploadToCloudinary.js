const cloudinary = require('../connections/cloudinary');

const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                public_id: `milestones/${Date.now()}-${fileName}`,
                folder: 'milestones_attachments', // Optional: organize files in folders
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};
module.exports = uploadToCloudinary;