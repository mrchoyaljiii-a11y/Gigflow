import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateMilestone } from '../../hooks/contract_releted/milestone_releted/useCreateMilestone.js';
import ShowFilesModel from './ContractComponets/ShowFilesModel.jsx';

import {
    FaClock,
    FaLock,
    FaHourglassHalf,
    FaEye, FaThumbsUp, FaFileAlt, FaCalendarAlt,
    FaExclamationCircle, FaMoneyCheckAlt, FaBolt,
    FaCheckCircle, FaPlayCircle, FaPaperPlane, FaUndoAlt,

} from "react-icons/fa";

import {
    FiCalendar,
    FiEdit,
    FiAlertTriangle,
    FiDollarSign,
    FiArrowRight,
    FiFileText,
    FiUploadCloud,
    FiPlus,
    FiClock,
} from "react-icons/fi";

import {
    FaCircleCheck,
    FaMoneyBillWave,
    FaCircleXmark
} from "react-icons/fa6";

import { MdGavel } from "react-icons/md";
import { IoCloudUploadOutline, IoRocket } from "react-icons/io5";
import { CgSandClock } from "react-icons/cg";
import { getRemeningDaysStatus } from "../../utils/RemaingDays.js";
import { useHandleMilestone } from "../../hooks/contract_releted/milestone_releted/useHandleMilestone.js";


// desides the overall design of card according to sattus
const STATUS_CONFIG = {
    PENDING_ACCEPTANCE: {
        label: "Pending Acceptance",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        icon: FaHourglassHalf,
        nodeBg: "bg-amber-500",
        nodeIcon: CgSandClock,
        cardBg: "bg-amber-50/70",
        cardBorder: "border-amber-100",
        infoitemborder: "border border-amber-200",
    },

    IN_PROGRESS: {
        label: "In Progress",
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

    // if payment is released then milestone is completed
    RELEASED: {
        label: "Payment Released",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        icon: FaMoneyBillWave,
        nodeBg: "bg-emerald-500",
        nodeIcon: FaMoneyBillWave,
        cardBg: "bg-emerald-50/70",
        cardBorder: "border-emerald-100",
        infoitemborder: "border border-emerald-200",
    },

    CANCELLED: {
        label: "Cancelled",
        badgeBg: "bg-gray-100",
        badgeText: "text-gray-500",
        icon: FaCircleXmark,
        nodeBg: "bg-gray-400",
        nodeIcon: FaCircleXmark,
        cardBg: "bg-gray-50",
        cardBorder: "border-gray-100",
        infoitemborder: "border border-gray-200",
    },

    DISPUTE: {
        label: "Disputed",
        badgeBg: "bg-orange-50",
        badgeText: "text-orange-700",
        icon: MdGavel,
        nodeBg: "bg-orange-500",
        nodeIcon: MdGavel,
        cardBg: "bg-orange-50/70",
        cardBorder: "border-orange-100",
        infoitemborder: "border border-orange-200",
    },
};

const NOTE = {
    PENDING_ACCEPTANCE: {
        icon: FaClock,
        note: "The milestone has been sent to the freelancer. Waiting for them to accept and begin work.",
        style:
            "text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2",
    },

    ACCEPTED: {
        icon: FaCheckCircle,
        note: "The freelancer has accepted this milestone and is preparing to start work.",
        style:
            "text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2",
    },

    IN_PROGRESS: {
        icon: FaPlayCircle,
        note: "The freelancer is actively working on this milestone. You will be notified once the work is submitted.",
        style:
            "text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2",
    },

    SUBMITTED: {
        icon: FaPaperPlane,
        note: "The freelancer has submitted their work. Review the deliverables and either approve the milestone and relese payment or request revisions.",
        style:
            "text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2",
    },
    APPROVED: {
        icon: FaThumbsUp,
        note: "You have approved the submitted work. This milestone has been successfully accepted, and payment will be released according to your platform's payment process.",
        style:
            "text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2",
    },
    REVISION_REQUESTED: {
        icon: FaUndoAlt,
        note: "You requested revisions. Waiting for the freelancer to update and resubmit the work.",
        style:
            "text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2",
    },

    COMPLETED: {
        icon: FaMoneyCheckAlt,
        note: "This milestone has been approved and completed successfully. Payment has been released to the freelancer.",
        style:
            "text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2",
    },

    LOCKED: {
        icon: FaLock,
        note: "This milestone is locked and will become available after the previous milestone is completed.",
        style:
            "text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2",
    },
};

function InfoItem({ icon: Icon, label, value, valueClassName = "", border, onClick }) {
    return (
        <div className={`flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 flex-1 min-w-[140px] ${border}`}>
            <Icon size={16} className="text-gray-400 shrink-0" />

            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>

                {onClick ? (
                    <button
                        onClick={onClick}
                        className={`text-sm font-medium text-gray-800 flex items-center gap-1 cursor-pointer hover:underline ${valueClassName}`}
                    >
                        {value}
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
            className={`inline-flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full border ${cfg?.badgeBg} ${cfg?.badgeText}`}
        >
            {Icon && <Icon size={13} />}
            {cfg?.label}
        </span>
    );
}

function TimelineNode({ status, isLast }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg?.nodeIcon;
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${cfg?.nodeBg}`}
            >
                {Icon && <Icon size={18} />}
            </div>
            {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
        </div>
    );
}

function ActionButton({ children, icon: Icon, variant = "default", onClick, disabled }) {
    const base =
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary:
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]",
        default:
            "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm active:scale-[0.98]",
        danger:
            "border-gray-300 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:shadow-sm active:scale-[0.98]",
        success:
            "border-green-600 bg-green-600 text-white hover:bg-green-700 hover:shadow-md active:scale-[0.98]",
        files:
            "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-[0.98]",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
            {Icon && <Icon className="text-sm" />}
            {children}
        </button>
    );
}

// Add milestone form =
const Addmilestone = ({ setAddmilestone, contractId, setShowTost }) => {

    const {
        mutateAsync: createMilestone,
        isPending,
    } = useCreateMilestone(contractId);

    const [files, setFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        dueDate: "",
    });

    const [errors, setErrors] = useState({});

    const MAX_FILE_SIZE = 10 * 1024 * 1024; //10mb
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; //50mb

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        maxFiles: 5,
        maxSize: MAX_FILE_SIZE,
        accept: {
            "image/*": [],
            "application/pdf": [],
            "application/zip": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
        },

        onDrop: (acceptedFiles, rejectedFiles) => {
            setFileErrors([]);

            const currentSize = files.reduce((sum, file) => sum + file.size, 0);
            const newSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);

            if (currentSize + newSize > MAX_TOTAL_SIZE) {
                setFileErrors(["Total upload size cannot exceed 50 MB."]);
                return;
            }

            const uniqueFiles = acceptedFiles.filter(
                (newFile) =>
                    !files.some(
                        (existingFile) =>
                            existingFile.name === newFile.name &&
                            existingFile.size === newFile.size
                    )
            );

            setFiles((prev) => [...prev, ...uniqueFiles]);

            let errs = [];
            rejectedFiles.forEach((file) => {
                file.errors.forEach((error) => {
                    if (error.code === "file-too-large") errs.push(`${file.file.name} exceeds 10 MB.`);
                    if (error.code === "too-many-files") errs.push("Maximum 5 files allowed.");
                    if (error.code === "file-invalid-type") errs.push(`${file.file.name} has invalid type.`);
                });
            });

            setFileErrors(errs);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Milestone title is required";
        } else if (formData.title.trim().length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 20) {
            newErrors.description = "Description must contain at least 20 characters";
        }

        if (!formData.amount) {
            newErrors.amount = "Amount is required";
        } else if (Number(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required";
        } else {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) newErrors.dueDate = "Due date cannot be in the past";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("amount", formData.amount);
        data.append("dueDate", formData.dueDate);
        data.append("contractId", contractId);

        files.forEach((file) => data.append("ClientAttachments", file));

        const result = await createMilestone(data);

        if (result.success) {
            setShowTost({ show: true, message: result.message });
            setAddmilestone(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-slate-100 p-8">
                <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <FiEdit size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Create New Milestone</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Define project goals, due dates, and escrow payments for your freelancer.
                            </p>
                        </div>
                    </div>

                    <button
                        className="border p-2 rounded-xl font-semibold text-lg text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        onClick={() => setAddmilestone(false)}
                    >
                        <span>X</span> Close
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-8">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Milestone Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Homepage Design & Wireframes"
                        className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all
  ${errors.title ? "border-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                        rows="5"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full rounded-2xl border px-5 py-4 resize-none
  ${errors.description ? "border-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
                    />
                    {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Escrow Amount</label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="number"
                                min="1"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="500"
                                className={`w-full rounded-2xl border py-4 pl-12 pr-5
  ${errors.amount ? "border-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
                            />
                            {errors.amount && <p className="mt-2 text-sm text-red-500">{errors.amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Due Date</label>
                        <div className="relative">
                            <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={`w-full rounded-2xl border py-4 pl-12 pr-5
  ${errors.dueDate ? "border-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
                            />
                            {errors.dueDate && <p className="mt-2 text-sm text-red-500">{errors.dueDate}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Attach Files (Optional)</label>
                    <div
                        {...getRootProps()}
                        className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center transition hover:border-blue-300 hover:bg-blue-50"
                    >
                        <input {...getInputProps()} />
                        <FiUploadCloud size={38} className="mx-auto mb-4 text-slate-400" />
                        <h3 className="font-semibold text-slate-700">Drag & Drop Files Here</h3>
                        <p className="mt-2 text-sm text-slate-500">PDF, Images, ZIP, DOC, DOCX (Max 10MB)</p>
                    </div>
                </div>

                {fileErrors.length > 0 &&
                    fileErrors.map((error, index) => (
                        <div key={index} className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                            {error}
                        </div>
                    ))}

                <div className="space-y-3 mt-6">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div>
                                <h3 className="font-medium text-slate-700">{file.name}</h3>
                                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                type="button"
                                className="rounded-xl bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="rounded-3xl bg-blue-50 p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-900">Payment Protection</h4>
                    <p className="mt-2 text-sm leading-7 text-blue-700">
                        Funds for this milestone will remain in escrow and will only be released after you approve the completed work.
                    </p>
                </div>

                {uploadProgress > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Uploading files...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className=" flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700"
                    >
                        {isPending ? "Uploading..." : (
                            <p className="flex items-center gap-1"><FiPlus />Create Milestone</p>
                        )}
                    </button>

                    <button
                        className=" rounded-2xl border border-slate-200 px-8 py-4 text-slate-700 transition hover:bg-slate-50"
                        onClick={() => setAddmilestone(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


// Main client-side milestone 
const Milestone_Timeline_For_Client = ({ milestonesData = [], contractId, setShowTost, UserRole }) => {

    const [AddmilestoneOpen, setAddmilestone] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState(null);
    const [showFilesModal, setShowFilesModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({ title: "", files: [] });

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => (prev === id ? null : id));
    };

    const { mutate: MilestoneAction } = useHandleMilestone();

    function HandleMilestoneAction(milestoneAction) {
        MilestoneAction(milestoneAction);
    }

    if (AddmilestoneOpen) {
        return <Addmilestone setAddmilestone={setAddmilestone} contractId={contractId} setShowTost={setShowTost} />;
    }

    return (
        <div className="space-y-5 rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl p-3">

            {milestonesData.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
                            <FiEdit size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800">No Milestones Created Yet</h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                            This contract doesn't have any milestones yet. Create milestones to organize
                            project deliverables, track progress, and securely manage escrow payments
                            between you and the freelancer.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">📌 Track Progress</div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">💰 Secure Payments</div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">📂 Manage Deliverables</div>
                        </div>

                        <button
                            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                            onClick={() => setAddmilestone(true)}
                        >
                            <FiEdit />
                            Create First Milestone
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="border-b border-slate-100 p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Milestones</h2>
                            <p className="mt-1 text-sm text-slate-500">Track project progress and manage escrow payments.</p>
                        </div>

                        <button
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                            onClick={() => setAddmilestone(true)}
                        >
                            <FiEdit />
                            Add Milestone
                        </button>
                    </div>

                    {/* Timeline */}
                    <div className="p-2">
                        {[...milestonesData].reverse().map((item, index) => {
                            const {
                                _id: milestoneId,
                                milestoneTitle,
                                milestoneDescription,
                                milestoneAmount,
                                milestoneDueDate,
                                milestoneStatus,
                                createdAt,
                                milestoneStartDate,
                                ClientAttachments = [],
                                FreelancerAttachments = [],
                            } = item;

                            const cfg = STATUS_CONFIG[milestoneStatus];
                            const { days, isExpired, isToday } = getRemeningDaysStatus(milestoneDueDate);
                            const deadlineText = isExpired
                                ? `Overdue by ${Math.abs(days)} day(s)`
                                : isToday
                                    ? "Due Today"
                                    : `${days} day(s) remaining`;

                            // for note
                            const noteConfig = NOTE[milestoneStatus];
                            const Icon = noteConfig?.icon;


                            return (
                                <div key={milestoneId || createdAt} className="flex gap-2">
                                    <TimelineNode status={milestoneStatus} isLast={index === milestonesData.length - 1} />

                                    <div
                                        className={`rounded-2xl border p-5 flex-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl ${cfg?.cardBg} ${cfg?.cardBorder} mt-2 mb-6`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-[1.2rem] font-semibold text-gray-900">{milestoneTitle}</h3>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <StatusBadge status={milestoneStatus} />
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {milestoneStartDate
                                                        ? `Accepted on ${milestoneStartDate.split("T")[0]}`
                                                        : `Created on ${createdAt.split("T")[0]}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-2 mb-4">
                                            <p className="text-[0.9rem] font-medium text-gray-400 uppercase tracking-wide mb-1">
                                                Description
                                            </p>

                                            <div
                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedDescriptions === index ? "max-h-96" : "max-h-18"
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
                                                    {expandedDescriptions === index ? "Show Less" : "Show More"}
                                                </button>
                                            )}
                                        </div>

                                        {/* Info row */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <InfoItem
                                                icon={FaCalendarAlt}
                                                label="Due Date"
                                                value={milestoneDueDate.split("T")[0]}
                                                border={cfg?.infoitemborder}
                                            />

                                            <InfoItem
                                                icon={FaClock}
                                                label="Remaining Time"
                                                value={`${milestoneStartDate ? deadlineText : 'N/A'}`}
                                                border={cfg?.infoitemborder}
                                            />

                                            <InfoItem
                                                icon={FaLock}
                                                label="Escrow Amount"
                                                value={`$${milestoneAmount}`}
                                                border={cfg?.infoitemborder}
                                            />

                                            <InfoItem
                                                icon={FaFileAlt}
                                                label="Your Files"
                                                value={ClientAttachments.length}
                                                border={cfg?.infoitemborder}
                                                onClick={() => {
                                                    setSelectedFiles({ title: "Files You Attached", files: ClientAttachments });
                                                    setShowFilesModal(true);
                                                }}
                                            />

                                            <InfoItem
                                                icon={FaFileAlt}
                                                label="Freelancer's Files"
                                                value={FreelancerAttachments.length}
                                                border={cfg?.infoitemborder}
                                                onClick={() => {
                                                    setSelectedFiles({ title: "Files Submitted by Freelancer", files: FreelancerAttachments });
                                                    setShowFilesModal(true);
                                                }}
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

                                        {milestoneStatus === "SUBMITTED" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <ActionButton
                                                    variant="success"
                                                    icon={FaCheckCircle}
                                                    onClick={() => HandleMilestoneAction({ milestoneId, contractId, action: "approved" })}
                                                >
                                                    Approved
                                                </ActionButton>

                                                <ActionButton variant="danger" icon={FiAlertTriangle}>
                                                    Request Changes
                                                </ActionButton>

                                                <ActionButton
                                                    variant="files"
                                                    icon={FaEye}
                                                    onClick={() => {
                                                        setSelectedFiles({ title: "Files Submitted by Freelancer", files: FreelancerAttachments });
                                                        setShowFilesModal(true);
                                                    }}
                                                >
                                                    Review Submission
                                                </ActionButton>
                                            </div>
                                        )}

                                        {milestoneStatus === "APPROVED" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <ActionButton variant="success" icon={FaMoneyBillWave}>
                                                    Release Payment
                                                </ActionButton>
                                            </div>
                                        )}

                                        {milestoneStatus === "RELEASED" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-xl bg-emerald-50 px-5 py-2 font-medium text-emerald-700">
                                                    ✓ Payment Released
                                                </span>
                                            </div>
                                        )}

                                        {milestoneStatus === "DISPUTE" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <ActionButton variant="danger" icon={MdGavel}>
                                                    View Dispute
                                                </ActionButton>
                                            </div>
                                        )}

                                        {milestoneStatus === "CANCELLED" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-xl bg-gray-100 px-5 py-2 text-gray-500">
                                                    Milestone Cancelled
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            {
                showFilesModal && (
                    <ShowFilesModel
                        title={selectedFiles.title}
                        files={selectedFiles.files}
                        onClose={() => setShowFilesModal(false)} />
                )
            }

        </div>
    );
};

export default Milestone_Timeline_For_Client;