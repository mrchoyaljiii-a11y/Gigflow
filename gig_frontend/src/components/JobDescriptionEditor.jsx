import React from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const JobDescriptionEditor = ({ value, onChange, error }) => {
    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
    ];

    return (
        <div className="mt-8">
            {/* Heading */}
            <label className="block text-xl font-semibold text-gray-900">
                Job Description
            </label>
            <p className="text-gray-500 mt-1">
                Explain the scope and specific requirements of your project.
            </p>

            {/* Editor */}
            <div
                className={`
          mt-4 rounded-2xl border overflow-hidden bg-white
          border-gray-300
          [&_.ql-editor]:min-h-55
          [&_.ql-editor]:overflow-y-auto
        `}
            >
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder="e.g. We are looking for a senior React developer to help us build a new dashboard..."
                    className="bg-white"
                />
            </div>

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );

}

export default JobDescriptionEditor
