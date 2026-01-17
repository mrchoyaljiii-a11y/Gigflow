import React, { use } from 'react'
import { useForm } from "react-hook-form";
import { CiCircleRemove } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import {Addjob} from '../../redux/slices/job_slice.js';
const JobPosting = () => {

    const dispatch=useDispatch();
    // const {error} = useSelector ((state) => state.job);
    const categories = [
        { value: "UI/UX Design", label: "UI/UX Design" },
        { value: "Web Development", label: "Web Development" },
        { value: "mobile app development", label: "Mobile App" },
        { value: "Video & Animation", label: "Video & Animation" },
        { value: "java developer", label: "Java Developer" },
        { value: "python Developer", label: "Python Developer" },
        { value: "data Science", label: "Data Science" },
        { value: "game development", label: "Game Development" },
        { value: "graphic design", label: "Graphic Design" },
        { value: "translation", label: "Translation" },
        { value: "Digital Marketing", label: "Digital Marketing" },
        { value: "Content Writing", label: "Content Writing" },
        { value: "other", label: "Other" },

    ];

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        reset
    } = useForm();


    const descriptionValue = watch("description", "");

    const onSubmit = (data) => {
        const tags = [
            data.tag1,
            data.tag2,
            data.tag3,
            data.tag4,
            data.tag5,
        ].filter(tag => tag && tag.trim() !== "");

        if (tags.length < 3) {
            setError("tags", {
                type: "manual",
                message: "At least 3 skills/tags are required",
            });
            return;
        }

        clearErrors("tags");

        const payload = {
            ...data,
            tags,
            status:"active"
        };

        // console.log("Final Payload:", payload);
        dispatch(Addjob(payload));
        reset();
    };


    return (
        <div className="inset-0  flex justify-center items-center z-50 p-5">
            <div className="w-full max-w-lg bg-[#F8F9FB] rounded-2xl overflow-hidden shadow-lg">

                {/* top section */}
                <div className="relative flex items-center justify-center py-4 border-b border-gray-400 bg-white">

                    <NavLink to="/" className="absolute left-4 text-slate-500 hover:text-black">
                        <CiCircleRemove size={30} />
                    </NavLink>

                    <h2 className="text-sm font-semibold">Create a New Gig</h2>
                </div>

                {/* FORM ssection */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-6 py-6 space-y-6">

                        {/* Project Info */}
                        <div className="space-y-5">
                            <h3 className="font-semibold text-3xl text-center">Project Information</h3>

                            {/* Freelancer_type */}

                            <div>
                                <label className="text-sm font-medium">
                                    Describe the type of candidate you are looking for?
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. full stack developer,ui/ux designer, mobile app developer"
                                    {...register("Freelancer_type", {
                                        required: "Project name is required",
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white
                    ${errors.Freelancer_type
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                />
                                {errors.Freelancer_type && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.Freelancer_type.message}
                                    </p>
                                )}
                            </div>

                            {/* Project Title */}
                             <div>
                                <label className="text-sm font-medium">
                                    Describe the Your project Title?
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Product managment system, Mobile lerning app, Product marketing"
                                    {...register("projectTitle", {
                                        required: "Project name is required",
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white
                    ${errors.projectTitle
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                />
                                {errors.projectTitle && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.projectTitle.message}
                                    </p>
                                )}
                            </div>


                            {/* clint name  */}

                            <div>
                                <label className="text-sm font-medium">
                                    Describe your name / company?
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Tech Solutions, John Doe"
                                    {...register("clientName", {
                                        required: "Client name is required",
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white
                    ${errors.clientName
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                />
                                {errors.clientName && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.clientName.message}
                                    </p>
                                )}
                            </div>


                            {/* Category */}
                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    {...register("category", {
                                        required: "Category is required",
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white
                    ${errors.category
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                >
                                    {categories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            {/* Timeline */}
                             <div>
                                <label className="text-sm font-medium">
                                    Describe DeadLine for this gig?
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 5 Days, 1 Week, 2 Months"
                                    {...register("Timeline", {
                                        required: "TimeLine is required",
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white
                    ${errors.Timeline
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                />
                                {errors.Timeline && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.Timeline.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Project Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the tasks, deliverables, and any specific requirements for this gig..."
                                    {...register("description", {
                                        required: "Description is required",
                                        maxLength: {
                                            value: 5000,
                                            message: "Maximum 5000 characters allowed",
                                        },
                                    })}
                                    className={`mt-2 w-full px-4 py-3 text-sm rounded-xl border outline-none bg-white resize-none
                    ${errors.description
                                            ? "border-red-500 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-primary"}
                  `}
                                />
                                <div className="flex justify-between text-xs mt-1">
                                    <p className="text-red-500">
                                        {errors.description?.message}
                                    </p>
                                    <p className="text-slate-400">
                                        {descriptionValue.length} / 5000 characters
                                    </p>
                                </div>
                            </div>


                            {/* Tags */}
                            <div className="tages space-y-4">

                                {/* Heading */}
                                <div>
                                    <p className="text-sm font-medium">
                                        Required Skills{" "}
                                        <span className="text-[13px] text-red-500">
                                            At least 3 tags are required
                                        </span>
                                    </p>

                                    {errors.tags && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.tags.message}
                                        </p>
                                    )}
                                </div>

                                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Tag 1 */}
                                    <div>
                                        <label className="text-sm font-medium">Tag 1</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. React"
                                            {...register("tag1")}
                                            className="mt-2 w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                                        />
                                    </div>

                                    {/* Tag 2 */}
                                    <div>
                                        <label className="text-sm font-medium">Tag 2</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Node.js"
                                            {...register("tag2")}
                                            className="mt-2 w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                                        />
                                    </div>

                                    {/* Tag 3 */}
                                    <div>
                                        <label className="text-sm font-medium">Tag 3</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. MongoDB"
                                            {...register("tag3")}
                                            className="mt-2 w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                                        />
                                    </div>

                                    {/* Tag 4 (Optional) */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Tag 4 <span className="text-xs text-slate-400">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. UI/UX Designer"
                                            {...register("tag4")}
                                            className="mt-2 w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                                        />
                                    </div>

                                    {/* Tag 5 (Optional) */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Tag 5 <span className="text-xs text-slate-400">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. SEO, Marketing"
                                            {...register("tag5")}
                                            className="mt-2 w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                                        />
                                    </div>

                                </section>
                            </div>



                            {/* Budget */}
                            <div>
                                <label className="text-sm font-medium">Budget Range ($)</label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <input
                                        type="number"
                                        placeholder="$ 50"
                                        {...register("minBudget", {
                                            required: "Minimum budget required",
                                            min: { value: 1, message: "Must be greater than 0" },
                                        })}
                                        className={`px-4 py-3 text-sm rounded-xl border outline-none bg-white
                      ${errors.minBudget
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-slate-200 focus:ring-primary"}
                    `}
                                    />
                                    <input
                                        type="number"
                                        placeholder="$ 5000"
                                        {...register("maxBudget", {
                                            required: "Maximum budget required",
                                            min: { value: 1, message: "Must be greater than 0" },
                                        })}
                                        className={`px-4 py-3 text-sm rounded-xl border outline-none bg-white
                      ${errors.maxBudget
                                                ? "border-red-500 focus:ring-red-400"
                                                : "border-slate-200 focus:ring-primary"}
                    `}
                                    />
                                </div>
                                {(errors.minBudget || errors.maxBudget) && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.minBudget?.message || errors.maxBudget?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* bottom*/}
                    <div className="p-4 bg-white border-t border-gray-400">
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
                        >
                            Save and Continue →
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}

export default JobPosting
