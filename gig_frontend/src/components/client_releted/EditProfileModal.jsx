import React, { useEffect, useState, useCallback } from "react";
import { FiX, FiPlus, FiImage, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateClientProfil_Info } from '../../hooks/Client_releted/useUpdateClientProfil_Info';
import { useDropzone } from "react-dropzone";

const LanguageModel = ({ language, index, handleChange, handleRemove }) => {
    return (
        <div className="mt-4 border rounded-xl p-4 bg-gray-50">

            {/* heading */}
            <div className="flex justify-between mb-3">
                <p className="font-medium">Language <span className='text-red-500 text-sm'>(Note English is included by default)</span></p>
                <p className="font-medium">Proficiency</p>
            </div>

            <div className='flex gap-4 items-center'>

                {/* language input */}
                <input
                    type="text"
                    value={language.languageName}
                    onChange={(e) =>
                        handleChange(index, "languageName", e.target.value)
                    }
                    className={`border rounded-lg p-2 w-1/2 
                    ${language.languageName === "English"
                            ? "bg-gray-200 cursor-not-allowed"
                            : ""
                        }`}
                    disabled={language.languageName === "English"}
                />

                {/* proficiency */}
                <select
                    className='border rounded-lg p-2 w-1/2'
                    value={language.proficiency}
                    onChange={(e) =>
                        handleChange(index, "proficiency", e.target.value)
                    }
                >
                    <option value="Basic">Basic</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                </select>

                {/* remove button */}
                {language.languageName !== "English" && (
                    <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}

const EditProfileModal = ({
    isOpen,
    section,
    clientData,
    onClose,
    refetch,
}) => {

    const {
        mutateAsync,
        isLoading,
        error,
        data: responseData,
    } = useUpdateClientProfil_Info();

    const [loading, setLoading] = useState(false);
    const [profileImg, setprofileImg] = useState([]);
    const [imgLoading, setImgLoading] = useState(false);

    // console.log("profileImg", profileImg);

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

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors }
    } = useForm(
        {
            defaultValues: {
                clientSummary: clientData?.clientSummary || "",
                firstName: clientData?.firstName || "",
                lastName: clientData?.lastName || "",
                country: clientData?.country || "",
                state: clientData?.state || "",
                email: clientData?.email || "",
                name: clientData?.company?.name || "", // company name
                industryType: clientData?.company?.industryType || "",
                companySize: clientData?.company?.companySize || "",
                clientRole: clientData?.clientRole || "",
                companySummary: clientData?.company?.companySummary || "",
                // links
                websiteLink: clientData?.Links?.websiteLink || "",
                linkedInLink: clientData?.Links?.linkedInLink || "",
                // skills
                hiringCategories: clientData?.hiringCategories.join(",") || "",
                // phone number
                PhoneNo: {
                    countryCode: clientData?.phoneNo?.countryCode || "+91",
                    number: clientData?.phoneNo?.number || "",
                },
            }
        }
    )

    const [languages, setLanguages] = useState([
        {
            languageName: "English",
            proficiency: "Fluent"
        }
    ])

    // add new language
    const handleAddLanguage = () => {
        setLanguages((prev) => [
            ...prev,
            {
                languageName: "",
                proficiency: "Basic"
            }
        ])
    }

    // update language
    const handleLanguageChange = (index, field, value) => {

        const updatedLanguages = [...languages]

        updatedLanguages[index][field] = value

        setLanguages(updatedLanguages)
    }

    const handleRemoveLanguage = (index) => {

        const updatedLanguages = languages.filter(
            (_, i) => i !== index
        )

        setLanguages(updatedLanguages)
    }


    if (!isOpen) return null;


    const titles = {
        about: "Edit About Me",
        personal: "Edit Personal Information",
        company: "Edit Company Information",
        links: "Manage Links",
        skills: "Edit Hiring Categories",
        profileImage: "Update Profile Image",
    };

    const industryTypes = [
        "Information Technology",
        "Software & SaaS",
        "E-commerce",
        "Finance & Banking",
        "Healthcare",
        "Education",
        "Marketing & Advertising",
        "Media & Entertainment",
        "Real Estate",
        "Manufacturing",
        "Construction",
        "Travel & Hospitality",
        "Food & Beverage",
        "Automotive",
        "Telecommunications",
        "Consulting",
        "Human Resources",
        "Legal Services",
        "Retail",
        "Logistics & Supply Chain",
        "Agriculture",
        "Energy & Utilities",
        "Non-Profit",
        "Government",
        "Other",
    ];

    async function HandleProfileImg() {
        try {
            
            setImgLoading(true);
            console.log("loading 1", loading)

            if (profileImg.length === 0) {
                alert(
                    "Please upload profile image"
                );
                return;
            }


            const payload = new FormData();
            payload.append('profileImage', profileImg[0].file);

            // console.log("payload", payload)

            // for (
            //     let pair of payload.entries()
            // ) {
            //     console.log("pair", pair[0], pair[1]);
            // }

            const response = await mutateAsync(payload);

            console.log("Response:", response.message);

            if (response.success) {
                onClose();
            }

        } catch (error) {
            console.log(error);
        } finally {
             console.log("loading 2", loading)
            setImgLoading(false);
        }

    }


    const onSubmit = async (data) => {
        try {
            setLoading(true);

            let payload = {};

            switch (section) {
                case "about":
                    payload = {
                        clientSummary: data.clientSummary,
                    };
                    break;

                case "personal":
                    payload = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        country: data.country,
                        state: data.state,
                        email: data.email,
                        phoneNo: data.phoneNo,
                        languages,
                    };
                    break;

                case "company":
                    payload = {
                        company: {
                            name: data.name,
                            industryType: data.industryType,
                            companySize: data.companySize,
                            companySummary: data.companySummary,
                        },
                        clientRole: data.clientRole,
                    };
                    break;

                case "links":
                    payload = {
                        Links: {
                            websiteLink: data.websiteLink,
                            linkedInLink: data.linkedInLink,
                        }
                    };
                    break;

                case "skills":
                    payload = {
                        hiringCategories: data.hiringCategories ? data.hiringCategories.split(",") : [],
                    };
                    break;

                default:
                    return;
            }

            console.log("Payload:", payload);

            const response = await mutateAsync(payload);
            console.log("Response:", response.success);

            if (response.success) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 ">

            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-bold text-gray-800">
                        {titles[section]}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="p-6 space-y-5">


                        {/* About */}
                        {section === "about" && (
                            <div className="mt-6 text-left">
                                <label className="block mb-2">
                                    About You <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    placeholder="Tell freelancers about yourself, your role, and how you like to work..."
                                    {...register("clientSummary", {
                                        required: "Please tell freelancers about yourself",
                                        minLength: {
                                            value: 50,
                                            message: "At least 50 characters required",
                                        },
                                        maxLength: {
                                            value: 500,
                                            message: "Maximum 500 characters",
                                        },
                                    })}
                                    className="w-full border rounded-lg p-2"
                                    rows={8}
                                />

                                {errors.clientSummary && (
                                    <p className="text-red-500 text-sm">
                                        {errors.clientSummary.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Personal */}
                        {section === "personal" && (
                            <>

                                <div className="space-y-4 overflow-y-auto max-h-[400px]
                            ">
                                    {/* first and last name */}
                                    <div className="group flex gap-4">
                                        <div className="mt-6 text-left w-1/2">
                                            <label className="font-medium"
                                                htmlFor="first_name">
                                                First Name <span className="text-red-500 ">*</span>
                                            </label>
                                            <input
                                                placeholder="First name"
                                                id='first_name'
                                                {...register("firstName", { required: "First name is required" })}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                                        </div>

                                        <div className="mt-6 text-left w-1/2">
                                            <label className="font-medium"
                                                htmlFor="last_name">
                                                Last Name <span className="text-red-500 ">*</span>
                                            </label>
                                            <input
                                                placeholder="Last name"
                                                id='last_name'
                                                {...register("lastName", { required: "Last name is required" })}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                                        </div>
                                    </div>

                                    {/* country + state */}
                                    <div className="flex gap-4 mt-6">
                                        <div className="w-1/2 text-left">
                                            <label className="font-medium"
                                                htmlFor="country">
                                                Country <span className="text-red-500 ">*</span>
                                            </label>
                                            <input
                                                placeholder="Country"
                                                id='country'
                                                {...register("country", { required: "Country is required" })}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                                        </div>

                                        <div className="w-1/2 text-left">
                                            <label className="font-medium"
                                                htmlFor="state">
                                                State <span className="text-red-500 ">*</span>
                                            </label>
                                            <input
                                                placeholder="State"
                                                id='state'
                                                {...register("state", { required: "State is required" })}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                                        </div>
                                    </div>

                                    {/* email and phone no */}
                                    <div className="flex gap-4 mt-6">

                                        <div className="w-1/2 text-left">
                                            <label className="font-medium"
                                                htmlFor="email">
                                                Email <span className="text-red-500 ">*</span>
                                            </label>
                                            <input
                                                placeholder="Email"
                                                id='email'

                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^\S+@\S+\.\S+$/,
                                                        message: "Please enter a valid email",
                                                    },
                                                })}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                        </div>

                                        <div className="w-1/2 text-left">
                                            <label
                                                className="font-medium"
                                                htmlFor="phoneNumber"
                                            >
                                                Phone Number
                                                <span className="text-red-500">*</span>
                                            </label>

                                            <div className="flex gap-2 mt-1">

                                                {/* Country Code */}
                                                <select
                                                    {...register("phoneNo.countryCode", {
                                                        required: "Country code is required",
                                                    })}
                                                    className="w-28 border rounded-lg p-2 bg-white"
                                                >
                                                    <option value="+91">🇮🇳 +91</option>
                                                    <option value="+1">🇺🇸 +1</option>
                                                    <option value="+44">🇬🇧 +44</option>
                                                    <option value="+61">🇦🇺 +61</option>
                                                    <option value="+971">🇦🇪 +971</option>
                                                    <option value="+81">🇯🇵 +81</option>
                                                    <option value="+49">🇩🇪 +49</option>
                                                </select>

                                                {/* Phone Number */}
                                                <input
                                                    type="tel"
                                                    id="phoneNumber"
                                                    placeholder="9876543210"
                                                    {...register("phoneNo.number", {
                                                        required: "Phone number is required",
                                                        pattern: {
                                                            value: /^[0-9]{10,15}$/,
                                                            message: "Phone number must be 10-15 digits",
                                                        },
                                                    })}
                                                    className="flex-1 border rounded-lg p-2"
                                                />
                                            </div>

                                            {errors.phoneNo?.countryCode && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.phoneNo.countryCode.message}
                                                </p>
                                            )}

                                            {errors.phoneNo?.number && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.phoneNo.number.message}
                                                </p>
                                            )}
                                        </div>

                                    </div>


                                    {/* languages */}

                                    <div className="mt-6 border w-full p-6 rounded-lg">

                                        {/* render all language models */}
                                        {
                                            languages.map((language, index) => (
                                                <LanguageModel
                                                    key={index}
                                                    language={language}
                                                    index={index}
                                                    handleChange={handleLanguageChange}
                                                    handleRemove={handleRemoveLanguage}
                                                />
                                            ))
                                        }

                                        {/* add language button */}
                                        <button
                                            type="button"
                                            onClick={handleAddLanguage}
                                            className="mt-5 border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
                                        >
                                            + Add Language
                                        </button>

                                        {/* preview */}
                                        <div className="mt-6">
                                            <p className="font-semibold mb-2">Saved Languages:</p>

                                            {
                                                languages.map((lang, index) => (
                                                    <div key={index} className="text-sm text-gray-700">
                                                        {lang.languageName} - {lang.proficiency}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Company */}
                        {section === "company" && (
                            <>
                                <div className="space-y-4 overflow-y-auto max-h-[400px]">
                                    {/* Company name*/}
                                    <div className="text-left mt-6">
                                        <label htmlFor="Companyname">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            id="Companyname"
                                            placeholder="Microsoft, Google, Amazon..."
                                            {...register("name", {
                                                required: "Company name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Company name must be at least 2 characters",
                                                },
                                            })}
                                            className="w-full border rounded-lg p-2"
                                        />
                                        {
                                            errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>
                                        }
                                    </div>

                                    {/* industry type */}
                                    <div className="text-left mt-6">
                                        <label htmlFor="industryType">
                                            Industry Type <span className="text-red-500">*</span>
                                        </label>

                                        <select
                                            id="industryType"
                                            {...register("industryType", {
                                                required: "Please select an industry",
                                            })}
                                            className="w-full border rounded-lg p-2 bg-white"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                Select Industry
                                            </option>

                                            {industryTypes.map((industry) => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>

                                        {errors?.company?.industryType && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.company.industryType.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* company size */}
                                    <div className="text-left mt-6">
                                        <label htmlFor="Companysize">
                                            Company size <span className="text-blue-600">Enter company size like <span className="text-green-500">10-50</span> <span className="text-red-500">*</span> </span>
                                        </label>

                                        <input
                                            id="Companysize"
                                            placeholder="10-50,50-100,100-500..."
                                            {...register("companySize", {
                                                required: "Company size is required",
                                            }

                                            )}
                                            className="w-full border rounded-lg p-2"
                                        />
                                        {
                                            errors.companySize && <span className="text-red-500 text-sm">{errors.companySize.message}</span>
                                        }
                                    </div>

                                    {/* Role */}
                                    <div className="mt-6 text-left">
                                        <label htmlFor="ClientRole"
                                        >
                                            Your Role <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            id="ClientRole"
                                            placeholder="Founder, CEO, Product Manager..."
                                            {...register("clientRole", {
                                                required:
                                                    "Your role is required",
                                            })}
                                            className="w-full border rounded-lg p-2"
                                        />

                                        {errors.ClientRole && (
                                            <p className="text-red-500 text-sm">
                                                {errors.ClientRole.message}
                                            </p>
                                        )}
                                    </div>


                                    {/* Company Summary */}
                                    <div className="mt-6 text-left">
                                        <label className="block mb-2">
                                            About Company
                                            <span className="text-sm text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>

                                        <textarea
                                            placeholder="Tell freelancers about your company and what products or services you build..."
                                            {...register("companySummary", {
                                                maxLength: {
                                                    value: 500,
                                                    message:
                                                        "Maximum 500 characters",
                                                },
                                            })}
                                            className="w-full border rounded-lg p-2"
                                            rows={4}
                                        />

                                        {errors.companySummary && (
                                            <p className="text-red-500 text-sm">
                                                {errors.companySummary.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Links */}
                        {section === "links" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="websiteLink">
                                        Website Link
                                    </label>
                                    <input
                                        type="text"
                                        id="websiteLink"
                                        placeholder="https://yourwebsite.com"
                                        {...register("websiteLink")}
                                        className="w-full border rounded-xl p-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="linkedinLink">
                                        LinkedIn Link
                                    </label>
                                    <input
                                        type="text"
                                        id="linkedinLink"
                                        placeholder="https://linkedin.com/in/username"
                                        {...register("linkedInLink")}
                                        className="w-full border rounded-xl p-3"
                                    />
                                </div>
                            </>
                        )}

                        {/* Skills */}
                        {section === "skills" && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Hiring Categories
                                </label>

                                <textarea
                                    rows={4}
                                    placeholder="React, Node.js, UI Design"
                                    {...register("hiringCategories")}
                                    className="w-full border rounded-xl p-4"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    Separate skills with colas. For example: React, Node.js, UI Design
                                </p>
                            </div>
                        )}

                        {/* profile image */}
                        {
                            section === "profileImage" && (
                                <div className="flex flex-col gap-2 items-center p-5 overflow-y-auto max-h-[500px]" >

                                    {/* DROPZONE */}
                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-[30px] w-[300px] h-[300px]  p-8 transition-all cursor-pointer flex flex-col justify-center items-center
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

                                    {/* IMAGE ERROR */}
                                    {profileImg.length ===
                                        0 && (
                                            <p className="text-red-500 text-sm mt-3">
                                                At least one image is required
                                            </p>
                                        )}
                                </div>
                            )
                        }
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-gray-300 font-medium"
                        >
                            Cancel
                        </button>


                        {
                            section === "profileImage" ? (
                                <button
                                    className={`px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90 ${profileImg.length === 0 && "opacity-50 cursor-not-allowed"}`}
                                    disabled={profileImg.length === 0}
                                    onClick={() => HandleProfileImg()}
                                >
                                     {imgLoading ? "Saving..." : "Save Image"}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">

                                    {loading ? "Saving..." : "Save Changes"}

                                </button>
                            )
                        }

                    </div>

                </form>

            </div>
        </div>
    );
};

export default EditProfileModal;