import React, { useState, useEffect } from 'react'
import { FaWallet, FaClock } from "react-icons/fa6";
import Header from '../../../components/header/footer/Header.jsx'
import { set, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
// text editor reacr-quill
import JobDescriptionEditor from '../../../components/JobDescriptionEditor.jsx'
import { Addjob } from '../../../redux/slices/job_slice.js' // add job function to send data to backend

import { FaGraduationCap } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { IoMdCloudUpload } from "react-icons/io";
import ShowErrorTost from '../../../components/Toasts/ShowToast.jsx';
import { useAddJob } from '../../../hooks/job_releted/useAddJob.js';
import { useDispatch, useSelector } from 'react-redux'
import { showToast } from '../../../redux/ShowTost/ShowToastSlice.js';

const Job_posting = () => {

    const { mutateAsync: addJob, isLoading, isError, error: addJobError } = useAddJob();

    console.log("is error:", isError, "error:", addJobError);

    const [nextSatge, setnextStage] = useState(1)
    const [SkillsInput, setSkillsInput] = useState("");
    const [Skills, setSkills] = useState([]);
    const [SkillsError, setSkillsError] = useState(false)
    const [File, setFile] = useState(null)
    const [FilePreview, setFilePreview] = useState(null)

    const [jobDescription, setJobDescription] = useState("");
    const [error, setError] = useState("");

    // console.log("job description:", jobDescription);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
        reset
    } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });


    const HandlePrevious_stage = () => {
        setnextStage(prev => prev - 1)
    }

    const HandleNext_stage = async () => {
        let isValid = false

        if (nextSatge === 1) {
            isValid = await trigger(["jobtitle",
                "projectCategory",
                "price",])
        }

        if (nextSatge === 2) {
            isValid = await trigger(["experiance"])

            if (Skills.length === 0) {
                setSkillsError(true)
                isValid = false
            } else {
                setSkillsError(false)
            }

            if (!jobDescription || jobDescription === "<p><br></p>") {
                setError("Job description is required");
                return;
            }

            setError("");
        }

        if (nextSatge === 3) {
            isValid = await trigger([
                "Project_Duration.deliveryTime",
                "Project_Duration.deliveryUnit"])
        }

        if (isValid) {
            setnextStage(prev => prev + 1)
        }
    }

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0])
        const file = acceptedFiles[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert("file must be under 5MB");
            return;
        }

        // for ui preview
        const previewUrl = URL.createObjectURL(file)
        setFilePreview({
            url: previewUrl,
            name: file.name,
            type: file.type,
            size: (file.size / 1024 / 1024).toFixed(2),
        });
    }

    const onDropRejected = (fileRejections) => {
        const rejection = fileRejections[0];
        if (!rejection) return;

        const error = rejection.errors[0]?.code;

        if (error === "file-too-large") {
            alert("File must be under 5MB");
        } else if (error === "file-invalid-type") {
            alert("Only PDF and DOCX files are allowed");
        } else {
            alert("File upload failed");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxSize: 5 * 1024 * 1024 // max size 5MB
    });

    useEffect(() => {
        return () => {
            if (FilePreview?.url) {
                URL.revokeObjectURL(FilePreview.url);
            }
        };
    }, [FilePreview]);

    const handleAddSkills = () => {
        if (
            SkillsInput.trim() !== "" &&
            !Skills.includes(SkillsInput.trim())
        ) {
            setSkills([...Skills, SkillsInput.trim()])
            setSkillsInput("")
            setSkillsError(false)

        }
    }

    const handleRemoveSkill = (lang) => {
        setSkills(Skills.filter(l => l !== lang))
    }


    const projectCategory = [
        { id: 1, name: "Web Development" },
        { id: 2, name: "Mobile Development" },
        { id: 3, name: "UI/UX Design" },
        { id: 4, name: "Data Science" },
        { id: 5, name: "Machine Learning" },
        { id: 6, name: "Cloud Computing" },
        { id: 7, name: "Game Development" },
        { id: 8, name: "Graphic Design" },
        { id: 9, name: "Translation" },
        { id: 10, name: "Digital Marketing" },
        { id: 11, name: "Content Writing" },
        { id: 12, name: "Other" },
    ]

    const onSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            formData.append("skills", JSON.stringify(Skills));
            formData.append("jobDescription", jobDescription);
            formData.append("status", "active");

            if (File) {
                formData.append("attachment", File);
            }

            const res = await addJob(formData);
            dispatch(
                showToast({
                    type: "success",
                    title: "Job Posted",
                    message:
                        res.message || "Job posted successfully!",
                })
            );
            reset();

        } catch (error) {
            dispatch(
                showToast({
                    type: "error",
                    title: "Failed to Post Job",
                    message: error,
                })
            );

            console.error("Error posting job:", error);
        }

    };


    return (
        <>
            <div className='mb-10 relative'>
                {/* content */}

                <section className="content max-w-250 mx-auto mt-3 mb-30 relative">
                    {/* headings */}
                    <div className="headings text-center">
                        <h1 className="text-xl font-bold underline">Let's Post a New Job</h1>

                    </div>

                    {/* progess bar  */}
                    <div className="progress-bar-section mt-3 sticky top-0 z-50">
                        <div className="headings flex justify-between">
                            <h2 className="text-md font-semibold text-gray-600">
                                {nextSatge === 1 ? "Job Basics" : nextSatge === 2 ? "Job Details" : "Job Reviews"}
                            </h2>
                            <h2 className="text-md font-semibold text-gray-600">{`Step ${nextSatge} of 3`}</h2>
                        </div>

                        <div className="progress-bar mx-auto bg-gray-200 rounded-xl h-1.5 w-full mt-0.5">
                            <div className="progress bg-primary h-1.5 rounded-xl" style={{ width: `${Math.floor(nextSatge / 3 * 100)}%` }} />
                        </div>

                        <div className='flex justify-between mt-3'>
                            <p className={`${nextSatge === 1 ? "" : ""} text-secondary font-medium`}>BASICS</p>
                            <p className={`${nextSatge > 1 ? "text-secondary " : ""} text-[#0d121b] font-medium`}>DETAILS</p>
                            <p className={`${nextSatge === 3 ? "text-secondary " : ""} text-[#0d121b] font-medium`}>REVIEWS</p>
                        </div>

                    </div>

                    {/* dynamic heading below progess bar  */}

                    <div className="dynamic-heading text-center mt-4">

                        <h2 className="text-3xl font-semibold">
                            {nextSatge === 1 ? "Post a New Job" : nextSatge === 2 ? "Lets' Fill Job Details" : "Final Step: Budget & TimeLine"}
                        </h2>

                        <p className="text-lg text-gray-600 mt-2">
                            {nextSatge === 1 ? "Let's start with the essential information about your project." : nextSatge === 2 ? "Fill proper details about your project to which attract the best talent." : "Set your project's finalcial range and expected delivey timeline to attract the best talented freelancers."}
                        </p>

                    </div>


                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* first step */}

                        {nextSatge === 1 && (
                            <div className="first_step max-w-3xl mx-auto mt-8 bg-white rounded-2xl border p-8 space-y-8">

                                {/* Job Title */}
                                <div className="input">
                                    <label htmlFor="jobtitle" className="block font-semibold text-gray-900">
                                        Job Title
                                        <p className="text-sm text-gray-500 mt-1">
                                            A good title helps freelancers find your jon quickly
                                        </p>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Senior React Developer for E-commerce Site"
                                        id="jobtitle"
                                        className="mt-3 w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                        {...register("jobtitle", { required: "Job title is required" })}
                                    />

                                    {errors.jobtitle && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.jobtitle.message}
                                        </p>
                                    )}
                                </div>

                                {/* Project Category */}
                                <div className="input">
                                    <label
                                        htmlFor="projectCategory"
                                        className="block font-semibold text-gray-900"
                                    >
                                        Project Category
                                    </label>

                                    <select
                                        id="projectCategory"
                                        className="mt-3 w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                                        {...register("projectCategory", {
                                            required: "Project category is required",
                                        })}
                                    >
                                        <option value="">Select a category</option>
                                        {projectCategory.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.projectCategory && (
                                        <p className="text-red-500 text-sm">
                                            {errors.projectCategory.message}
                                        </p>
                                    )}
                                </div>

                                {/* Job Type */}
                                <div className="input">
                                    <label className="block font-semibold text-gray-900 mb-3">
                                        Job Type
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            {
                                                id: "fixed",
                                                value: "Fixed Price",
                                                title:
                                                    "Pay a set price for the entire project. best for clearly defined deliverables.",
                                                icon: <FaWallet size={20} />,
                                            },
                                            {
                                                id: "hourly",
                                                value: "Hourly Price",
                                                title:
                                                    "Pay by the hour based on tracked time. best for flexible deliverables.",
                                                icon: <FaClock size={20} />,
                                            },
                                        ].map((e) => (
                                            <label
                                                key={e.id}
                                                htmlFor={e.id}
                                                className="flex items-start gap-4 p-5 border rounded-2xl cursor-pointer hover:border-primary transition"
                                            >
                                                <div className="mt-1 text-primary">{e.icon}</div>

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{e.value}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{e.title}</p>
                                                </div>

                                                <input
                                                    type="radio"
                                                    id={e.id}
                                                    value={e.value}
                                                    {...register("BudgetType", { required: true })}
                                                    className="mt-1 w-5 h-5 accent-primary"
                                                />
                                            </label>
                                        ))}
                                        {errors.BudgetType && (
                                            <p className="text-red-500 text-sm">
                                                Please select job type
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {
                            nextSatge === 2 && (
                                <div className="stag-2 max-w-4xl mx-auto space-y-12">

                                    {/* Job Description */}
                                    <div className="bg-white rounded-2xl border p-8">
                                        <JobDescriptionEditor
                                            value={jobDescription}
                                            onChange={setJobDescription}
                                            error={error} />
                                    </div>

                                    {/* Skills Section */}
                                    <div className="bg-white rounded-2xl border p-8">
                                        <div className="headings mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                Required Skills
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Select up to 10 skills that are most important for this job.
                                            </p>
                                        </div>

                                        {/* Skill input */}
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <input
                                                    value={SkillsInput}
                                                    onChange={(e) => setSkillsInput(e.target.value)}
                                                    className="flex-1 rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none"
                                                    placeholder="Type a skills"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddSkills}
                                                    className="rounded-xl border border-primary text-primary px-5 font-medium hover:bg-primary hover:text-white transition"
                                                >
                                                    + Add
                                                </button>
                                            </div>

                                            {/* Skills tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {Skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="hover:text-red-600 transition"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            {SkillsError && (
                                                <p className="text-red-500 text-sm">
                                                    Please add at least one Skills
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Experience Level */}
                                    <div className="bg-white rounded-2xl border p-8">
                                        <div className="headings mb-6">
                                            <h2 className="text-2xl font-semibold text-gray-900">
                                                Experience Level
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Select the experience level required for this job.
                                            </p>
                                        </div>

                                        {/* Experience cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                {
                                                    id: "beginner",
                                                    value: "beginner",
                                                    title:
                                                        "Looking for someone reletively new to this field. best for entry level jobs.",
                                                    icon: <FaGraduationCap size={20} />,
                                                },
                                                {
                                                    id: "intermediate",
                                                    value: "intermediate",
                                                    title: "Looking for someone with some experience.",
                                                    icon: <FiTrendingUp size={20} />,
                                                },
                                                {
                                                    id: "expert",
                                                    value: "expert",
                                                    title: "Looking for someone with a lot of experience.",
                                                    icon: <MdOutlineWorkspacePremium size={20} />,
                                                },
                                            ].map((e) => (
                                                <label
                                                    key={e.id}
                                                    htmlFor={e.id}
                                                    className="group flex flex-col gap-4 p-6 border rounded-2xl cursor-pointer
                     hover:border-primary transition relative"
                                                >
                                                    <div className="flex items-center gap-3 text-primary">
                                                        {e.icon}
                                                        <h3 className="font-semibold text-gray-900 capitalize">
                                                            {e.value}
                                                        </h3>
                                                    </div>

                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {e.title}
                                                    </p>

                                                    <input
                                                        type="radio"
                                                        id={e.id}
                                                        value={e.value}
                                                        {...register("experiance", { required: true })}
                                                        className="absolute top-5 right-5 w-5 h-5 accent-primary"
                                                    />
                                                </label>
                                            ))}
                                            {errors.experiance && (
                                                <p className="text-red-500 text-sm">
                                                    Please select experience level
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                </div>

                            )
                        }

                        {
                            nextSatge === 3 && (

                                <div className="max-w-4xl mx-auto mt-5">

                                    {/* Heading */}
                                    <div className="space-y-3">
                                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                            Final Step: Budget & Timeline
                                        </h1>
                                        <p className="text-gray-600 text-base max-w-2xl">
                                            Set your project’s budget and expected delivery timeline to attract the best freelancers.
                                        </p>
                                    </div>

                                    {/* Form Container */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-1.5">

                                        {/* Budget Section */}
                                        <div className="p-4 border-b border-gray-200">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                Enter Budget
                                            </h2>

                                            {/* budget grid */}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Budget */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                        Budget
                                                    </label>

                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                                            $
                                                        </span>

                                                        <input
                                                            {...register("Budget", { required: "Minimum budget required" })}
                                                            type="number"
                                                            placeholder="500"
                                                            className={`w-full h-12 pl-8 pr-4 rounded-xl border bg-gray-50
                    focus:ring-2 focus:ring-primary focus:border-primary outline-none
                    ${errors.minBudget ? "border-red-500 focus:ring-red-200" : "border-gray-300"}
                `}
                                                        />
                                                    </div>

                                                    {errors.minBudget && (
                                                        <p className="mt-1.5 text-sm text-red-500">
                                                            {errors.Budget.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Timeline Section */}
                                                <div className="">
                                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                                        Project Timeline
                                                    </label>

                                                    <div className="flex gap-3">
                                                        {/* Duration Value */}
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                                {/* <FaCalendarAlt size={15} /> */}
                                                            </span>

                                                            <input
                                                                type="number"
                                                                min={1}
                                                                placeholder="Enter Date E.g 10"
                                                                {...register("Project_Duration.deliveryTime", {
                                                                    required:"Delivery time is required",
                                                                           
                                                                    min: {
                                                                        value: 1,
                                                                        message: "Duration must be at least 1",
                                                                    },
                                                                })}
                                                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                            />
                                                        </div>

                                                        {/* Duration Unit */}
                                                        <select
                                                            {...register("Project_Duration.deliveryUnit", {
                                                                required:"Delivery unit is required",
                                                            })}
                                                            className="w-36 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="days">Days</option>
                                                            <option value="weeks">Weeks</option>
                                                            <option value="months">Months</option>
                                                        </select>

                                                    </div>
                                                    {errors.Project_Duration?.deliveryTime && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.Project_Duration.deliveryTime.message}
                                                        </p>
                                                    )}

                                                    {errors.Project_Duration?.deliveryUnit && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.Project_Duration.deliveryUnit.message}
                                                        </p>
                                                    )}
                                                </div>

                                            </div>
                                        </div>


                                        {/* Attachments */}
                                        <div className="p-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                                Attachments (Optional)
                                            </h2>

                                            <div
                                                {...getRootProps()}
                                                className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl p-8 transition cursor-pointer
          ${isDragActive
                                                        ? "border-primary bg-primary/5"
                                                        : "border-gray-300 hover:border-primary hover:bg-primary/5"
                                                    }
        `}
                                            >
                                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <IoMdCloudUpload className="text-3xl" />
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    Drag & drop files here
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    or click to browse from your computer
                                                </p>
                                                <p className="mt-2 text-xs text-gray-400">
                                                    Max size 5MB · <span className='text-red-500'>Supported formats</span> PDF, DOCX.
                                                </p>

                                                <input {...getInputProps()} />
                                            </div>

                                            <div className="preview mt-3">
                                                {FilePreview && (
                                                    <div className="preview_show">
                                                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Selected Files</h3>
                                                        <div className="info flex gap-2">
                                                            <p className="name">{FilePreview.name}</p>
                                                            <p className="size">{FilePreview.size}</p>
                                                            <p className="type">{FilePreview.type}</p>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        }
                        {/* btns */}
                        <div className="btn-groups flex justify-between gap-2 mt-6 ">
                            {nextSatge > 1 && (
                                <button type="button" onClick={HandlePrevious_stage}
                                    className="w-1/4 bg-black text-white py-2 rounded cursor-pointer">
                                    Back
                                </button>
                            )}

                            {nextSatge < 3 ? (
                                <button type="button" onClick={HandleNext_stage}
                                    className="w-1/4 bg-primary text-white py-2 rounded cursor-pointer">
                                    Next
                                </button>
                            ) : (
                                <button type="submit"
                                    className="w-1/2 bg-primary text-white py-2 rounded cursor-pointer">
                                    Submit
                                </button>
                            )}
                        </div>

                    </form>

                </section>

            </div>

        </>
    )
}

export default Job_posting
