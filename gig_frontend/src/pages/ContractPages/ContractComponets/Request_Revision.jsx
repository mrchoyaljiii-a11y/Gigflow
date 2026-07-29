// the use of these is that the client can request a revision for the milestone submittd by the freelancer with a reason

// the freelancer use these for Request changes for the milestone submitted by the client

import React, { useState, useEffect } from "react";
import {
    FaTimes,
    FaExclamationCircle,
    FaUndoAlt,
    FaPaperPlane,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Request_Revision = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
}) => {
    const [reason, setReason] = useState("");

    const { user: loginUser } = useSelector((state) => state.auth);
    // console.log("user in contract page loginUser", loginUser);

    let UserRole = null;

    const IsClient = loginUser?.role === "client";
    const IsFreelancer = loginUser?.role === "freelancer";

    if (IsClient) {
        UserRole = "freelancer";
    } else if (IsFreelancer) {
        UserRole = "client";
    }

    const TitlesConfig = {
        freelancer: {
            title: "Request Revision",
            subtitle:
                "Explain what needs to be updated or improved before you can approve this milestone.",
            placeholder:
                "Describe the changes the freelancer should make...",
        },

        client: {
            title: "Request Changes",
            subtitle:
                "Explain what should be updated before you can accept and start working on this milestone.",
            placeholder:
                "Describe the changes you'd like the client to make...",
        },
    };

    const { title, subtitle, placeholder } = TitlesConfig[UserRole];

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) return;

        onSubmit?.(reason.trim());
        setReason("");
    };

    const handleClose = () => {
        setReason("");
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                            <FaUndoAlt className="text-xl text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {title}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">

                    {/* Notice */}
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <FaExclamationCircle className="mt-1 text-lg text-amber-500" />

                        <div>
                            <h3 className="font-semibold text-amber-800">
                                Revision Request
                            </h3>

                            <p className="mt-1 text-sm text-amber-700">
                                Please provide clear and specific feedback so the other party
                                understands exactly what needs to be updated.
                            </p>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                          {`  Reason for ${UserRole === "freelancer" ? "revision" : "changes"}`}
                        </label>

                        <textarea
                            rows={6}
                            // maxLength={500}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={placeholder}
                            className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <div className="mt-2 flex justify-end">
                            <span className="text-xs text-gray-500">
                                {reason.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!reason.trim() || loading}
                        onClick={handleSubmit}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        <FaPaperPlane />

                        {loading ? "Submitting..." : "Submit Request"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Request_Revision;