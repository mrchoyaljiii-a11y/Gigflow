import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import axios from "axios";

// importing slice action
import {
    Post_Freelancere_portfolio_info, freelancer_extra_info, freelancer_extra_profileImg
} from '../../../../redux/freelancer_extra_info/Freelancer_extra_info.js'

import { fetchUser } from "../../../../redux/getUser/User.js";

import {
    FiHome, FiUser, FiBriefcase, FiMessageSquare,
    FiSettings, FiBarChart2, FiDollarSign, FiEdit2,
    FiShare2, FiMapPin, FiClock, FiGlobe, FiCheckCircle,
    FiBook, FiAward, FiBell, FiChevronDown, FiChevronUp,
    FiImage, FiEye, FiStar, FiCode, FiChevronRight,
    FiExternalLink, FiMoreVertical, FiBookOpen, FiBookmark,
    FiTrash2, FiPlus, FiX, FiVideo, FiType, FiLink,
    FiFile, FiMusic, FiUpload
} from "react-icons/fi";

import {
    FaStar, FaLinkedin, FaGithub, FaGlobe,
    FaMapMarkerAlt, FaArrowUp, FaBolt, FaRegUser
} from "react-icons/fa";

import { MdVerified, MdOutlineCalendarMonth, MdOutlineEmail } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { BsEye, BsBriefcaseFill } from "react-icons/bs";
import { TbCoins } from "react-icons/tb";
import { LuBriefcase } from "react-icons/lu";
import { HiOutlineIdentification, HiOutlineBriefcase, HiOutlineCode } from "react-icons/hi";
import { IoIosRocket } from "react-icons/io";
import { registerUser } from "../../../../redux/Auth/Auth.js";


// portfolio modal
const AddPortfolioProject = ({
    setOpenPortfolioModel,
}) => {

    // STATES
    const [images, setImages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    // REACT HOOK FORM
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            project_title: "",
            role: "",
            project_description: "",
            skills_input: "",
        },
    });

    // WATCH VALUES
    const watchTitle = watch("project_title");
    const watchRole = watch("role");
    const watchDescription = watch(
        "project_description"
    );
    const watchSkillInput =
        watch("skills_input");

    // CHARACTER LIMITS
    const TITLE_LIMIT = 70;
    const ROLE_LIMIT = 100;
    const DESCRIPTION_LIMIT = 600;
    const SKILLS_LIMIT = 5;

    // DROPZONE
    const onDrop = useCallback(

        (acceptedFiles) => {

            const totalImages = [
                ...images,
                ...acceptedFiles,
            ];

            // MAX 5 IMAGES
            if (totalImages.length > 5) {

                alert(
                    "Maximum 5 images allowed"
                );

                return;
            }

            // CLEAN IMAGE OBJECT
            const mappedFiles =
                acceptedFiles.map(
                    (file) => ({
                        file,
                        preview:
                            URL.createObjectURL(
                                file
                            ),
                    })
                );

            setImages((prev) => [
                ...prev,
                ...mappedFiles,
            ]);
        },

        [images]
    );

    // DROPZONE CONFIG
    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,

        accept: {
            "image/*": [],
        },

        multiple: true,
        maxFiles: 5,
    });

    // CLEANUP MEMORY
    useEffect(() => {

        return () => {

            images.forEach((img) => {

                URL.revokeObjectURL(
                    img.preview
                );
            });

        };

    }, [images]);

    // REMOVE IMAGE
    const removeImage = (index) => {

        const filtered = images.filter(
            (_, i) => i !== index
        );

        setImages(filtered);
    };

    // ADD SKILL
    const handleAddSkill = (e) => {

        if (
            e.key === "Enter" ||
            e.key === ","
        ) {

            e.preventDefault();

            const value =
                watchSkillInput.trim();

            if (!value) return;

            // MAX 5 SKILLS
            if (
                skills.length >=
                SKILLS_LIMIT
            ) {

                alert(
                    "Maximum 5 skills allowed"
                );

                return;
            }

            // DUPLICATE CHECK
            if (
                skills.includes(value)
            ) {
                return;
            }

            setSkills((prev) => [
                ...prev,
                value,
            ]);

            // CLEAR INPUT
            setValue(
                "skills_input",
                ""
            );
        }
    };

    // REMOVE SKILL
    const removeSkill = (skill) => {

        const filtered = skills.filter(
            (item) => item !== skill
        );

        setSkills(filtered);
    };

    const dispatch = useDispatch();

    // SUBMIT
    const onSubmit = async (data) => {

        // IMAGE VALIDATION
        if (images.length === 0) {

            alert(
                "Please upload at least one image"
            );

            return;
        }

        // SKILLS VALIDATION
        if (skills.length === 0) {

            alert(
                "Please add at least one skill"
            );

            return;
        }

        try {

            setLoading(true);

            // FORM DATA
            const formData = new FormData();

            // TEXT FIELDS
            formData.append(
                "project_title",
                data.project_title
            );

            formData.append(
                "role_in_portfolio_project",
                data.role
            );

            formData.append(
                "portfolio_project_description",
                data.project_description
            );

            // SKILLS ARRAY
            formData.append(
                "skills_and_deliverables_of_portfolio_project",
                JSON.stringify(
                    skills
                )
            );

            // CREATED DATE
            formData.append(
                "portfolio_created_at",
                new Date().toISOString()
            );

            // IMAGES
            images.forEach((img) => {

                formData.append(
                    "Portfolio_images",
                    img.file
                );

            });

            // DEBUG
            // for (
            //     let pair of formData.entries()
            // ) {

            //     console.log(
            //         pair[0],
            //         pair[1]
            //     );

            // }

            const result = await dispatch(
                Post_Freelancere_portfolio_info(formData)
            );


            console.log(result);

            if (
                Post_Freelancere_portfolio_info.fulfilled.match(result)
            ) {

                alert(
                    "Portfolio project added successfully"
                );

                await dispatch(fetchUser()).unwrap();
                // RESET
                reset();


                setSkills([]);
                setImages([]);

                setOpenPortfolioModel(false);
            }

            else {

                alert(
                    result.payload?.message ||
                    "Failed to add portfolio"
                );
            }
        }

        catch (error) {

            console.log(error);

            alert(error?.response?.data?.message || "Something went wrong");
        }

        finally {

            setLoading(false);
            dispatch(fetchUser());
        }

    };

    return (

        <div className="min-h-screen bg-[#f7f9fc] p-10">

            <div className="bg-white rounded-[30px] shadow-sm border border-gray-200 p-10">

                {/* HEADER */}
                <div className="flex items-start justify-between">

                    <div>

                        <h1 className="text-5xl font-bold text-gray-900">
                            Add a new portfolio project
                        </h1>

                        <p className="text-gray-500 mt-3 text-lg">
                            All fields are required unless otherwise indicated.
                        </p>

                    </div>

                    {/* CLOSE */}
                    <button
                        className="w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
                        onClick={() =>
                            setOpenPortfolioModel(
                                false
                            )
                        }
                    >
                        <FiX className="text-2xl text-gray-700" />
                    </button>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="grid lg:grid-cols-2 gap-10 mt-14"
                >

                    {/* LEFT */}
                    <div className="space-y-10">

                        {/* TITLE */}
                        <div>

                            <label className="font-semibold text-gray-800 block mb-3">
                                Project title *
                            </label>

                            <input
                                type="text"
                                maxLength={
                                    TITLE_LIMIT
                                }
                                placeholder="Enter project title"
                                {...register(
                                    "project_title",
                                    {
                                        required:
                                            "Project title is required",
                                    }
                                )}
                                className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all
                                
                                ${errors.project_title
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    }`}
                            />

                            {errors.project_title && (
                                <p className="text-red-500 text-sm mt-2">
                                    {
                                        errors
                                            .project_title
                                            .message
                                    }
                                </p>
                            )}

                            <p className="text-sm text-gray-400 text-right mt-2">
                                {
                                    TITLE_LIMIT -
                                    watchTitle.length
                                }{" "}
                                characters left
                            </p>

                        </div>

                        {/* ROLE */}
                        <div>

                            <label className="font-semibold text-gray-800 block mb-3">
                                Your role
                            </label>

                            <input
                                type="text"
                                maxLength={
                                    ROLE_LIMIT
                                }
                                placeholder="Frontend Developer"
                                {...register(
                                    "role"
                                )}
                                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            />

                            <p className="text-sm text-gray-400 text-right mt-2">
                                {
                                    ROLE_LIMIT -
                                    watchRole.length
                                }{" "}
                                characters left
                            </p>

                        </div>

                        {/* DESCRIPTION */}
                        <div>

                            <label className="font-semibold text-gray-800 block mb-3">
                                Project description *
                            </label>

                            <textarea
                                rows={5}
                                maxLength={
                                    DESCRIPTION_LIMIT
                                }
                                placeholder="Describe your project..."
                                {...register(
                                    "project_description",
                                    {
                                        required:
                                            "Project description is required",
                                    }
                                )}
                                className={`w-full border rounded-2xl px-5 py-4 outline-none resize-none transition-all
                                
                                ${errors.project_description
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    }`}
                            />

                            {errors.project_description && (
                                <p className="text-red-500 text-sm mt-2">
                                    {
                                        errors
                                            .project_description
                                            .message
                                    }
                                </p>
                            )}

                            <p className="text-sm text-gray-400 text-right mt-2">
                                {
                                    DESCRIPTION_LIMIT -
                                    watchDescription.length
                                }{" "}
                                characters left
                            </p>

                        </div>

                        {/* SKILLS */}
                        <div>

                            <label className="font-semibold text-gray-800 block mb-3">
                                Skills and deliverables *
                            </label>

                            <input
                                type="text"
                                maxLength={30}
                                placeholder="Press Enter to add skills"
                                value={
                                    watchSkillInput
                                }
                                {...register(
                                    "skills_input"
                                )}
                                onKeyDown={
                                    handleAddSkill
                                }
                                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            />

                            {/* SKILLS LIST */}
                            <div className="flex flex-wrap gap-3 mt-5">

                                {skills.map(
                                    (
                                        skill,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-3"
                                        >

                                            <span>
                                                {
                                                    skill
                                                }
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSkill(
                                                        skill
                                                    )
                                                }
                                            >
                                                <FiX />
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>

                            {/* ERROR */}
                            {skills.length === 0 && (
                                <p className="text-red-500 text-sm mt-3">
                                    Add at least one skill
                                </p>
                            )}

                            <p className="text-sm text-gray-400 text-right mt-2">
                                {
                                    SKILLS_LIMIT -
                                    skills.length
                                }{" "}
                                skills left
                            </p>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div>

                        {/* DROPZONE */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-[30px] min-h-[450px] p-8 transition-all cursor-pointer flex flex-col justify-center items-center
                            
                            ${isDragActive
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-green-400 bg-[#fcfffc]"
                                }`}
                        >

                            <input
                                {...getInputProps()}
                            />

                            {/* EMPTY */}
                            {images.length ===
                                0 && (

                                    <div className="flex flex-col items-center">

                                        <div className="flex gap-5">

                                            {[
                                                <FiImage />,
                                                <FiPlus />,
                                            ].map(
                                                (
                                                    icon,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center text-2xl text-gray-600 bg-white"
                                                    >
                                                        {
                                                            icon
                                                        }
                                                    </div>
                                                )
                                            )}

                                        </div>

                                        <h3 className="text-2xl font-semibold text-gray-800 mt-8">
                                            Add content
                                        </h3>

                                        <p className="text-gray-500 mt-3 text-center max-w-md leading-7">
                                            Drag & drop project screenshots here or click to upload images.
                                        </p>

                                    </div>
                                )}

                            {/* PREVIEW */}
                            {images.length >
                                0 && (

                                    <div className="w-full">

                                        <div className="grid grid-cols-2 gap-5">

                                            {images.map(
                                                (
                                                    img,
                                                    index
                                                ) => (

                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="relative rounded-3xl overflow-hidden border border-gray-200 group"
                                                    >

                                                        <img
                                                            src={
                                                                img.preview
                                                            }
                                                            alt=""
                                                            className="w-full h-[220px] object-cover"
                                                        />

                                                        {/* REMOVE */}
                                                        <button
                                                            type="button"
                                                            onClick={(
                                                                e
                                                            ) => {

                                                                e.stopPropagation();

                                                                removeImage(
                                                                    index
                                                                );

                                                            }}
                                                            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <FiTrash2 className="text-red-500 text-xl" />
                                                        </button>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                        </div>

                        {/* IMAGE ERROR */}
                        {images.length ===
                            0 && (
                                <p className="text-red-500 text-sm mt-3">
                                    At least one image is required
                                </p>
                            )}

                    </div>

                </form>

                {/* FOOTER */}
                <div className="flex justify-end mt-14">

                    <button
                        onClick={handleSubmit(
                            onSubmit
                        )}
                        disabled={loading}
                        className={`px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-lg text-white
                        
                        ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Project"}
                    </button>

                </div>

            </div>

        </div>
    );
};

// add extra info modal
const AddExtra_info = ({ actionType, setOpenExtraInfoModel }) => {

    const dispatch = useDispatch();

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // Work Experience
            title: '', company: '', city: '', country: '',
            currentRole: false,
            startMonth: '', startYear: '',
            endMonth: '', endYear: '',
            workDescription: '',
            // Education
            school: '', degree: '', field: '',
            fromYear: '', toYear: '',
            eduDescription: '',
            // Links
            websiteLink: '', linkedInLink: '',
        }
    })

    const currentRole = watch('currentRole')
    const websiteurl = watch('websiteLink')
    const linkedinurl = watch('linkedInLink')

    const [profileImg, setprofileImg] = useState([]);
    console.log("profileImg", profileImg);

    const onDrop = useCallback(

        (acceptedFiles) => {

            // CLEAN IMAGE OBJECT
            const mappedFiles =
                acceptedFiles.map(
                    (file) => ({
                        file,
                        preview:
                            URL.createObjectURL(
                                file
                            ),
                    })
                );

            setprofileImg((prev) => [
                ...mappedFiles,
            ]);
        },

        [profileImg]
    );

    // DROPZONE CONFIG
    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,

        accept: {
            "image/*": [],
        },
        multiple: false,
        maxFiles: 1,
    });

    const onSubmit = async (data) => {

        if (actionType === 'AddLinks') {
            if (!data.websiteLink.trim() && !data.linkedInLink.trim()) {
                setError('atLeastOneLink', {
                    type: 'manual',
                    message: 'Please add at least one link before saving.',
                })
                return
            }
            const Links = {
                websiteLink: data.websiteLink,
                linkedInLink: data.linkedInLink,
            }
            console.log('Links data:', Links)


            await dispatch(freelancer_extra_info({ Links })).unwrap();
            await dispatch(fetchUser()).unwrap(); // fetch the user data again after adding links

            setOpenExtraInfoModel(false)
            return
        }

        if (actionType === 'AddWorkExperience') {
            const workExperience = {
                title: data.title,
                company: data.company,
                city: data.city,
                country: data.country,
                currentRole: data.currentRole,
                startMonth: data.startMonth,
                startYear: data.startYear,
                endMonth: data.currentRole ? null : data.endMonth,
                endYear: data.currentRole ? null : data.endYear,
                description: data.workDescription,
            }
            await dispatch(freelancer_extra_info({ workExperience })).unwrap();
            console.log('Work Experience data:', workExperience)
            await dispatch(fetchUser()).unwrap();
            setOpenExtraInfoModel(false)
            return
        }

        if (actionType === 'Addeducation') {
            const education = {
                school: data.school,
                degree: data.degree,
                field: data.field,
                fromYear: data.fromYear,
                toYear: data.toYear,
                description: data.eduDescription,
            }
            console.log('Education data:', education)
            await dispatch(freelancer_extra_info({ education })).unwrap();
            await dispatch(fetchUser()).unwrap();
            setOpenExtraInfoModel(false)
            return
        }

    }

    async function HandleProfileImg() {

        if (profileImg.length === 0) {
            alert(
                "Please upload profile image"
            );
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', profileImg[0].file);
        // console.log("formData", formData)

        // for (
        //     let pair of formData.entries()
        // ) {
        //     console.log("pair",pair[0] , pair[1]);
        // }


        await dispatch(freelancer_extra_profileImg(formData)).unwrap();
        await dispatch(fetchUser()).unwrap();
        setOpenExtraInfoModel(false)
        return

    }


    switch (actionType) {

        case "AddLinks":
            return (
                <div className="mt-4 p-4 border rounded-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold mb-3">Add Your Links</h2>
                        <button
                            className="rounded-full hover:bg-gray-100 flex items-center justify-center transition-all bg-red-400/50 cursor-pointer p-1"
                            onClick={() => setOpenExtraInfoModel(false)}
                        >
                            <FiX className="text-2xl text-gray-700" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="Website URL"
                            className={`w-full border p-2 rounded-lg mb-1 ${errors.websiteLink ? 'border-red-500' : ''}`}
                            {...register('websiteLink', {
                                onChange: () => clearErrors('atLeastOneLink')   // ← clears on type
                            })}
                        />
                        {errors.websiteLink && (
                            <p className="text-red-500 text-xs mb-2">{errors.websiteLink.message}</p>
                        )}

                        <input
                            type="text"
                            placeholder="LinkedIn URL"
                            className={`w-full border p-2 rounded-lg mb-1 ${errors.linkedInLink ? 'border-red-500' : ''}`}
                            {...register('linkedInLink', {
                                onChange: () => clearErrors('atLeastOneLink')   // ← clears on type
                            })}
                        />
                        {errors.linkedInLink && (
                            <p className="text-red-500 text-xs mb-3">{errors.linkedInLink.message}</p>
                        )}

                        {errors.atLeastOneLink && (
                            <p className="text-red-500 text-sm mb-3 font-medium">{errors.atLeastOneLink.message}</p>
                        )}

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Save Links
                        </button>
                    </form>
                </div>
            )

        case "AddWorkExperience":
            return (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Add Work Experience</h2>
                            <button
                                onClick={() => setOpenExtraInfoModel(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-6 flex flex-col gap-4">

                                {/* Title */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Ex: Software Engineer"
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.title ? 'border-red-500' : ''}`}
                                        {...register('title', { required: 'Title is required' })}
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Company */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Company <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Ex: Microsoft"
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.company ? 'border-red-500' : ''}`}
                                        {...register('company', { required: 'Company is required' })}
                                    />
                                    {errors.company && (
                                        <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">Location</label>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            placeholder="Ex: London"
                                            className="flex-1 border rounded-lg p-2"
                                            {...register('city')}
                                        />
                                        <select
                                            className="flex-1 border rounded-lg p-2"
                                            {...register('country')}
                                        >
                                            <option value="">Country</option>
                                            {['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Other'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Currently working checkbox */}
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-primary"
                                        {...register('currentRole')}
                                    />
                                    I am currently working in this role
                                </label>

                                {/* Start Date */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2 mt-1">
                                        <select
                                            className={`flex-1 border rounded-lg p-2 ${errors.startMonth ? 'border-red-500' : ''}`}
                                            {...register('startMonth', { required: 'Required' })}
                                        >
                                            <option value="">Month</option>
                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <select
                                            className={`flex-1 border rounded-lg p-2 ${errors.startYear ? 'border-red-500' : ''}`}
                                            {...register('startYear', { required: 'Required' })}
                                        >
                                            <option value="">Year</option>
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    {(errors.startMonth || errors.startYear) && (
                                        <p className="text-red-500 text-xs mt-1">Start date is required</p>
                                    )}
                                </div>

                                {/* End Date — hidden when currentRole is checked */}
                                {!currentRole && (
                                    <div className="text-left">
                                        <label className="text-sm font-medium">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2 mt-1">
                                            <select
                                                className={`flex-1 border rounded-lg p-2 ${errors.endMonth ? 'border-red-500' : ''}`}
                                                {...register('endMonth', { required: !currentRole ? 'Required' : false })}
                                            >
                                                <option value="">Month</option>
                                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <select
                                                className={`flex-1 border rounded-lg p-2 ${errors.endYear ? 'border-red-500' : ''}`}
                                                {...register('endYear', { required: !currentRole ? 'Required' : false })}
                                            >
                                                <option value="">Year</option>
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        {(errors.endMonth || errors.endYear) && (
                                            <p className="text-red-500 text-xs mt-1">End date is required</p>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        placeholder="Describe your role and responsibilities..."
                                        rows={4}
                                        className="w-full border rounded-lg p-2 mt-1"
                                        {...register('workDescription')}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 px-6 pb-6">
                                <button
                                    type="button"
                                    onClick={() => setOpenExtraInfoModel(false)}
                                    className="px-5 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )

        case "Addeducation":
            return (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Add Education History</h2>
                            <button
                                onClick={() => setOpenExtraInfoModel(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none bg-red-500/80 p-2 rounded-xl text-white"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-6 flex flex-col gap-4">

                                {/* School */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        School <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Ex: Northwestern University"
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.school ? 'border-red-500' : 'border-gray-300'}`}
                                        {...register('school', { required: 'School name is required' })}
                                    />
                                    {errors.school && (
                                        <p className="text-red-500 text-xs mt-1">{errors.school.message}</p>
                                    )}
                                </div>

                                {/* Degree */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Degree <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Ex: Bachelors"
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.degree ? 'border-red-500' : 'border-gray-300'}`}
                                        {...register('degree', { required: 'Degree is required' })}
                                    />
                                    {errors.degree && (
                                        <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
                                    )}
                                </div>

                                {/* Field of Study */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Field of Study <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        placeholder="Ex: Computer Science"
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.field ? 'border-red-500' : 'border-gray-300'}`}
                                        {...register('field', { required: 'Field of study is required' })}
                                    />
                                    {errors.field && (
                                        <p className="text-red-500 text-xs mt-1">{errors.field.message}</p>
                                    )}
                                </div>

                                {/* Dates Attended */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Dates Attended <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2 mt-1">
                                        <div className="flex-1">
                                            <select
                                                className={`w-full border rounded-lg p-2 ${errors.fromYear ? 'border-red-500' : 'border-gray-300'}`}
                                                {...register('fromYear', { required: 'Start year is required' })}
                                            >
                                                <option value="">From</option>
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            {errors.fromYear && (
                                                <p className="text-red-500 text-xs mt-1">{errors.fromYear.message}</p>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <select
                                                className={`w-full border rounded-lg p-2 ${errors.toYear ? 'border-red-500' : 'border-gray-300'}`}
                                                {...register('toYear', {
                                                    required: 'End year is required',
                                                    validate: (toYear) => {
                                                        const fromYear = watch('fromYear')
                                                        if (fromYear && toYear && Number(toYear) < Number(fromYear)) {
                                                            return 'End year cannot be before start year'
                                                        }
                                                        return true
                                                    }
                                                })}
                                            >
                                                <option value="">To (or expected graduation year)</option>
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            {errors.toYear && (
                                                <p className="text-red-500 text-xs mt-1">{errors.toYear.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="text-left">
                                    <label className="text-sm font-medium">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Describe your studies, awards, etc."
                                        rows={4}
                                        className={`w-full border rounded-lg p-2 mt-1 ${errors.eduDescription ? 'border-red-500' : 'border-gray-300'}`}
                                        {...register('eduDescription', {
                                            required: 'Description is required',
                                            minLength: { value: 20, message: 'Description must be at least 20 characters' }
                                        })}
                                    />
                                    {errors.eduDescription && (
                                        <p className="text-red-500 text-xs mt-1">{errors.eduDescription.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 px-6 pb-6">
                                <button
                                    type="button"
                                    onClick={() => setOpenExtraInfoModel(false)}
                                    className="px-5 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )

        case "ProfileImg":
            return (
                <div className="flex flex-col gap-2 items-center p-5" >
                    <button
                        onClick={() => setOpenExtraInfoModel(false)}
                        className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none bg-red-500/80 p-2 rounded-xl text-white w-20 h-10"
                    >
                        &times;
                    </button>

                    {/* DROPZONE */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-[30px] min-h-[450px] p-8 transition-all cursor-pointer flex flex-col justify-center items-center
                            ${isDragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-green-400 bg-[#fcfffc]"
                            }`}
                    >

                        <input
                            {...getInputProps()}
                        />

                        {/* EMPTY */}
                        {profileImg.length === 0 && (
                            <div className="flex flex-col items-center text-center">
                                <div className="flex gap-5 ">
                                    {[
                                        <FiImage />,
                                        <FiPlus />,
                                    ].map(
                                        (
                                            icon,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center text-2xl text-gray-600 bg-white"
                                            >
                                                {
                                                    icon
                                                }
                                            </div>
                                        )
                                    )}

                                </div>

                                <h3 className="text-2xl font-semibold text-gray-800 mt-8">
                                    Add content
                                </h3>

                                <p className="text-gray-500 mt-3 text-center max-w-md leading-7">
                                    Drag & drop Profile Image here or click to upload image.
                                </p>

                            </div>
                        )}

                        {/* PREVIEW */}
                        {profileImg.length > 0 && (
                            <div className="w-full flex items-center justify-center">
                                <div className=" border">
                                    {profileImg.map(
                                        (
                                            img,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="relative rounded-3xl overflow-hidden border border-gray-200 group"
                                            >
                                                <img
                                                    src={
                                                        img.preview
                                                    }
                                                    alt=""
                                                    className="w-full h-[220px] object-cover"
                                                />

                                                {/* REMOVE */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setprofileImg([]);
                                                    }}
                                                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <FiTrash2 className="text-red-500 text-xl" />
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                    {/* BUTTON */}
                    {<button
                        className={`px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90 ${profileImg.length === 0 && "opacity-50 cursor-not-allowed"}`}
                        disabled={profileImg.length === 0}
                        onClick={() => HandleProfileImg()}
                    >
                        Save
                    </button>}

                    {/* IMAGE ERROR */}
                    {profileImg.length ===
                        0 && (
                            <p className="text-red-500 text-sm mt-3">
                                At least one image is required
                            </p>
                        )}

                </div>
            )

        default:
            return null
    }
}


// main component
const Profile_section = () => {
    const [actionType, setActionType] = useState("");

    const [openMenuId, setOpenMenuId] = useState(null);

    const [openPortfolioModel, setOpenPortfolioModel] = useState(false);

    const [openExtraInfoModel, setOpenExtraInfoModel] = useState(false);

    const { userData, loading, error } = useSelector(
        (state) => state.userSlice
    );

    const {
        firstName = "",
        lastName = "",
        professionalTitle = "",
        country = "",
        state = "",
        email = "",
        experienceLevel = "",
        freelanerSkills = [],
        languages = [],
        Links = [],
        ProfessionalSummary = "",
        profileImage = {},
        rate = "",
        hourlyRate = "",
        workExperience = [],
        education = [],
        createdAt,
        userName = "",
        professionalCategory = "",
        portfolioProjects = [],
    } = userData || {};

    console.log("userData", userData);


    const displayRate = hourlyRate ?? rate

    const profileImageUrl = profileImage?.url || "./avtar_img.webp";
    console.log("profileImageUrl", profileImageUrl);
    const newDate = new Date;

    const joinedDate = createdAt ? new Date(createdAt) : new Date();

    const currentYear = joinedDate.getFullYear();

    const initials =
        `${firstName?.[0] || ""}${lastName?.[0] || ""}`;


    const languagesList = (languages || [])
        .map((l) => l.languageName)
        .join(", ");

    const [showFullSummary, setShowFullSummary] = useState(false)

    const SUMMARY_LIMIT = 300  // chars shown when collapsed
    const summaryIsTruncatable = ProfessionalSummary && ProfessionalSummary.length > SUMMARY_LIMIT
    const visibleSummary = showFullSummary || !summaryIsTruncatable
        ? ProfessionalSummary
        : ProfessionalSummary.slice(0, SUMMARY_LIMIT).trimEnd() + '...'

    const stats = [
        {
            id: 1,
            title: "Total Earnings",
            value: "₹45,000",
            growth: "+12.5%",
            icon: <FiDollarSign size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            id: 2,
            title: "Jobs Completed",
            value: "32",
            growth: "+14.3%",
            icon: <FiImage size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            id: 3,
            title: "Client Rating",
            value: "4.8",
            growth: "",
            icon: <FiStar size={15} />,
            bg: "bg-orange-50",
            color: "text-orange-500",
        },
        {
            id: 4,
            title: "Total Projects",
            value: "18",
            growth: "+8.1%",
            icon: <FiBriefcase size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
        {
            id: 5,
            title: "Response Rate",
            value: "95%",
            growth: "+5%",
            icon: <FiEye size={15} />,
            bg: "bg-blue-50",
            color: "text-blue-600",
        },
    ];


    const workHistory = [
        {
            id: 1,
            title: "E-commerce Website Development",
            company: "Tech Solutions Inc.",
            status: "Completed",
            amount: "₹25,000",
            date: "May 15, 2024",
            logo:
                "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
        },
        {
            id: 2,
            title: "Dashboard Design & Development",
            company: "Creative Agency",
            status: "Completed",
            amount: "₹18,000",
            date: "May 02, 2024",
            logo:
                "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        },
        {
            id: 3,
            title: "API Integration & Bug Fixing",
            company: "Web Solutions",
            status: "Completed",
            amount: "₹8,000",
            date: "Apr 18, 2024",
            logo:
                "https://cdn-icons-png.flaticon.com/512/2721/2721297.png",
        },
        {
            id: 4,
            title: "Mobile App Backend Development",
            company: "StartupXYZ",
            status: "Ongoing",
            amount: "₹22,000",
            date: "Apr 30, 2024",
            logo:
                "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
        },
    ];

    /* Loading */
    if (loading) {
        return <div className="text-center py-20">Loading profile...</div>;
    }

    /* Error */
    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                {error}
            </div>
        );
    }

    /* No Data */
    if (!userData) {
        return (
            <div className="text-center py-20 text-gray-500">
                No user data found
            </div>
        );
    }
    return (
        <>
            {
                openPortfolioModel ? (<AddPortfolioProject setOpenPortfolioModel={setOpenPortfolioModel} />) : (
                    openExtraInfoModel ? (<AddExtra_info actionType={actionType} setOpenExtraInfoModel={setOpenExtraInfoModel} />) : (

                        <div className="profile_section_main">
                            {/* Hero Section */}
                            <div
                                className="hero_section bg-cover bg-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1a56db 0%, #1e40af 50%, #1d4ed8 100%)",
                                }}
                            >

                                {/* Background Pattern */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(circle, white 1px, transparent 1px)",
                                        backgroundSize: "24px 24px",
                                    }}
                                />

                                {/* Gradient Glow */}
                                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-400/20 to-transparent pointer-events-none" />

                                {/* Content */}
                                <div className="relative flex flex-col md:flex-row gap-5 px-4 sm:px-6 py-6">

                                    {/* Profile Image */}
                                    <div className="relative shrink-0 mx-auto md:mx-0">

                                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 overflow-hidden bg-blue-400 shadow-xl">

                                            {profileImageUrl ? (
                                                <img
                                                    src={profileImageUrl}
                                                    alt={`${firstName} ${lastName}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl">
                                                    {initials}
                                                </div>
                                            )}
                                        </div>


                                        <button className="w-8 h-8 absolute bottom-0 right-2 lg:right-4 lg:top-30 cursor-pointer bg-white text-blue-500 rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors content-center"
                                            onClick={() => {
                                                setActionType("ProfileImg");
                                                setOpenExtraInfoModel(true);
                                            }}>
                                            <FiUpload />
                                        </button>


                                        {/* Online Indicator */}
                                        <span className="absolute top-4 right-2 lg:right-4 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                                    </div>

                                    {/* Info */}
                                    <div className="info w-full rounded-lg p-2 sm:p-4 flex flex-col gap-4">

                                        {/* Header */}
                                        <div className="info_head flex flex-col lg:flex-row lg:items-start justify-between gap-4 w-full">

                                            {/* User Name */}
                                            <div className="flex items-center gap-2 flex-wrap">

                                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold capitalize">
                                                    {firstName} {lastName}
                                                </h1>

                                                <MdVerified
                                                    className="text-cyan-300 shrink-0"
                                                    size={24}
                                                />
                                            </div>


                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-3 w-full lg:w-auto">

                                                {/* Top Buttons */}
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                                                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-sm border border-white cursor-pointer hover:bg-blue-700">

                                                        <FiEdit2 size={18} />

                                                        <span>Edit Profile</span>
                                                    </button>

                                                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-white/90 border border-white/30 text-blue-700 text-sm sm:text-base font-bold rounded-xl transition-all backdrop-blur-sm cursor-pointer shadow-sm">

                                                        <FiShare2 size={18} />

                                                        <span>Share Profile</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* availability + location etc.. */}
                                        <div className="flex flex-col gap-2.5">
                                            {/* Availability */}
                                            <p className="bg-green-500 font-semibold text-[1rem] rounded-2xl text-white px-2 py-0.5 contain-content w-fit"> Available for work</p>

                                            {/* other */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-blue-100 text-[12px] font-medium">
                                                <span className="flex items-center gap-1.5 text-lg"><FaMapMarkerAlt size={18} className="text-blue-200" />{state}, {country}</span>
                                                <span className="text-blue-300/50">•</span>
                                                <span className="flex items-center gap-1.5 text-lg"><MdOutlineCalendarMonth size={18} className="text-blue-200" />{`Member since ${currentYear}`}</span>
                                                <span className="text-blue-300/50">•</span>
                                                <span className="flex items-center gap-1.5 text-lg"><HiOutlineIdentification size={18} className="text-blue-200" />{userName}</span>
                                            </div>

                                        </div>


                                        {/* Title */}
                                        <p className="text-white font-bold text-2xl mb-3 capitalize">{professionalTitle}</p>

                                        {/* Quick pills */}
                                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-blue-100 text-[12px] font-semibold">
                                            <span className="flex items-center gap-1.5 text-lg"><FiClock size={15} className="text-blue-200 text- " />{experienceLevel}</span>
                                            <span className="flex items-center gap-1.5 text-lg"><HiOutlineCode size={17} className="text-blue-200 text-" />{professionalCategory}</span>
                                            {/* <span className="flex items-center gap-1.5 text-lg"><FiGlobe size={17} className="text-blue-200 text-" />{languagesList}</span> */}
                                            <span className="flex items-center gap-1.5 text-lg">
                                                <FaStar size={15} className="text-amber-300" />
                                                4.8 · Top Rated
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="">
                                <div className="bg-slate-50 rounded-2xl  flex flex-col gap-2.5 items-center justify-center pb-5">

                                    {/* states */}
                                    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                                            {stats.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className={`relative flex items-center gap-4 px-6 py-6 hover:bg-slate-50 transition-all duration-300
                                                  ${index !== stats.length - 1
                                                            ? "border-b lg:border-b-0 lg:border-r border-slate-200"
                                                            : ""
                                                        }`}
                                                >
                                                    {/* icon */}
                                                    <div
                                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}
                                                    >
                                                        {item.icon}
                                                    </div>

                                                    {/* content */}
                                                    <div>
                                                        <p className="text-sm text-slate-500 font-medium">
                                                            {item.title}
                                                        </p>

                                                        <h2 className="text-lg font-bold text-slate-800 mt-1">
                                                            {item.value}
                                                        </h2>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Professional Summary */}
                                    <section className="bg-white rounded-xl border border-[#e2e8f0] p-8 w-full">
                                        <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2 ">
                                            <span className="bg-blue-50 w-10 h-10 text-center rounded-xl flex items-center justify-center"> <FaRegUser className="text-primary" /></span>  Professional Summary
                                        </h3>
                                        <div className="text-[#475569] leading-relaxed whitespace-pre-line">
                                            {visibleSummary}
                                        </div>
                                        {summaryIsTruncatable && (
                                            <button
                                                type="button"
                                                onClick={() => setShowFullSummary(prev => !prev)}
                                                className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline focus:outline-none"
                                            >
                                                {showFullSummary ? (
                                                    <>Show less <span className="text-base leading-none">&#8593;</span></>
                                                ) : (
                                                    <>Show more <span className="text-base leading-none">&#8595;</span></>
                                                )}
                                            </button>
                                        )}
                                    </section>

                                    {/* skills and languages */}
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full ">

                                        {/* SKILLS CARD */}
                                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ">

                                            {/* heading */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FiCode size={18} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Skills
                                                </h2>
                                            </div>

                                            {/* skills */}
                                            <div className="flex flex-wrap gap-3">
                                                {(freelanerSkills || []).map((skill, index) => (
                                                    <div
                                                        key={index}
                                                        className=" flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200  bg-blue-50  hover:bg-blue-100  hover:scale-105  transition-all  cursor-pointer"
                                                    >
                                                        <FiChevronRight
                                                            className="text-blue-600"
                                                            size={14}
                                                        />

                                                        <span className="text-sm font-semibold text-blue-700 capitalize">
                                                            {skill}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* LANGUAGES CARD */}
                                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">

                                            {/* heading */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FiGlobe size={18} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Languages
                                                </h2>
                                            </div>

                                            {/* language list */}
                                            <div className="space-y-5">

                                                {(languages || []).map((lang, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4"
                                                    >

                                                        <div>
                                                            <h3 className="text-lg font-semibold text-slate-800">
                                                                {lang.languageName}
                                                            </h3>

                                                            <p className="text-sm text-slate-500 font-medium">
                                                                {lang.proficiency}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>

                                        </div>

                                        {/* Links Card*/}
                                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">

                                            {/* heading */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FiExternalLink size={18} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Links
                                                </h2>
                                            </div>

                                            {/* Link list */}
                                            <div className="space-y-5">

                                                {Links.length === 0 ? (
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-slate-800">
                                                                No links added.
                                                            </h3>
                                                            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                                                onClick={() => {
                                                                    setActionType("AddLinks")
                                                                    setOpenExtraInfoModel(true)
                                                                }}>
                                                                <FiPlus size={18} />
                                                                Add Links
                                                            </button>
                                                        </div>
                                                    </div>
                                                )

                                                    : (Links || []).map((link, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-4"
                                                        >
                                                            {/* content */}
                                                            <div className="flex gap-0.5 items-center">
                                                                <h3 className="text-lg font-semibold text-slate-800">
                                                                    {Object.keys(link).map((key) => (
                                                                        <div key={key}>
                                                                            <h3 className="text-lg font-semibold text-slate-800">
                                                                                {key}
                                                                            </h3>

                                                                            <a
                                                                                href={link[key]}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium break-all"
                                                                            >
                                                                                {link[key]}
                                                                            </a>

                                                                        </div>
                                                                    ))}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    ))}

                                            </div>
                                        </div>
                                    </div>

                                    {/* PORTFOLIO section*/}
                                    <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm w-full">
                                        {/* HEADER */}
                                        <div className="flex items-center justify-between mb-7">

                                            {/* left */}
                                            <div className="flex items-center gap-3">

                                                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <HiOutlineBriefcase size={22} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Portfolio Highlights
                                                </h2>
                                            </div>

                                            {/* button */}
                                            <button
                                                className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-all"
                                            >
                                                View All Projects
                                                <span className="text-lg">→</span>
                                            </button>
                                        </div>

                                        {/* PROJECT GRID */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                                            {
                                                portfolioProjects.length > 0 ? (
                                                    portfolioProjects.map((project) => (
                                                        <div
                                                            key={project._id}
                                                            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                                        >

                                                            {/* IMAGE */}
                                                            <div className="relative overflow-hidden h-44">

                                                                <img
                                                                    src={project.Portfolio_images[0]?.secure_url || "/project-placeholder.png"}
                                                                    alt={project.project_title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                                                />

                                                                {/* dark overlay */}
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                                                {/* Edit Button */}
                                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">

                                                                    <button
                                                                        onClick={() =>
                                                                            setOpenMenuId(
                                                                                openMenuId === project._id ? null : project._id
                                                                            )
                                                                        }
                                                                        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-all"
                                                                    >
                                                                        <FiEdit2 className="text-primary" size={18} />
                                                                    </button>

                                                                    {/* Dropdown Menu */}
                                                                    {openMenuId === project._id && (
                                                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">

                                                                            {/* Edit */}
                                                                            <button
                                                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                                                                onClick={() => {
                                                                                    console.log("Edit", project._id);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                            >
                                                                                <FiEdit2 size={16} />
                                                                                Edit
                                                                            </button>

                                                                            {/* Delete */}
                                                                            <button
                                                                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                                                                                onClick={() => {
                                                                                    console.log("Delete", project._id);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                            >
                                                                                <FiMoreVertical size={16} />
                                                                                Delete
                                                                            </button>

                                                                        </div>
                                                                    )}
                                                                    <div>

                                                                    </div>


                                                                </div>

                                                            </div>


                                                            {/* CONTENT */}
                                                            <div className="p-4">

                                                                {/* title */}
                                                                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">
                                                                    {project.project_title}
                                                                </h3>

                                                                {/* tech */}
                                                                <p className="text-sm text-slate-500 font-medium mb-4">
                                                                    {project.tech}
                                                                </p>

                                                                {/* footer */}
                                                                <div className="flex items-center justify-between">

                                                                    {/* stats */}
                                                                    <div className="flex items-center gap-4 text-sm text-slate-600">

                                                                        {/* rating */}
                                                                        <div className="flex items-center gap-1">
                                                                            <FiStar className="text-blue-500 fill-blue-500" />
                                                                            <span className="font-semibold">
                                                                                {project.rating}
                                                                            </span>
                                                                        </div>

                                                                        {/* views */}
                                                                        <div className="flex items-center gap-1">
                                                                            <BsEye className="text-slate-500" />
                                                                            <span className="font-semibold">
                                                                                {project.views}
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full text-center py-10 text-slate-500 font-medium">
                                                        No portfolio projects found
                                                        <div>
                                                            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                                                onClick={() => setOpenPortfolioModel(true)}>
                                                                <FiPlus size={18} />
                                                                Add Project
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {portfolioProjects.length > 0 && portfolioProjects.length < 4 && (
                                                <div className="flex items-center justify-center">
                                                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                                        onClick={() => setOpenPortfolioModel(true)}>
                                                        <FiPlus size={18} />
                                                        Add New Project
                                                    </button>
                                                </div>)}

                                        </div>

                                    </section>

                                    {/* work history */}
                                    <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full">

                                        {/* HEADER */}
                                        <div className="flex items-center justify-between mb-7">

                                            {/* left */}
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <FiBriefcase size={18} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Work History
                                                </h2>
                                            </div>

                                            {/* button */}
                                            <button
                                                className=" flex items-center gap-2  text-blue-600 font-semibold  hover:text-blue-700  transition-all "
                                            >
                                                View All
                                                <span className="text-lg">→</span>
                                            </button>
                                        </div>

                                        {/* LIST */}
                                        <div className="space-y-2 ">

                                            {workHistory.map((item) => (

                                                <div
                                                    key={item.id}
                                                    className="group grid grid-cols-1 lg:grid-cols-[1.8fr_0.8fr_1fr_auto] items-center gap-5 p-4 rounded-2xl border border-slate-200 hover:shadow-md  hover:border-blue-200 transition-all duration-300"
                                                >

                                                    {/* LEFT */}
                                                    <div className="flex items-center gap-4 min-w-0">

                                                        {/* logo */}
                                                        <div
                                                            className=" w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 "
                                                        >
                                                            <img
                                                                src={item.logo}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* info */}
                                                        <div>

                                                            <h3 className="text-sm font-bold text-slate-800">
                                                                {item.title}
                                                            </h3>

                                                            <p className="text-sm text-slate-500 font-medium">
                                                                {item.company}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* CENTER */}
                                                    <div className="flex lg:justify-center">

                                                        <span
                                                            className={`px-4 py-1.5 rounded-xl text-sm font-semibold ${item.status === "Completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-blue-100 text-blue-700"
                                                                }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    {/* RIGHT */}
                                                    <div className="flex items-center justify-between lg:justify-end gap-6">

                                                        {/* amount/date */}
                                                        <div className="text-left lg:text-right">

                                                            <h4 className="text-lg font-bold text-slate-800">
                                                                {item.amount}
                                                            </h4>

                                                            <p className="text-sm text-slate-500 font-medium">
                                                                {item.date}
                                                            </p>
                                                        </div>

                                                        {/* menu */}
                                                        <button
                                                            className="w-10 h-10rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-al "
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Employment History */}
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all w-full">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FiBriefcase size={19} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Employment History
                                                </h2>
                                            </div>
                                        </div>

                                        {
                                            workExperience.length === 0 ? (

                                                <div className="text-center text-slate-500">
                                                    <p className="text-sm font-semibold text-gray-500 ">No work experience added</p>

                                                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                                        onClick={() => {
                                                            setActionType("AddWorkExperience")
                                                            setOpenExtraInfoModel(true)
                                                        }}>
                                                        <FiPlus size={18} />
                                                        Add Work Experience
                                                    </button>
                                                </div>

                                            ) : (
                                                (
                                                    <div className="space-y-5">

                                                        {/* Work Experience List */}

                                                        {workExperience?.map((job, index) => (

                                                            <div
                                                                key={index}
                                                                className="grid grid-cols-1 lg:grid-cols-[70px_1fr_auto] gap-4 items-start border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition-all"
                                                            >

                                                                {/* Company Logo */}
                                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                                    {job.company?.charAt(0)}
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex flex-col gap-2">

                                                                    {/* Title */}
                                                                    <h3 className="text-lg font-bold text-slate-800 capitalize">
                                                                        {job.title}
                                                                    </h3>

                                                                    {/* Company */}
                                                                    <p className="text-slate-600 font-semibold">
                                                                        {job.company}
                                                                    </p>

                                                                    {/* Duration */}
                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

                                                                        <span className="flex items-center gap-1">
                                                                            <MdOutlineCalendarMonth size={15} />
                                                                            {job.startMonth} {job.startYear}
                                                                        </span>

                                                                        <span>—</span>

                                                                        <span>
                                                                            {job.currentRole
                                                                                ? "Present"
                                                                                : `${job.endMonth} ${job.endYear}`}
                                                                        </span>

                                                                    </div>

                                                                    {/* Location */}
                                                                    <div className="flex items-center gap-1 text-sm text-slate-500">
                                                                        <FaMapMarkerAlt size={13} />
                                                                        {job.city}, {job.country}
                                                                    </div>

                                                                    {/* Description */}
                                                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                                                        {job.description?.slice(0, 140)}....
                                                                    </p>

                                                                </div>

                                                                {/* Status */}
                                                                <div className="flex lg:justify-end">

                                                                    <span
                                                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold w-fit ${job.currentRole
                                                                            ? "bg-blue-100 text-blue-700"
                                                                            : "bg-green-100 text-green-700"
                                                                            }`}
                                                                    >
                                                                        {job.currentRole ? "Current Role" : "Completed"}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        ))}

                                                    </div>
                                                )
                                            )
                                        }
                                    </div>

                                    {/* Education History */}
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all w-full">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FiBook size={18} />
                                                </div>

                                                <h2 className="text-xl font-bold text-slate-800">
                                                    Education
                                                </h2>
                                            </div>


                                        </div>

                                        {
                                            education.length === 0 ? (
                                                <div className="text-center text-slate-500">
                                                    <p className="text-sm font-semibold text-gray-500 ">No work experience added</p>

                                                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                                        onClick={() => {
                                                            setActionType("Addeducation")
                                                            setOpenExtraInfoModel(true)
                                                        }}>
                                                        <FiPlus size={18} />
                                                        Add Education
                                                    </button>
                                                </div>

                                            ) : (
                                                <div className="space-y-5">

                                                    {/* Education List */}

                                                    {education?.map((edu, index) => (

                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-1 lg:grid-cols-[70px_1fr_auto] gap-4 items-start border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition-all"
                                                        >

                                                            {/* School Logo */}
                                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                                <FiBookOpen size={24} />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex flex-col gap-2">

                                                                {/* Degree */}
                                                                <h3 className="text-lg font-bold text-slate-800 capitalize">
                                                                    {edu.degree}
                                                                </h3>

                                                                {/* School */}
                                                                <p className="text-slate-600 font-semibold capitalize">
                                                                    {edu.school}
                                                                </p>

                                                                {/* Field */}
                                                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                                    <FiAward size={15} />
                                                                    <span className="capitalize">{edu.field}</span>
                                                                </div>

                                                                {/* Duration */}
                                                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">

                                                                    <span className="flex items-center gap-1">
                                                                        <MdOutlineCalendarMonth size={15} />
                                                                        {edu.fromYear}
                                                                    </span>

                                                                    <span>—</span>

                                                                    <span>
                                                                        {edu.toYear}
                                                                    </span>

                                                                </div>

                                                                {/* Description */}
                                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                                    {edu.description}
                                                                </p>

                                                            </div>

                                                            {/* Status */}
                                                            <div className="flex lg:justify-end">

                                                                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 w-fit">
                                                                    Completed
                                                                </span>

                                                            </div>

                                                        </div>

                                                    ))}

                                                </div>
                                            )
                                        }
                                    </div>

                                </div>
                            </div>

                        </div >
                    )
                )
            }
        </>
    )
}

export default Profile_section