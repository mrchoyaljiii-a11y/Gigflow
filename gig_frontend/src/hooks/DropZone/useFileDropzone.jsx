import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

/**
 * Reusable file dropzone hook
 *
 * @param {Object} options
 * @param {File[]} options.files
 * @param {Function} options.setFiles
 * @param {Function} [options.setFileErrors]
 * @param {number} [options.maxFiles=5]
 * @param {boolean} [options.multiple=true]
 * @param {number} options.maxSize
 * @param {Object} options.accept
 */

export const useFileDropzone = ({
    files = [],
    setFiles,
    setFileErrors,
    maxFiles = 5,
    multiple = true,
    maxSize,
    accept,
}) => {

    // console.log("files received ", files);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

        // Clear previous errors
        setFileErrors?.([]);

        // Calculate total upload size
        const currentSize = files.reduce(
            (total, file) => total + file.size,
            0
        );

        const newFilesSize = acceptedFiles.reduce(
            (total, file) => total + file.size,
            0
        );

        const maxSizeMB = Math.round(maxSize / (1024 * 1024));

        if (currentSize + newFilesSize > maxSize) {
            setFileErrors?.([
                `Total upload size cannot exceed ${maxSizeMB} MB.`
            ]);
            return;
        }

        // Remove duplicate files
        const uniqueFiles = acceptedFiles.filter(
            (newFile) =>
                !files.some(
                    (existingFile) =>
                        existingFile.name === newFile.name &&
                        existingFile.size === newFile.size &&
                        existingFile.lastModified === newFile.lastModified
                )
        );

        if (files.length + uniqueFiles.length > maxFiles) {

            setFileErrors?.([
                `Maximum ${maxFiles} files allowed.`
            ]);

            return;
        }
        
        if (uniqueFiles.length) {
            setFiles((prev) => [...prev, ...uniqueFiles]);
        }

        // Handle rejected files
        const errors = [];

        rejectedFiles.forEach(({ file, errors: fileErrors }) => {

            fileErrors.forEach((error) => {

                switch (error.code) {

                    case "file-too-large":
                        errors.push(
                            `${file.name} exceeds ${maxSizeMB} MB.`
                        );
                        break;

                    case "too-many-files":
                        errors.push(
                            `Maximum ${maxFiles} files allowed.`
                        );
                        break;

                    case "file-invalid-type":
                        errors.push(
                            `${file.name} has an unsupported file type.`
                        );
                        break;

                    default:
                        errors.push(
                            `${file.name}: ${error.message}`
                        );
                }

            });

        });

        if (errors.length) {
            setFileErrors?.(errors);
        }

    }, [
        files,
        setFiles,
        setFileErrors,
        maxFiles,
        maxSize
    ]);

    const dropzone = useDropzone({
        onDrop,
        multiple,
        maxFiles,
        maxSize,
        accept,
    });

    return {
        ...dropzone,
    };

};