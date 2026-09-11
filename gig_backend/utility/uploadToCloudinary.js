const cloudinary = require("../connections/cloudinary");

const uploadToCloudinary = (
    fileBuffer,
    fileName,
    mimeType,
    folder = "chat_attachments_files"
) => {
    return new Promise((resolve, reject) => {

        let resourceType = "raw";

        if (mimeType?.startsWith("image/")) {
            resourceType = "image";
        }
        else if (mimeType?.startsWith("video/")) {
            resourceType = "video";
        }

        const extension = fileName.includes(".")
            ? fileName.substring(fileName.lastIndexOf("."))
            : "";

        const nameWithoutExtension = fileName
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        const publicId =
            resourceType === "raw"
                ? `${Date.now()}-${nameWithoutExtension}${extension}`
                : `${Date.now()}-${nameWithoutExtension}`;

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: folder,
                public_id: publicId
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;




// const cloudinary = require('../connections/cloudinary');

// const uploadToCloudinary = (fileBuffer, fileName,folder="milestones_attachments") => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 resource_type: 'auto',
//                 public_id: `milestones/${Date.now()}-${fileName}`,
//                 folder: folder, // Optional: organize files in folders
//             },
//             (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//             }
//         );

//         stream.end(fileBuffer);
//     });
// };

// module.exports = uploadToCloudinary;
