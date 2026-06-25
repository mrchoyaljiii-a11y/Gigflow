import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCreateMilestone } from '../../hooks/useCreateMilestone.js'

import {
    FiCheckCircle,
    FiClock,
    FiLock,
    FiCalendar,
    FiEye,
    FiEdit,
    FiAlertTriangle,
    FiDollarSign,
    FiArrowRight,
    FiFileText,
    FiUploadCloud,
    FiPlus,
} from "react-icons/fi";

import {
    FaClock,
    FaCircleCheck,
    FaMoneyBillWave,
    FaCircleXmark
} from "react-icons/fa6";

import {
    MdOutlineSync,
    MdGavel
} from "react-icons/md";

import {
    IoCloudUploadOutline
} from "react-icons/io5";

import { CgSandClock } from "react-icons/cg";
import { useDispatch } from "react-redux";


const statusConfig = {
    pending: {
        icon: <CgSandClock size={18} />,
        badge: "Pending",
        color: "bg-slate-100 text-slate-600",
        iconBg: "bg-slate-400",
    },

    in_progress: {
        icon: <MdOutlineSync className="animate-spin" />,
        badge: "In Progress",
        color: "text-blue-600 bg-blue-100",
        label: "In Progress",

    },

    submitted: {
        icon: <IoCloudUploadOutline />,
        badge: "Submitted",
        color: "text-purple-600 bg-purple-100",
        label: "Submitted"
    },

    approved: {
        icon: <FaCircleCheck />,
        badge: "Approved",
        color: "text-green-600 bg-green-100",
        label: "Approved"
    },

    // if payment is released then milestone is completed
    released: {
        icon: <FaMoneyBillWave />,
        badge: "Completed",
        color: "text-emerald-600 bg-emerald-100",
        label: "Payment Released"
    },

    cancelled: {
        icon: <FaCircleXmark />,
        badge: "Cancelled",
        color: "text-red-600 bg-red-100",
        label: "Cancelled"
    },

    disputed: {
        icon: <MdGavel />,
        badge: "Disputed",
        color: "text-orange-600 bg-orange-100",
        label: "Disputed"
    },

};

const Addmilestone = ({ setAddmilestone, contractId, setShowTost }) => {

    const {
        mutateAsync: createMilestone,
        isPending,
        isSuccess,
        isError,
        error,
        data: milestoneCreationData,
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

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        multiple: true,
        maxFiles: 5,

        maxSize: MAX_FILE_SIZE,
        accept: {
            "image/*": [],
            "application/pdf": [],
            "application/zip": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [],
        },

        onDrop: (acceptedFiles, rejectedFiles) => {
            setFileErrors([]);

            // Total size validation
            const currentSize = files.reduce((sum, file) => sum + file.size, 0);

            const newSize = acceptedFiles.reduce(
                (sum, file) => sum + file.size,
                0
            );

            if (currentSize + newSize > MAX_TOTAL_SIZE) {
                setFileErrors([
                    "Total upload size cannot exceed 50 MB."
                ]);

                return;
            }

            // Remove duplicate files
            const uniqueFiles = acceptedFiles.filter(
                (newFile) =>
                    !files.some(
                        (existingFile) =>
                            existingFile.name === newFile.name &&
                            existingFile.size === newFile.size
                    )
            );

            setFiles((prev) => [...prev, ...uniqueFiles]);

            let errors = [];

            rejectedFiles.forEach((file) => {
                file.errors.forEach((error) => {

                    if (error.code === "file-too-large") {
                        errors.push(`${file.file.name} exceeds 10 MB.`);
                    }

                    if (error.code === "too-many-files") {
                        errors.push("Maximum 5 files allowed.");
                    }

                    if (error.code === "file-invalid-type") {
                        errors.push(`${file.file.name} has invalid type.`);
                    }
                });
            });

            setFileErrors(errors);

            console.log("Accepted Files:", acceptedFiles);
            console.log("Current Files:", files);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        // Title
        if (!formData.title.trim()) {
            newErrors.title = "Milestone title is required";
        } else if (formData.title.trim().length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        // Description
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 20) {
            newErrors.description =
                "Description must contain at least 20 characters";
        }

        // Amount
        if (!formData.amount) {
            newErrors.amount = "Amount is required";
        } else if (Number(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        // Due Date
        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required";
        } else {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.dueDate = "Due date cannot be in the past";
            }
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

        files.forEach((file) => {
            data.append("attachments", file);
        });

        // console form data
        // console.log("milestone data:");

        // for (let pair of data.entries()) {
        //     console.log(pair[0] + ": " + pair[1]);
        // }

        // console.log("Selected files:");

        // files.forEach(file => {
        //     console.log({
        //         name: file.name,
        //         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        //         type: file.type
        //     });
        // });

        const result = await createMilestone(data);

        console.log("create milestone result:", result);


        if (result.success) {
            setShowTost({ show: true, message: result.message });
            setAddmilestone(false);
        }
    };

    return <>
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <div className="border-b border-slate-100 p-8">
                <div className="flex items-center gap-4 justify-between">

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <FiEdit size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Create New Milestone
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Define project goals, due dates, and escrow payments for your
                                freelancer.
                            </p>
                        </div>
                    </div>

                    <button
                        className="border p-2 rounded-xl font-semibold text-lg text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        onClick={() => setAddmilestone(false)}
                    > <span>X</span> Close
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-8">

                {/* Milestone Title */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Milestone Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Homepage Design & Wireframes"
                        className={`w-full rounded-2xl border px-5 py-4 outline-none transition-all
  ${errors.title
                                ? "border-red-500"
                                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            }`}
                    />

                    {errors.title && (
                        <p className="mt-2 text-sm text-red-500">{errors.title}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                    </label>

                    <textarea
                        rows="5"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`w-full rounded-2xl border px-5 py-4 resize-none
  ${errors.description
                                ? "border-red-500"
                                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            }`}
                    />

                    {errors.description && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Amount + Due Date */}
                <div className="grid gap-6 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Escrow Amount
                        </label>

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
  ${errors.amount
                                        ? "border-red-500"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    }`}
                            />

                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Due Date
                        </label>

                        <div className="relative">
                            <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={`w-full rounded-2xl border py-4 pl-12 pr-5
  ${errors.dueDate
                                        ? "border-red-500"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    }`}
                            />

                            {errors.dueDate && (
                                <p className="mt-2 text-sm text-red-500">{errors.dueDate}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Files */}
                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                        Attach Files (Optional)
                    </label>

                    <div
                        {...getRootProps()}

                        className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center transition hover:border-blue-300 hover:bg-blue-50"
                    >

                        <input {...getInputProps()} />

                        <FiUploadCloud
                            size={38}
                            className="mx-auto mb-4 text-slate-400"
                        />

                        <h3 className="font-semibold text-slate-700">
                            Drag & Drop Files Here
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            PDF, Images, ZIP, DOC, DOCX (Max 10MB)
                        </p>
                    </div>
                </div>

                {
                    fileErrors.length > 0 &&
                    fileErrors.map((error, index) => (
                        <div
                            key={index}
                            className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600"
                        >
                            {error}
                        </div>
                    ))
                }

                {/* files overview */}
                <div className="space-y-3 mt-6">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div>
                                <h3 className="font-medium text-slate-700">
                                    {file.name}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <button
                                type="button"
                                className="rounded-xl bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
                                onClick={() =>
                                    setFiles(files.filter((_, i) => i !== index))
                                }
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="rounded-3xl bg-blue-50 p-6 border border-blue-100">
                    <h4 className="font-bold text-blue-900">
                        Payment Protection
                    </h4>

                    <p className="mt-2 text-sm leading-7 text-blue-700">
                        Funds for this milestone will remain in escrow and will only be
                        released after you approve the completed work.
                    </p>
                </div>

                {/* // ?upload progress files */}
                {
                    uploadProgress > 0 && (
                        <div className="space-y-2">

                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Uploading files...</span>

                                <span>{uploadProgress}%</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                    style={{
                                        width: `${uploadProgress}%`
                                    }}
                                />

                            </div>

                        </div>
                    )
                }

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}

                        className=" flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700"
                    >
                        {
                            isPending ? "Uploading..." : <p className="flex items-center gap-1">  <FiPlus />
                                Create Milestone</p>
                        }
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
    </>

}

const MilestoneTimeline = ({ milestonesData = [], contractId, setShowTost }) => {

    const [AddmilestoneOpen, setAddmilestone] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showFilesModal, setShowFilesModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    return (
        <>
            {
                AddmilestoneOpen ? (<Addmilestone setAddmilestone={setAddmilestone} contractId={contractId} setShowTost={setShowTost} />) : (
                    milestonesData.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg transition-all duration-300 hover:shadow-xl">
                            <div className="flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
                                    <FiEdit size={32} />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-slate-800">
                                    No Milestones Created Yet
                                </h2>

                                {/* Description */}
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                                    This contract doesn't have any milestones yet. Create milestones to
                                    organize project deliverables, track progress, and securely manage
                                    escrow payments between you and the freelancer.
                                </p>

                                {/* Features */}
                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                        📌 Track Progress
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                        💰 Secure Payments
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                        📂 Manage Deliverables
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    className=" mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"

                                    onClick={() => setAddmilestone(true)}
                                >
                                    <FiEdit />
                                    Create First Milestone
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                            {/* Header */}

                            <div className="border-b border-slate-100 p-7">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">
                                            Milestones
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Track project progress and manage escrow payments.
                                        </p>
                                    </div>

                                    <button
                                        className=" flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl "

                                        onClick={() => setAddmilestone(true)}
                                    >
                                        <FiEdit />

                                        Add Milestone
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}

                            <div className="relative p-8">
                                {/* Vertical Line */}

                                <div className="absolute left-[48px] top-0 bottom-0 w-[2px] bg-slate-200" />

                                <div className="space-y-8">
                                    {milestonesData.map((item) => {

                                        const { milestoneTitle, milestoneDescription, milestoneAmount, milestoneDueDate, milestoneStatus, createdAt, attachments } = item;

                                        const config = statusConfig[milestoneStatus];

                                        return (
                                            <div
                                                key={createdAt}
                                                className="relative flex gap-6 group"
                                            >
                                                {/* Timeline Dot */}

                                                <div
                                                    className={` z-10 flex h-10  w-10  items-center justify-center  rounded-full  text-white  shadow-lg  ${config.iconBg}  transition-all  duration-300  group-hover:scale-110
                  `}
                                                >
                                                    {config.icon}
                                                </div>

                                                {/* Card */}

                                                <div
                                                    className="flex-1  rounded-2xl  border  border-slate-200  bg-white  p-6  shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                                                >
                                                    {/* Top */}

                                                    <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <h3 className="text-xl font-bold text-slate-800">
                                                                    {milestoneTitle}
                                                                </h3>

                                                                <span
                                                                    className={` rounded-full px-3 py-1 text-xs font-semibold ${config.color} `}
                                                                >
                                                                    {config.badge}
                                                                </span>

                                                            </div>

                                                            <p className={`${showFullDescription ? "" : "line-clamp-2"} whitespace-pre-line break-words transition-all duration-300 border border-slate-200 bg-white p-1.5 shadow-sm rounded-2xl mt-3 max-w-4xl`}>
                                                                {milestoneDescription}
                                                            </p>

                                                            {milestoneDescription.length > 150 && (
                                                                <button
                                                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                                                    className="text-blue-600 font-medium mt-2 hover:underline"
                                                                >
                                                                    {showFullDescription ? "Show Less" : "Show More"}
                                                                </button>
                                                            )}

                                                        </div>

                                                        {/* Amount */}

                                                        <div className="text-right">
                                                            <p className="text-sm text-slate-500">
                                                                Escrow Amount
                                                            </p>

                                                            <h2 className="mt-1 text-xl font-bold text-blue-600">
                                                                {milestoneAmount}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    {/* Bottom */}

                                                    <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <FiCalendar />

                                                            Due {milestoneDueDate.split("T")[0]}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <FiDollarSign />

                                                            Escrow Protected
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <FiFileText />

                                                            Deliverables Included
                                                        </div>
                                                    </div>

                                                    {/* Actions */}

                                                    <div className="mt-6 flex flex-wrap gap-3">
                                                        <button
                                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 transition-all hover:border-blue-300 hover:bg-blue-50"
                                                            onClick={() => {
                                                                setSelectedFiles(attachments || []);
                                                                setShowFilesModal(true);
                                                            }}
                                                        >
                                                            <FiEye />
                                                            View Files
                                                            {attachments?.length > 0 && (
                                                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                                    {attachments.length}
                                                                </span>
                                                            )}
                                                        </button>

                                                        {milestoneStatus === "review" && (
                                                            <>
                                                                <button
                                                                    className=" flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-green-700 "
                                                                >
                                                                    Release Payment

                                                                    <FiArrowRight />
                                                                </button>

                                                                <button
                                                                    className=" flex items-center gap-2 rounded-xl bg-red-50 px-5 py-2 text-red-600 transition-all hover:bg-red-100 "
                                                                >
                                                                    <FiAlertTriangle />

                                                                    Request Changes
                                                                </button>
                                                            </>
                                                        )}

                                                        {milestoneStatus === "completed" && (
                                                            <button
                                                                className="
                          rounded-xl
                          bg-green-50
                          px-5
                          py-2
                          font-medium
                          text-green-700
                        "
                                                            >
                                                                ✓ Payment Released
                                                            </button>
                                                        )}

                                                        {milestoneStatus === "pending" && (
                                                            <button
                                                                className="
                          rounded-xl
                          bg-slate-100
                          px-5
                          py-2
                          text-slate-600
                        "
                                                            >
                                                                Waiting to Start
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                )

            }
             {/* // File Modal */}
            {
                showFilesModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

                            {/* Header */}
                            <div className="flex items-center justify-between border-b p-6">
                                <h2 className="text-xl font-bold text-slate-800">
                                    Milestone Files
                                </h2>

                                <button
                                    className="text-red-500 font-semibold hover:bg-red-300 hover:text-red-600 p-2 rounded-full transition-all"
                                    onClick={() => setShowFilesModal(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Files */}
                            <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">

                                {
                                    selectedFiles.length === 0 ? (
                                        <div className="text-center text-slate-500 py-8">
                                            No files attached.
                                        </div>
                                    ) : (
                                        selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between border rounded-2xl p-4 hover:bg-slate-50"
                                            >
                                                <div>
                                                    <h3 className="font-semibold text-slate-700">
                                                        {file.fileName}
                                                    </h3>

                                                    <p className="text-sm text-slate-500">
                                                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>

                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Open
                                                </a>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </>

    );
};

export default MilestoneTimeline;