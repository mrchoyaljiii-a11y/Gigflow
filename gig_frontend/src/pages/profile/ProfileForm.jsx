// these are the form where the client and freelancer can create a profile/ account

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'

import { FaBagShopping } from "react-icons/fa6";
import { FaLaptopCode } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import { registerUser } from '../../redux/Auth/Auth'
import { useRegisterNewUser } from '../../hooks/Client_releted/useRegisterNewUser.js'

//  constants used by both modals 
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

//  Work Experience Modal

const WorkExperienceModal = ({ onClose, onSave, initial = {} }) => {
    const [form, setForm] = useState({
        title: '', company: '', city: '', country: '',
        currentRole: false,
        startMonth: '', startYear: '',
        endMonth: '', endYear: '',
        description: '',
        ...initial
    })

    // single helper — keeps each onChange one-liner
    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const handleSave = () => {
        if (!form.title.trim() || !form.company.trim()) {
            alert('Title and Company are required')
            return
        }
        onSave(form)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Add Work Experience</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none">&times;</button>
                </div>

                <div className="p-6 flex flex-col gap-4">

                    {/* Title */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                        <input
                            placeholder="Ex: Software Engineer"
                            value={form.title}
                            onChange={set('title')}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Company */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Company <span className="text-red-500">*</span></label>
                        <input
                            placeholder="Ex: Microsoft"
                            value={form.company}
                            onChange={set('company')}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Location */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Location</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                placeholder="Ex: London"
                                value={form.city}
                                onChange={set('city')}
                                className="flex-1 border rounded-lg p-2"
                            />
                            <select value={form.country} onChange={set('country')} className="flex-1 border rounded-lg p-2">
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
                            checked={form.currentRole}
                            onChange={e => setForm(p => ({ ...p, currentRole: e.target.checked }))}
                            className="w-4 h-4 accent-primary"
                        />
                        I am currently working in this role
                    </label>

                    {/* Start Date */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
                        <div className="flex gap-2 mt-1">
                            <select value={form.startMonth} onChange={set('startMonth')} className="flex-1 border rounded-lg p-2">
                                <option value="">Month</option>
                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={form.startYear} onChange={set('startYear')} className="flex-1 border rounded-lg p-2">
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* End Date — hidden when currentRole is checked */}
                    {!form.currentRole && (
                        <div className="text-left">
                            <label className="text-sm font-medium">End Date <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 mt-1">
                                <select value={form.endMonth} onChange={set('endMonth')} className="flex-1 border rounded-lg p-2">
                                    <option value="">Month</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select value={form.endYear} onChange={set('endYear')} className="flex-1 border rounded-lg p-2">
                                    <option value="">Year</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            placeholder="Describe your role and responsibilities..."
                            value={form.description}
                            onChange={set('description')}
                            rows={4}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>
                </div>

                {/* footer */}
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


//  Education Modal
const EducationModal = ({ onClose, onSave, initial = {} }) => {
    const [form, setForm] = useState({
        school: '', degree: '', field: '',
        fromYear: '', toYear: '',
        description: '',
        ...initial
    })

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const handleSave = () => {
        if (!form.school.trim()) {
            alert('School name is required')
            return
        }
        onSave(form)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Add Education History</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-light leading-none">&times;</button>
                </div>

                <div className="p-6 flex flex-col gap-4">

                    {/* School */}
                    <div className="text-left">
                        <label className="text-sm font-medium">School <span className="text-red-500">*</span></label>
                        <input
                            placeholder="Ex: Northwestern University"
                            value={form.school}
                            onChange={set('school')}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Degree */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Degree</label>
                        <input
                            placeholder="Ex: Bachelors"
                            value={form.degree}
                            onChange={set('degree')}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Field of Study */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Field of Study</label>
                        <input
                            placeholder="Ex: Computer Science"
                            value={form.field}
                            onChange={set('field')}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Dates Attended */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Dates Attended</label>
                        <div className="flex gap-2 mt-1">
                            <select value={form.fromYear} onChange={set('fromYear')} className="flex-1 border rounded-lg p-2">
                                <option value="">From</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select value={form.toYear} onChange={set('toYear')} className="flex-1 border rounded-lg p-2">
                                <option value="">To (or expected graduation year)</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-left">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            placeholder="Describe your studies, awards, etc."
                            value={form.description}
                            onChange={set('description')}
                            rows={4}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>
                </div>

                {/* footer */}
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}


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

//  MAIN COMPONENT
const ProfileForm = () => {
    const [serverError, setServerError] = useState(null)

    const {
        mutateAsync: registerUserMutation,
        data: userresponse,
        isPending,
        isError,
        isSuccess,
        error,
    } = useRegisterNewUser();



    const [nextStage, setnextStage] = useState(1)

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

    const [hiringCategories, setHiringCategories] = useState([])
    const [hiringCategoriesInput, setHiringCategoriesInput] = useState("")

    const [profilePreview, setProfilePreview] = useState(null)
    const [profileImageBase64, setProfileImageBase64] = useState(null)




    const [experiences, setExperiences] = useState([])       // list of work exp objects
    const [showExpModal, setShowExpModal] = useState(false)  // open/close exp modal
    const [editingExpIdx, setEditingExpIdx] = useState(null) // null = new, number = editing index

    const [education, setEducation] = useState([])           // list of education objects
    const [showEduModal, setShowEduModal] = useState(false)
    const [editingEduIdx, setEditingEduIdx] = useState(null)

    const [hourlyRate, setHourlyRate] = useState(20)         // live slider value
    const serviceFee = + (hourlyRate * 0.1).toFixed(2)        // 10% platform fee
    const youGet = +(hourlyRate - serviceFee).toFixed(2) // what freelancer receives

    const [companySize, setcompanySize] = useState(null)



    function HandleCompanySize(index) {
        setcompanySize(index)
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // select insustry type used in step 3 role == client
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

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors }
    } = useForm(
        {
            defaultValues: {
                ClientType: 'individual'
            },
        }
    )

    const password = watch('password', '')
    const selectedRole = watch("role") // freelancer or client
    const clientType = watch("ClientType"); // uswed in step 3 from client type individual or company

    // dropzone 
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be under 2MB")
            return
        }
        const previewUrl = URL.createObjectURL(file)
        setProfilePreview(previewUrl)

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => setProfileImageBase64(reader.result)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 2 * 1024 * 1024
    })

    //  stage count: client = 4, freelancer = 7 
    // client    : 1-role  2-basic  3-clientDetails  4-credentials
    // freelancer: 1-role  2-basic  3-freelancerDetails  4-workExp  5-education  6-rate  7-credentials
    const lastStage = selectedRole === 'freelancer' ? 7 : 4
    const progressPercent = Math.floor(nextStage / lastStage * 100)

    const stageLabel = () => {
        if (nextStage === 1) return "Select your role"
        if (nextStage === 2) return "Basic Information"
        if (nextStage === 3) return selectedRole === 'client' ? "Client Details" : "Professional Details"
        if (nextStage === 4 && selectedRole === 'freelancer') return "Work Experience"
        if (nextStage === 5 && selectedRole === 'freelancer') return "Education"
        if (nextStage === 6 && selectedRole === 'freelancer') return "Hourly Rate"
        return "Account Credentials"
    }

    //  HandleNext and Previous with validation for required fields in each stage (except work exp and education which are optional)
    const HandleNext_stage = async () => {
        let isValid = false

        if (nextStage === 1) {
            isValid = await trigger(["role"])
        }

        if (nextStage === 2) {
            isValid = await trigger(["FirstName", "LastName", "country", "state",])
            // if (languages.length === 0) {
            //     setLanguageError(true)
            //     isValid = false
            // } else {
            //     setLanguageError(false)
            // }
        }

        if (nextStage === 3 && selectedRole === 'client') {
            isValid = await trigger(["ClientRole", "clientSummary", "Company", "companySize", "industryType"])
        }

        if (nextStage === 3 && selectedRole === 'freelancer') {
            isValid = await trigger(["professionalTitle", "ProfessionalCategory", "ExperienceLevel", "rate"])
        }

        // stages 4 (work exp) and 5 (education) are optional — always allow Next
        if (nextStage === 4 || nextStage === 5) {
            isValid = true
        }

        // stage 6 — rate must be > 0 (it always is since min=1 and default=20)
        if (nextStage === 6) {
            isValid = hourlyRate > 0
        }

        if (isValid) {
            setnextStage(prev => prev + 1)
        }
    }

    const HandlePrevious_stage = () => {
        setnextStage(prev => prev - 1)
    }

    //  hiring/skills handlers 
    const handleAddHiringCategory = () => {
        const value = hiringCategoriesInput.trim()
        if (value && !hiringCategories.includes(value)) {
            setHiringCategories(prev => [...prev, value])
            setHiringCategoriesInput("")
        }
    }
    const handleRemoveHiringCategory = (category) => {
        setHiringCategories(prev => prev.filter(c => c !== category))
    }

    //  NEW: work experience handlers 
    const handleSaveExp = (form) => {
        if (editingExpIdx !== null) {
            // update existing entry
            setExperiences(prev => prev.map((x, i) => i === editingExpIdx ? form : x))
            setEditingExpIdx(null)
        } else {
            // add new entry
            setExperiences(prev => [...prev, form])
        }
        setShowExpModal(false)
    }

    const handleEditExp = (idx) => {
        setEditingExpIdx(idx)
        setShowExpModal(true)
    }

    const handleDeleteExp = (idx) => {
        setExperiences(prev => prev.filter((_, i) => i !== idx))
    }

    //  NEW: education handlers 
    const handleSaveEdu = (form) => {
        if (editingEduIdx !== null) {
            setEducation(prev => prev.map((x, i) => i === editingEduIdx ? form : x))
            setEditingEduIdx(null)
        } else {
            setEducation(prev => [...prev, form])
        }
        setShowEduModal(false)
    }
    const handleEditEdu = (idx) => {
        setEditingEduIdx(idx)
        setShowEduModal(true)
    }
    const handleDeleteEdu = (idx) => {
        setEducation(prev => prev.filter((_, i) => i !== idx))
    }

    //  your original onSubmit — extended with new fields 
    const onSubmit = async (data) => {

        let data_to_update = {};

        if (selectedRole === "freelancer") {
            data_to_update = {
                role: data.role, // both
                firstName: data.FirstName, //both
                lastName: data.LastName, // both
                // userName: data.userName,
                country: data.country, //both
                state: data.state, //both
                languages: languages, // both
                Links: {  // both
                    websiteLink: data.websiteLink || "",
                    linkedInLink: data.linkedInLink || "",
                },
                professionalTitle: data.professionalTitle, // freelancer
                professionalCategory: data.ProfessionalCategory, // freelancer
                experienceLevel: data.ExperienceLevel,  //freelancer
                freelanerSkills: hiringCategories,  //freelancer
                freelancerSummary: data.freelancerSummary, // freelancer
                email: data.email, // both
                password: data.password, //both
                profileImage: profileImageBase64, //both
                workExperience: experiences,  // freelancer
                education: education,  // freelancer
                hourlyRate: hourlyRate,  // freelancer
            }
        }

        if (selectedRole === "client") {
            data_to_update = {
                role: data.role, // both
                firstName: data.FirstName, //both
                lastName: data.LastName, // both
                country: data.country, //both
                state: data.state, //both
                languages: languages, // both
                clientType: data.ClientType, //client
                clientRole: data.ClientRole, //client
                clientSummary: data.clientSummary, //client
                Links: {  // both
                    websiteLink: data.websiteLink || "",
                    linkedInLink: data.linkedInLink || "",
                },
                hiringCategories: hiringCategories, //client
                email: data.email, // both
                password: data.password, //both
                profileImage: profileImageBase64, //both
                company: {          // client
                    name: data.Company || "",
                    companySize: data.companySize || "",
                    companySummary: data.companySummary || "",
                    industryType: data.industryType || "",
                },
            }
        }

        console.log("Final submitted data:", data_to_update)

        setServerError(null)
        try {
            // dispatch(registerUser(data_to_update))
            const response = await registerUserMutation(data_to_update);

            console.log("user response", response);

            if (response?.success) {
                navigate('/login')
            }else{
                setServerError(response?.message || 'Signup failed.')
            }

        } catch (error) {
            console.log("Signup error", error);
            setServerError(error || 'Signup failed.')
        }
    }

    return (
        <div className="text-center w-full mb-20 bg-gray-100">
            <div className="main_section bg-white p-6 rounded shadow-md max-w-2xl mx-auto">

                {/*  headings  */}
                <div className="headings">
                    <h1 className="text-xl font-bold underline">Complete Your Profile</h1>
                    <p className="dynamic_heading text-lg font-medium text-primary">
                        {stageLabel()}
                    </p>
                </div>

                {/*  progress bar  */}
                <div className="progress-bar-section">
                    <div className="headings flex justify-between">
                        <h2 className="text-md font-semibold text-gray-600">{stageLabel()}</h2>
                        <h2 className="text-md font-semibold text-gray-600">
                            <span>{progressPercent}</span>% completed
                        </h2>
                    </div>
                    <div className="progress-bar mx-auto bg-gray-200 rounded-xl h-1.5 w-full mt-0.5">
                        <div
                            className="progress bg-primary h-1.5 rounded-xl transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/*  STAGE 1 — Role  */}
                    {nextStage === 1 && (
                        <div className="stage-1 flex flex-col gap-4 mt-6">
                            {[
                                {
                                    id: "client", value: "client",
                                    title: "I want to hire freelancers",
                                    desc: "Post jobs and manage projects",
                                    icon: <FaBagShopping className="text-primary" size={22} />
                                },
                                {
                                    id: "freelancer", value: "freelancer",
                                    title: "I want to work as a freelancer",
                                    desc: "Find projects and get hired",
                                    icon: <FaLaptopCode className="text-primary" size={22} />
                                },
                            ].map(role => (
                                <label
                                    key={role.id}
                                    htmlFor={role.id}
                                    className={`border-2 rounded-lg p-4 flex justify-between items-center cursor-pointer transition
                                        ${selectedRole === role.value
                                            ? "border-primary bg-blue-50"
                                            : "border-gray-200 hover:border-primary hover:bg-blue-50"}`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {role.icon}
                                            <h2 className="text-lg font-medium">{role.title}</h2>
                                        </div>
                                        <p className="text-gray-600 text-sm">{role.desc}</p>
                                    </div>
                                    <input
                                        type="radio"
                                        id={role.id}
                                        value={role.value}
                                        {...register("role", { required: true })}
                                        className="w-5 h-5 accent-primary"
                                    />
                                </label>
                            ))}
                            {errors.role && (
                                <p className="text-red-500 text-sm text-left">Please select a role</p>
                            )}
                        </div>
                    )}

                    {/*  STAGE 2 — Basic Info  */}
                    {nextStage === 2 && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            {/* profile image */}
                            <div className="upload_profile_image mx-auto flex flex-col items-center gap-4">
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-full p-6 cursor-pointer
                                        ${isDragActive ? 'border-primary bg-blue-100' : 'border-gray-400 hover:border-primary hover:bg-blue-50'}
                                        w-40 h-40`}
                                >
                                    <input {...getInputProps()} />
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Profile preview" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <FaRegUserCircle size={100} className="mx-auto text-gray-400" />
                                    )}
                                </div>
                                <p className="text-sm">Upload Photo <span className="text-primary font-semibold">(optional)</span></p>
                            </div>

                            {/* first + last name */}
                            <div className="group flex gap-4">
                                <div className="mt-6 text-left w-1/2">
                                    <label className="font-medium"
                                        htmlFor="first_name">
                                        First Name <span className="text-red-500 ">*</span>
                                    </label>
                                    <input
                                        placeholder="First name"
                                        id='first_name'
                                        {...register("FirstName", { required: "First name is required" })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                    {errors.FirstName && <p className="text-red-500 text-sm">{errors.FirstName.message}</p>}
                                </div>

                                <div className="mt-6 text-left w-1/2">
                                    <label className="font-medium"
                                        htmlFor="last_name">
                                        Last Name <span className="text-red-500 ">*</span>
                                    </label>
                                    <input
                                        placeholder="Last name"
                                        id='last_name'
                                        {...register("LastName", { required: "Last name is required" })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                    {errors.LastName && <p className="text-red-500 text-sm">{errors.LastName.message}</p>}
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
                    )}

                    {/* STAGE 3 CLIENT */}
                    {nextStage === 3 && selectedRole === "client" && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">

                            {/* Client Type */}
                            <div className="text-left">
                                <label className="font-medium">
                                    Who are you hiring for?
                                </label>

                                <div className="flex gap-4 mt-3">
                                    {[
                                        {
                                            value: "individual",
                                            label: "Individual",
                                        },
                                        {
                                            value: "business",
                                            label: "Business / Company",
                                        },
                                    ].map((item, index) => (
                                        <label
                                            key={item.value}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                value={item.value}
                                                {...register("ClientType", {
                                                    required:
                                                        "Please select client type",
                                                })}
                                                className="hidden peer"
                                            />

                                            <div
                                                className={`border rounded-lg p-4 text-center transition
          ${clientType === item.value
                                                        ? "bg-blue-50 border-primary"
                                                        : "border-gray-300 hover:border-primary"
                                                    }`}
                                            >
                                                {item.label}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {errors.ClientType && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.ClientType.message}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="mt-6 text-left">
                                <label htmlFor="ClientRole"
                                >
                                    Your Role <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="ClientRole"
                                    placeholder={
                                        clientType === "business"
                                            ? "Founder, CEO, Product Manager..."
                                            : "Student, Entrepreneur, Content Creator..."
                                    }
                                    {...register("ClientRole", {
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

                            {/* About You */}
                            <div className="mt-6 text-left">
                                <label className="block mb-2">
                                    About You <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    placeholder={
                                        clientType === "business"
                                            ? "Tell freelancers about yourself, your role, and how you like to work..."
                                            : "Tell freelancers about yourself and the projects you usually hire for..."
                                    }
                                    {...register("clientSummary", {
                                        required:
                                            "Please tell freelancers about yourself",
                                        maxLength: {
                                            value: 500,
                                            message:
                                                "Maximum 500 characters",
                                        },
                                    })}
                                    className="w-full border rounded-lg p-2"
                                    rows={4}
                                />

                                {errors.clientSummary && (
                                    <p className="text-red-500 text-sm">
                                        {errors.clientSummary.message}
                                    </p>
                                )}
                            </div>

                            {/* Links */}
                            {clientType === "individual" &&
                                (<div className="group flex gap-4 mt-6">
                                    <div className="w-1/2 text-left">
                                        <label>
                                            Your Website
                                            <span className="text-sm text-primary ml-1">
                                                optional
                                            </span>
                                        </label>

                                        <input
                                            placeholder="https://Your website.com"
                                            {...register("websiteLink")}
                                            className="w-full border rounded-lg p-2"
                                        />
                                    </div>

                                    <div className="w-1/2 text-left">
                                        <label>
                                            LinkedIn
                                            <span className="text-sm text-primary ml-1">
                                                optional
                                            </span>
                                        </label>

                                        <input
                                            placeholder="https://linkedin.com/..."
                                            {...register("linkedInLink")}
                                            className="w-full border rounded-lg p-2"
                                        />
                                    </div>
                                </div>)
                            }

                            {/* Hiring Categories */}
                            <div className="mt-6 text-left">
                                <label>
                                    What do you usually hire freelancers for?
                                    <span className="text-sm text-primary ml-1">
                                        optional
                                    </span>
                                </label>

                                <div className="flex gap-2 mt-1">
                                    <input
                                        value={hiringCategoriesInput}
                                        onChange={(e) =>
                                            setHiringCategoriesInput(
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border rounded-lg p-2"
                                        placeholder="Web Development, UI Design, Video Editing..."
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAddHiringCategory}
                                        className="border border-primary text-primary px-4 rounded-lg"
                                    >
                                        + Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {hiringCategories.map((cat, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            {cat}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveHiringCategory(
                                                        cat
                                                    )
                                                }
                                                className="ml-2 hover:text-red-600"
                                            >
                                                &#10005;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Business Fields */}
                            {clientType === "business" && (
                                <>
                                    {/* Company name*/}
                                    <div className="text-left mt-6">
                                        <label htmlFor="Company">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            id="Company"
                                            placeholder="Microsoft, Google, Amazon..."
                                            {...register("Company", {
                                                required: "Company name is required",
                                                maxLength: {
                                                    value: 50,
                                                    message:
                                                        "Maximum 50 characters",
                                                },
                                            }

                                            )}
                                            className="w-full border rounded-lg p-2"
                                        />
                                        {
                                            errors.Company && <span className="text-red-500 text-sm">{errors.Company.message}</span>
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

                                    {/* Links */}
                                    <div className="group flex gap-4 mt-6">
                                        <div className="w-1/2 text-left">
                                            <label>
                                                Company Website
                                                <span className="text-sm text-primary ml-1">
                                                    optional
                                                </span>
                                            </label>

                                            <input
                                                placeholder="https://company.com"
                                                {...register("websiteLink")}
                                                className="w-full border rounded-lg p-2"
                                            />
                                        </div>

                                        <div className="w-1/2 text-left">
                                            <label>
                                                LinkedIn
                                                <span className="text-sm text-primary ml-1">
                                                    optional
                                                </span>
                                            </label>

                                            <input
                                                placeholder="https://linkedin.com/company/..."
                                                {...register("linkedInLink")}
                                                className="w-full border rounded-lg p-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Company Size */}
                                    <div className="mt-6 text-left">
                                        <p>
                                            How many people are in your
                                            organization?
                                            <span className="text-red-500">*</span>
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-3">
                                            {[
                                                "Just me",
                                                "2-10",
                                                "10-50",
                                                "50-100",
                                                "100-500",
                                                "500-1000",
                                                "1000+",
                                            ].map((option, index) => (
                                                <div key={option}>
                                                    <input
                                                        type="radio"
                                                        id={option}
                                                        value={option}
                                                        {...register("companySize", {
                                                            required: "Company size is required",
                                                        })}
                                                        className="hidden"
                                                        onClick={() =>
                                                            HandleCompanySize(index)
                                                        }
                                                    />

                                                    <label
                                                        htmlFor={option}
                                                        className={`cursor-pointer border border-primary text-primary p-1 rounded-lg hover:bg-primary hover:text-white transition ${companySize === index
                                                            ? "bg-primary text-white"
                                                            : ""
                                                            }`}
                                                    >
                                                        {option}
                                                    </label>

                                                </div>

                                            ))}
                                            {
                                                errors.companySize && <span className="text-red-500 text-sm">{errors.companySize.message}</span>
                                            }
                                        </div>
                                    </div>

                                    {/* Company Summary */}
                                    <div className="mt-6 text-left">
                                        <label className="block mb-2">
                                            About Company
                                            <span className="text-sm text-primary ml-1">
                                                optional
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
                                </>
                            )}

                        </div>
                    )}

                    {/*  STAGE 3 FREELANCER  */}
                    {nextStage === 3 && selectedRole === "freelancer" && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            <div className="mt-6 text-left">
                                <label htmlFor="professionalTitle">Professional Title <span className="text-red-500">*</span></label>
                                <input
                                    placeholder="Full-Stack MERN Developer"
                                    id="professionalTitle"
                                    {...register("professionalTitle", { required: "Professional title is required" })}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.professionalTitle && <p className="text-red-500 text-sm">{errors.professionalTitle.message}</p>}
                            </div>

                            <div className="mt-6 text-left">
                                <label htmlFor="ProfessionalCategory">Professional Category <span className="text-red-500">*</span> </label>
                                <input
                                    placeholder="Web Development, Mobile App Development, Design"
                                    id="ProfessionalCategory"
                                    {...register("ProfessionalCategory", { required: "Professional category is required" })}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.ProfessionalCategory && <p className="text-red-500 text-sm">{errors.ProfessionalCategory.message}</p>}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <div className="w-1/2 text-left">
                                    <label htmlFor="ExperienceLevel">Experience Level <span className="text-red-500">*</span> </label>
                                    <select
                                        id="ExperienceLevel"
                                        className="border rounded-lg p-2 w-full"
                                        {...register("ExperienceLevel", { required: "Experience level is required" })}
                                    >
                                        <option value="">Select Experience Level</option>
                                        <option value="Beginner (0-1 years)">Beginner (0-1 years)</option>
                                        <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
                                        <option value="Expert (3+ years)">Expert (3+ years)</option>
                                    </select>
                                    {errors.ExperienceLevel && <p className="text-red-500 text-sm">{errors.ExperienceLevel.message}</p>}
                                </div>

                            </div>

                            <div className="group flex gap-4 mt-6">
                                <div className="w-1/2 text-left">
                                    <label htmlFor="websiteLink">Website link <span className="text-sm font-medium text-primary">optional</span></label>
                                    <input placeholder="Website link" id="websiteLink" {...register("websiteLink")} className="w-full border rounded-lg p-2" />
                                </div>
                                <div className="w-1/2 text-left">
                                    <label htmlFor="linkedInLink">LinkedIn link <span className="text-sm font-medium text-primary">optional</span></label>
                                    <input placeholder="LinkedIn link" id="linkedInLink" {...register("linkedInLink")} className="w-full border rounded-lg p-2" />
                                </div>
                            </div>

                            {/* skills */}
                            <div className="mt-6 text-left">
                                <label>Add Skills <span className="text-sm font-medium text-primary">optional</span></label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        value={hiringCategoriesInput}
                                        onChange={(e) => setHiringCategoriesInput(e.target.value)}
                                        className="flex-1 border rounded-lg p-2"
                                        placeholder="e.g React, Node.js, MongoDB, Python..."
                                    />
                                    <button type="button" onClick={handleAddHiringCategory}
                                        className="border border-primary text-primary px-4 rounded-lg">
                                        + Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {hiringCategories.map((skill, i) => (
                                        <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveHiringCategory(skill)} className="ml-2 hover:text-red-600">&#10005;</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* profile summary */}
                            <div className="profile-summary mt-6">
                                <label htmlFor="clientSummary" className="text-left block mb-2">Professional Summary <span className="text-primary font-semibold">(optional)</span></label>
                                <textarea
                                    id="clientSummary"
                                    placeholder="Give your profile overview"
                                    {...register("freelancerSummary", {
                                        maxLength: { value: 500, message: "Profile summary cannot exceed 500 characters" }
                                    })}
                                    className="w-full border rounded-lg p-2"
                                    rows="4"
                                />

                            </div>
                        </div>
                    )}

                    {/*  STAGE 4 — Work Experience (freelancer only)  */}
                    {nextStage === 4 && selectedRole === "freelancer" && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-left">
                                    <h2 className="text-lg font-semibold">Work Experience</h2>
                                    <p className="text-sm text-gray-500">Add your past jobs to build trust with clients</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setEditingExpIdx(null); setShowExpModal(true) }}
                                    className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
                                >
                                    + Add
                                </button>
                            </div>

                            {experiences.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-gray-400 text-sm">No experience added yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Click "+ Add" to add your work history</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {experiences.map((exp, i) => (
                                        <div key={i} className="border rounded-lg p-4 text-left flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-semibold">{exp.title}</p>
                                                <p className="text-sm text-gray-600">
                                                    {exp.company}{exp.city ? ` · ${exp.city}` : ''}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {exp.startMonth} {exp.startYear} &ndash;{' '}
                                                    {exp.currentRole ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exp.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button type="button" onClick={() => handleEditExp(i)}
                                                    className="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50">
                                                    Edit
                                                </button>
                                                <button type="button" onClick={() => handleDeleteExp(i)}
                                                    className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-4 text-left">* Optional — you can skip and add later</p>
                        </div>
                    )}

                    {/*  STAGE 5 — Education (freelancer only)  */}
                    {nextStage === 5 && selectedRole === "freelancer" && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-left">
                                    <h2 className="text-lg font-semibold">Education</h2>
                                    <p className="text-sm text-gray-500">Add your academic background</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setEditingEduIdx(null); setShowEduModal(true) }}
                                    className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-blue-50"
                                >
                                    + Add
                                </button>
                            </div>

                            {education.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-gray-400 text-sm">No education added yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Click "+ Add" to add your education history</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {education.map((edu, i) => (
                                        <div key={i} className="border rounded-lg p-4 text-left flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-semibold">{edu.school}</p>
                                                <p className="text-sm text-gray-600">
                                                    {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                                                </p>
                                                {(edu.fromYear || edu.toYear) && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {edu.fromYear} &ndash; {edu.toYear}
                                                    </p>
                                                )}
                                                {edu.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{edu.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button type="button" onClick={() => handleEditEdu(i)}
                                                    className="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50">
                                                    Edit
                                                </button>
                                                <button type="button" onClick={() => handleDeleteEdu(i)}
                                                    className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-4 text-left">* Optional — you can skip and add later</p>
                        </div>
                    )}

                    {/*  STAGE 6 — Hourly Rate (freelancer only)  */}
                    {nextStage === 6 && selectedRole === "freelancer" && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            <div className="text-left mb-6">
                                <h2 className="text-lg font-semibold">Set your hourly rate</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Clients will see this on your profile. You can adjust it every time you submit a proposal.
                                </p>
                            </div>

                            {/* Hourly rate input */}
                            <div className="flex items-center justify-between border-b pb-5">
                                <div className="text-left">
                                    <p className="font-semibold">Hourly rate</p>
                                    <p className="text-sm text-gray-500">Total amount the client will see</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">$</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={999}
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(Math.max(1, +e.target.value))}
                                        className="w-24 text-right border rounded-lg px-3 py-2 font-semibold focus:outline-none focus:border-primary"
                                    />
                                    <span className="text-gray-500 text-sm">/hr</span>
                                </div>
                            </div>

                            {/* Slider */}
                            <div className="py-4 border-b">
                                <input
                                    type="range"
                                    min={1} max={200} step={1}
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(+e.target.value)}
                                    className="w-full accent-primary"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>$1/hr</span>
                                    <span>$200/hr</span>
                                </div>
                            </div>

                            {/* Service fee */}
                            <div className="flex items-center justify-between border-b py-5">
                                <div className="text-left">
                                    <p className="font-semibold">
                                        Service fee <span className="text-xs text-gray-400 font-normal">(10%)</span>
                                    </p>
                                    <p className="text-sm text-gray-500">Platform fee for payment protection and support</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-red-500">-${serviceFee.toFixed(2)}</span>
                                    <span className="text-gray-400 text-sm">/hr</span>
                                </div>
                            </div>

                            {/* You will get */}
                            <div className="flex items-center justify-between pt-5 bg-blue-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                                <div className="text-left">
                                    <p className="font-bold text-lg">You will get</p>
                                    <p className="text-sm text-gray-500">Estimated amount after service fees</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-bold text-primary">${youGet.toFixed(2)}</span>
                                    <span className="text-gray-500 text-sm">/hr</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/*  CREDENTIALS — stage 4 for client, stage 7 for freelancer  */}
                    {((nextStage === 4 && selectedRole === "client") || (nextStage === 7 && selectedRole === "freelancer")) && (
                        <div className="stage-2 mt-6 border w-full p-6 rounded-lg">
                            <div className="mt-6 text-left">
                                <label htmlFor="email">Enter Email</label>
                                <input
                                    placeholder="Demo@gmail.com"
                                    id="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div className="mt-6 text-left">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    id="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <div className="mt-6 text-left">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    id="confirmPassword"
                                    {...register("confirmPassword", {
                                        required: "Confirm password is required",
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    className="w-full border rounded-lg p-2"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* server error */}
                    {serverError && (
                        <p className="text-red-500 text-sm mt-4">{serverError}</p>
                    )}

                    {/*  Buttons  */}
                    <div className="btn-groups flex justify-between gap-2 mt-6">
                        {nextStage > 1 && (
                            <button type="button" onClick={HandlePrevious_stage}
                                className="w-1/2 bg-black text-white py-2 rounded">
                                Back
                            </button>
                        )}

                        {nextStage < lastStage ? (
                            <button type="button" onClick={HandleNext_stage}
                                className="w-1/2 bg-primary text-white py-2 rounded">
                                Next
                            </button>
                        ) : (
                            <button type="submit"
                                className="w-1/2 bg-primary text-white py-2 rounded">
                                Submit
                            </button>
                        )}
                    </div>

                </form>
            </div>

            {/* Modals live outside <form> so they don't interfere with RHF submit */}
            {showExpModal && (
                <WorkExperienceModal
                    onClose={() => { setShowExpModal(false); setEditingExpIdx(null) }}
                    onSave={handleSaveExp}
                    initial={editingExpIdx !== null ? experiences[editingExpIdx] : {}}
                />
            )}
            {showEduModal && (
                <EducationModal
                    onClose={() => { setShowEduModal(false); setEditingEduIdx(null) }}
                    onSave={handleSaveEdu}
                    initial={editingEduIdx !== null ? education[editingEduIdx] : {}}
                />
            )}
        </div>
    )
}

export default ProfileForm