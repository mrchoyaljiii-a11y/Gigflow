import React, { useState, useEffect, useReducer } from 'react'
import {
    FaCheckCircle, FaClock,
    FaLock, FaHourglassHalf, FaCalendarAlt, FaFileAlt, FaUser, FaEye,
    FaCloudUploadAlt, FaCheck, FaLongArrowAltLeft, FaBolt, FaExclamationCircle,
    FaMousePointer, FaTrash, FaFilePdf, FaFileWord, FaFileArchive, FaFileImage,
    FaPlayCircle, FaUpload, FaRedoAlt, FaThumbsUp,
} from "react-icons/fa";


import { IoRocket, IoCloudUploadOutline } from "react-icons/io5";

import {
    FiUpload, FiMail, FiClock, FiPlus
} from "react-icons/fi";

import { MdDelete } from "react-icons/md";

import api from '../../../api/axios';
import { showToast } from '../../../redux/ShowTost/ShowToastSlice.js';
import { useDispatch } from 'react-redux';
import { useHandleMilestone } from '../../../hooks/contract_releted/milestone_releted/useHandleMilestone.js';
import { getRemeningDaysStatus } from '../../../utils/RemaingDays.js';
import { useFileDropzone } from '../../../hooks/DropZone/useFileDropzone.jsx';
import { useUploadWork } from '../../../hooks/contract_releted/milestone_releted/useUploadWork.js';
import ShowFilesModel from '../ContractComponets/ShowFilesModel.jsx';



const STATUS_CONFIG = {

    PENDING_ACCEPTANCE: {
        label: "Pending Acceptance",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        icon: FaLock,
        nodeBg: "bg-amber-500",
        nodeIcon: FaHourglassHalf,
        cardBg: "bg-amber-50/70",
        cardBorder: "border-amber-100",
        infoitemborder: "border border-amber-200",
    },

    IN_PROGRESS: {
        label: "in progress",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
        icon: FaBolt,
        nodeBg: "bg-blue-500",
        nodeIcon: IoRocket,
        cardBg: "bg-blue-50/70",
        cardBorder: "border-blue-100",
        infoitemborder: "border border-blue-200",

    },

    SUBMITTED: {
        label: "Submitted",
        badgeBg: "bg-purple-50",
        badgeText: "text-purple-700",
        icon: IoCloudUploadOutline,
        nodeBg: "bg-purple-500",
        nodeIcon: IoCloudUploadOutline,
        cardBg: "bg-purple-50/70",
        cardBorder: "border-purple-100",
        infoitemborder: "border border-purple-200",
    },

    APPROVED: {
        label: "Approved",
        badgeBg: "bg-violet-50",
        badgeText: "text-violet-700",
        icon: FaThumbsUp,
        nodeBg: "bg-violet-500",
        nodeIcon: FaThumbsUp,
        cardBg: "bg-violet-50/70",
        cardBorder: "border-violet-100",
        infoitemborder: "border border-violet-200",
    },
};


const NOTE = {
    PENDING_ACCEPTANCE: {
        icon: FaClock,
        note: "Waiting for you to accept this milestone. Review the requirements and start the work when you are ready.",
        style: "text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
    },

    ACCEPTED: {
        icon: FaCheckCircle,
        note: "You have accepted this milestone. Start working on the deliverables and complete the tasks within the deadline.",
        style: "text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
    },

    IN_PROGRESS: {
        icon: FaPlayCircle,
        note: "This milestone is currently in progress. Continue working and submit your completed work before the due date.",
        style: "text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
    },

    SUBMITTED: {
        icon: FaUpload,
        note: "You have submitted your work. Waiting for the client to review and approve your submission.",
        style: "text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 mb-2"
    },

    APPROVED: {
        icon: FaThumbsUp,
        note: "Congratulations! Your submitted work has been approved by the client. The milestone is accepted and is now moving towards payment release.",
        style: "text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2"
    },

    COMPLETED: {
        icon: FaCheckCircle,
        note: "Congratulations! This milestone has been successfully completed. Your work has been accepted and the payment has been released.",
        style: "text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
    },


    REVISION_REQUESTED: {
        icon: FaRedoAlt,
        note: "The client requested changes. Review the feedback, make the required updates, and resubmit your work.",
        style: "text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2"
    },

    LOCKED: {
        icon: FaLock,
        note: "This milestone is locked. Complete the previous milestones before starting this one.",
        style: "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
    }
};


function InfoItem({ icon: Icon, label, value, valueClassName = "", border, onClick, }) {
    return (
        <div className={`flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 flex-1 min-w-[140px] ${border}`}>
            <Icon size={16} className="text-gray-400 shrink-0" />

            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>

                {onClick ? (
                    <button
                        onClick={onClick}
                        className={`text-sm font-medium text-gray-800 flex items-center gap-1 cursor-pointer ${valueClassName}`}
                    >
                        {value}
                        <FaLongArrowAltLeft />
                        <span className="text-xs">Click</span>
                    </button>
                ) : (
                    <p className={`text-sm font-medium text-gray-800 ${valueClassName}`}>
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg?.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${cfg?.badgeBg} ${cfg?.badgeText} border`}
        >
            <Icon size={13} />
            {cfg?.label}
        </span>
    );
}

function TimelineNode({ status, isLast }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.nodeIcon;
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${cfg.nodeBg}`}
            >
                <Icon size={18} />
            </div>
            {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
        </div>
    );
}

function ActionButton({ children, icon: Icon, variant = "default", onClick }) {
    const base =
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-150";
    const variants = {
        primary:
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]",
        default:
            "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm active:scale-[0.98]",
        danger:
            "border-gray-300 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:shadow-sm active:scale-[0.98]",

        files: "border-green-600 bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-[0.98]",

        delete: "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-[0.98]",
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]}`}>
            {Icon && <Icon className="text-sm" />}
            {children}
        </button>
    );
}

const UploadWork = (
    {
        setShowUploadWorkModal,
        milestoneId,
        contractId,
    }
) => {
    const [files, setFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);
    // console.log("milestoneId in upload work", milestoneId);

    const {
        mutateAsync: uploadWork,
        isPending,
        isSuccess,
        isError,
        error,
        data: milestoneCreationData,
    } = useUploadWork(contractId);


    function Handle_UploadWork() {
        const data = new FormData();
        data.append("milestoneId", milestoneId);
        data.append("contractId", contractId);

        files.forEach((file) => {
            data.append("FreelancerAttachments", file);
        });

        uploadWork(data);

    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} Bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    };

    const getPreviewUrl = (file) => URL.createObjectURL(file);

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file) => {

        if (file.type.startsWith("image/"))
            return <FaFileImage className="text-blue-500 text-2xl" />;

        if (file.type === "application/pdf")
            return <FaFilePdf className="text-red-500 text-2xl" />;

        if (
            file.type.includes("word") ||
            file.name.endsWith(".doc") ||
            file.name.endsWith(".docx")
        )
            return <FaFileWord className="text-blue-700 text-2xl" />;

        if (
            file.type.includes("zip") ||
            file.type.includes("rar") ||
            file.type.includes("7z")
        )
            return <FaFileArchive className="text-yellow-600 text-2xl" />;

        return <FaFileAlt className="text-slate-500 text-2xl" />;
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useFileDropzone({
        files,
        setFiles,
        setFileErrors,
        maxFiles: 5,
        maxSize: 50 * 1024 * 1024,
        accept: {
            "image/*": [],
            // PDF
            "application/pdf": [],
            // ZIP
            "application/zip": [],

            // RAR
            "application/vnd.rar": [],

            // 7z
            "application/x-7z-compressed": [],

            // Text files
            "text/plain": [],
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">

            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Submit work for Milestone 3
                    </h2>
                    <button
                        className="text-sm font-semibold text-slate-600 hover:text-red-600 border rounded-md px-3 py-1 transition-all duration-300 ease-in-out"
                        onClick={() => setShowUploadWorkModal(false)}
                    >
                        Close
                    </button>
                </div>

                {/* Body: two aligned columns */}
                <div
                    className={`grid gap-6 p-6  ${files.length > 0 ? "grid-cols-2" : "grid-cols-1"
                        }`}
                >
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out bg-slate-50 h-96
            ${isDragActive
                                ? "border-blue-500 bg-blue-50 scale-[1.01]"
                                : "border-slate-300 hover:border-blue-500 hover:bg-slate-100"
                            } 
          `}
                    >
                        <input {...getInputProps()} />

                        <div className="flex h-full flex-col items-center justify-center py-12 px-6 text-center">
                            <div
                                className={`
                flex h-20 w-20 items-center justify-center rounded-full
                transition-all duration-300
                ${isDragActive
                                        ? "bg-blue-100 text-blue-600 scale-110"
                                        : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                                    }
              `}
                            >
                                <FaCloudUploadAlt size={42} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-slate-800">
                                {isDragActive ? "Drop your files here" : "Upload Attachments"}
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                                Drag & drop your files here, or{" "}
                                <span className="font-semibold text-blue-600">click to browse</span>
                            </p>

                            <div className="mt-5 flex flex-wrap justify-center gap-2">
                                <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    <FaFileAlt />
                                    Images
                                </span>
                                <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    <FaFileAlt />
                                    PDF
                                </span>
                                <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    <FaFileAlt />
                                    Word
                                </span>
                                <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    <FaFileAlt />
                                    ZIP
                                </span>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                                <FaMousePointer />
                                Click anywhere inside this area to select files
                            </div>
                        </div>
                    </div>

                    {/* File preview list — only rendered once files exist, same height as dropzone */}
                    {files.length > 0 && (
                        <div className="flex h-96 flex-col rounded-2xl bg-white shadow-lg border">
                            <div className="border-b p-4">
                                <h2 className="font-semibold text-slate-700">
                                    Selected Files ({files.length})
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border-b p-4 hover:bg-slate-50 transition"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            {getFileIcon(file)}
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-slate-700 truncate">
                                                    {file.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <button
                                                onClick={() => window.open(getPreviewUrl(file), "_blank")}
                                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 transition"
                                            >
                                                <FaEye />
                                                Open
                                            </button>

                                            <button
                                                onClick={() => removeFile(index)}
                                                className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer action + error message*/}
                <div className="flex justify-end gap-3 border-t px-6 py-4">

                    {/* show error message */}
                    {
                        fileErrors.length > 0 && (
                            <div className="mt-5 w-full max-w-md space-y-2">

                                {fileErrors.map((error, index) => (

                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                                    >
                                        <FaExclamationCircle className="shrink-0" />

                                        <span>{error}</span>

                                    </div>

                                ))}

                            </div>
                        )
                    }

                    <button
                        className="rounded-md border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        onClick={() => setShowUploadWorkModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={files.length === 0}
                        onClick={() => Handle_UploadWork()}
                    >
                        {
                            isPending ? "Uploading Work..." : <p className="flex items-center gap-1">  <FiPlus />
                                Upload</p>
                        }
                    </button>
                </div>
            </div>

        </div>
    );
}

const Milestone_Timeline_For_Freelancer = ({ milestonesData = [], contractId, }) => {

    const [expandedDescriptions, setExpandedDescriptions] = useState(null);
    const [showFilesModal, setShowFilesModal] = useState(false);
    const [showUploadWorkModal, setShowUploadWorkModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({ title: "", files: [] });
    const dispatch = useDispatch();

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => (prev === id ? null : id));
    };

    const { mutate: MilestoneAction } = useHandleMilestone();

    function HandleMilestoneAction(milestoneAction) {
        MilestoneAction(milestoneAction);
    }

    let MilestoneId;

    return (
        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl p-3">

            {milestonesData.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm">
                            <FiClock size={32} />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-slate-800">
                            Waiting for Client to Create Milestones
                        </h2>

                        {/* Description */}
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                            The client hasn't created any milestones for this contract yet.
                            Once milestones are added, you'll be able to review them,
                            accept or request changes, submit your work, and track your
                            project progress from here.
                        </p>

                        {/* Features */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                📋 Review Milestones
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                ✅ Accept Work Plans
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                🚀 Submit Deliverables
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                💵 Receive Secure Payments
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
                            <p className="text-sm text-amber-700">
                                <span className="font-semibold">What happens next?</span>
                                <br />
                                The client will create one or more milestones outlining the
                                project tasks, payment amounts, and due dates. You'll receive
                                a notification once they're available for your review.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {
                        [...milestonesData]?.reverse().map((mile, index) => {
                            const { milestoneTitle, milestoneDescription, milestoneAmount, milestoneDueDate, milestoneStatus, createdAt,
                                ClientAttachments, _id: milestoneId, milestoneStartDate, FreelancerAttachments = [] } = mile;

                            MilestoneId = milestoneId;
                            const cfg = STATUS_CONFIG[milestoneStatus];

                            // for note
                            const noteConfig = NOTE[milestoneStatus];
                            const Icon = noteConfig?.icon;

                            const { days, isExpired, isToday } = getRemeningDaysStatus(milestoneDueDate);
                            const deadlineText = isExpired
                                ? `Overdue by ${Math.abs(days)} day(s)`
                                : isToday
                                    ? "Due Today"
                                    : `${days} day(s) remaining`;

                            // console.log(deadlineText);

                            return (
                                <div
                                    key={milestoneId}
                                    className="flex gap-2"
                                >
                                    <TimelineNode
                                        status={milestoneStatus}
                                        isLast={index === milestonesData.length - 1}
                                    />

                                    <div
                                        className={`rounded-2xl border p-5 flex-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl ${cfg?.cardBg} ${cfg?.cardBorder} mt-2 mb-6`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-[1.2rem] font-semibold text-gray-900">
                                                    {milestoneTitle}
                                                </h3>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <StatusBadge status={milestoneStatus} />
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {milestoneStartDate ? `Accepted on ${milestoneStartDate.split("T")[0]}` : `Created on ${createdAt.split("T")[0]}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-2 mb-4">
                                            <p className="text-[0.9rem] font-medium text-gray-400 uppercase tracking-wide mb-1">
                                                Client Description
                                            </p>

                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedDescriptions === index
                                                    ? "max-h-96"
                                                    : "max-h-18"
                                                    }`}
                                            >
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                    {milestoneDescription}
                                                </p>
                                            </div>

                                            {milestoneDescription.length > 150 && (
                                                <button
                                                    onClick={() => toggleDescription(index)}
                                                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    {expandedDescriptions === index
                                                        ? "Show Less"
                                                        : "Show More"}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <InfoItem
                                                icon={FaCalendarAlt}
                                                label="Due Date"
                                                value={milestoneDueDate.split("T")[0]}
                                                border={cfg?.infoitemborder}

                                            />

                                            <InfoItem
                                                icon={FaLock}
                                                label="Escrow Amount"
                                                value={`$${milestoneAmount}`}
                                                border={cfg?.infoitemborder}
                                                valueClassName={
                                                    milestoneStatus === "pending"
                                                        ? "text-amber-600"
                                                        : ""
                                                }
                                            />

                                            <InfoItem
                                                icon={FaFileAlt}
                                                label="Deliverables"
                                                value={ClientAttachments.length}
                                                border={cfg?.infoitemborder}
                                                onClick={() => {
                                                    setSelectedFiles({ title: "Files You Attached", files: ClientAttachments });
                                                    setShowFilesModal(true);
                                                }}

                                            />

                                            <InfoItem
                                                icon={FaClock}
                                                label="Remaining Time"
                                                value={`${milestoneStartDate ? deadlineText : 'N/A'}`}
                                                border={cfg?.infoitemborder}
                                            />

                                        </div>



                                        {noteConfig && (
                                            <div

                                                className="mt-3 flex flex-wrap gap-2 w-full"
                                            >
                                                <div className={`${noteConfig.style} w-full flex items-start gap-2`}>

                                                    <Icon
                                                        className="mt-0.5 flex-shrink-0 text-base"
                                                    />

                                                    <span>
                                                        {noteConfig.note}
                                                    </span>

                                                </div>
                                            </div>
                                        )}



                                        {milestoneStatus === "PENDING_ACCEPTANCE" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() => HandleMilestoneAction({ milestoneId, contractId, action: "accept" })}
                                                >
                                                    Accept milestone
                                                </ActionButton>

                                                <ActionButton onClick={() => actions.onRequestChanges(milestoneId)}>
                                                    Request changes
                                                </ActionButton>

                                            </div>
                                        )}


                                        {milestoneStatus === "IN_PROGRESS" && (
                                            <div className="mt-3 flex flex-wrap gap-2">

                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() => HandleMilestoneAction({ milestoneId, contractId, action: "submit_work" })}
                                                >
                                                    Submit work
                                                </ActionButton>

                                                <ActionButton
                                                    icon={FiUpload}
                                                    onClick={() => setShowUploadWorkModal(true)}
                                                >
                                                    Upload Work

                                                </ActionButton>

                                                <ActionButton
                                                    variant="files"
                                                    onClick={() => {
                                                        setSelectedFiles({ title: "Files Submitted by Freelancer", files: FreelancerAttachments });
                                                        setShowFilesModal(true);
                                                    }}
                                                >
                                                    View Your Files
                                                </ActionButton>


                                            </div>
                                        )}

                                        {
                                            milestoneStatus === "SUBMITTED" && (
                                                <ActionButton
                                                    variant="files"
                                                    onClick={() => {
                                                        setSelectedFiles({ title: "Files Submitted by Freelancer", files: FreelancerAttachments });
                                                        setShowFilesModal(true);
                                                    }}
                                                >
                                                    View Your Files
                                                </ActionButton>

                                            )
                                        }

                                        {milestoneStatus === "needs_revision" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() => actions.onResubmit(milestoneId)}
                                                >
                                                    Resubmit work
                                                </ActionButton>
                                                <ActionButton
                                                    icon={FiMail}
                                                    onClick={() => actions.onMessageClient(milestoneId)}
                                                >
                                                    Message client
                                                </ActionButton>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
            }


            {/* // file model to see all uploaded files by client */}

            {
                showFilesModal && (
                    <ShowFilesModel
                        title={selectedFiles.title}
                        files={selectedFiles.files}
                        onClose={() => setShowFilesModal(false)} />
                )
            }

            {
                showUploadWorkModal && (
                    <UploadWork
                        setShowUploadWorkModal={setShowUploadWorkModal}
                        milestoneId={MilestoneId}
                        contractId={contractId}

                    />
                )
            }




        </div>
    );
};

export default Milestone_Timeline_For_Freelancer
