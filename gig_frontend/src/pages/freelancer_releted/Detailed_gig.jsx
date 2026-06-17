//? Freelancer view: full job details + bid form

import React, { useState } from "react";
import { IoIosRocket } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddBid } from "../../redux/Bid/Bid_slice.js";

import { HiSparkles } from "react-icons/hi2";
import { MdVerified, MdOutlineCategory, MdOutlineEmail } from "react-icons/md";
import {
    FaStar,
    FaDollarSign,
    FaClock,
    FaMapMarkerAlt,
    FaBuilding,
    FaChevronDown,
    FaChevronUp,
    FaUser,
    FaFileAlt,
    FaPaperPlane,
} from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ children }) => (
    <div
        className={`group relative bg-white border border-slate-200 rounded-2xl p-6 
    transition-all duration-300 hover:border-blue-200 
    hover:shadow-[0_18px_32px_rgba(79,107,255,0.10)] overflow-hidden `}
    >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
        {children}
    </div>
);

// ─── Section Title ────────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, iconBg, iconColor, children }) => (
    <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} className={iconColor} />
        </div>
        <h2 className="text-[13px] font-black text-slate-700 uppercase tracking-widest">
            {children}
        </h2>
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, label, value }) => (
    <div className="group relative flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(79,107,255,0.12)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={20} className={iconColor} />
        </div>
        <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
            <p className="text-[17px] font-black text-slate-800">{value}</p>
        </div>
    </div>
);

// ─── Form Field ───────────────────────────────────────────────────────────────
const FormField = ({ label, icon: Icon, error, children }) => (
    <div>
        <label className="flex items-center gap-1.5 text-[0.9rem] font-black uppercase tracking-widest text-slate-500 mb-2">
            <Icon size={15} />
            {label}
        </label>
        {children}
        {error && (
            <p className="text-[0.9rem] text-red-500 mt-1.5 font-semibold">⚠ {error}</p>
        )}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Detailed_gig = () => {
    const [showMore, setShowMore] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();
    const { jobs } = useSelector((state) => state.job);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const filtergig = jobs.filter((gig) => gig._id === id);

    const onSubmit = async (data) => {
        const updatedData = { ...data, gigId: id };
        await dispatch(AddBid(updatedData)).unwrap();
        reset();
    };

    return (
        <>
            {filtergig.map((gig) => {
                const {
                    _id,
                    clientId,
                    jobtitle,
                    maxBudget,
                    minBudget,
                    projectCategory,
                    skills,
                    jobDescription,
                    timeline,
                    createdAt,
                    status,
                } = gig;

                return (
                    <div
                        key={_id}
                        className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
                    >
                        {/* ══════════ LEFT CONTENT ══════════ */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* ── Job Header ── */}
                            <Section>
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-3">
                                            <HiSparkles className="text-blue-400 shrink-0" size={22} />
                                            <h1 className="text-2xl font-black text-slate-900 leading-tight">{jobtitle}</h1>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                                                <MdOutlineCategory size={18} /> {projectCategory}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full">
                                                <FaClock size={18} /> Posted {createdAt.split("T")[0]}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 text-[0.9rem] font-semibold  ${status === "assigned" ? "bg-red-50 text-red-600" : status === "active" ? "bg-emerald-50 text-emerald-700" : ""}  border border-emerald-100 px-3 py-1 rounded-full`}>
                                                <BsBriefcaseFill size={15} />{status === "assigned" ? "These job is closed" : status === "active" ? "Open for bids" : status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-bold px-3 py-1.5 rounded-full shrink-0">
                                        <FaStar size={11} className="text-amber-400" />
                                        4.8 <span className="text-amber-500 font-normal">(120)</span>
                                    </div>
                                </div>
                            </Section>

                            {/* ── Budget & Timeline ── */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard
                                    icon={FaDollarSign}
                                    iconBg="bg-green-100"
                                    iconColor="text-green-600"
                                    label="Budget Range"
                                    value={`$${minBudget.toLocaleString()} – $${maxBudget.toLocaleString()}`}
                                />
                                <StatCard
                                    icon={FaClock}
                                    iconBg="bg-blue-100"
                                    iconColor="text-blue-600"
                                    label="Project Timeline"
                                    value={timeline}
                                />
                            </div>

                            {/* ── Skills ── */}
                            <Section>
                                <SectionTitle icon={BsBriefcaseFill} iconBg="bg-blue-100" iconColor="text-blue-600">
                                    Skills Required
                                </SectionTitle>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[0.8rem] font-semibold border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Section>

                            {/* ── Description ── */}
                            <Section>
                                <SectionTitle icon={FaFileAlt} iconBg="bg-violet-100" iconColor="text-violet-600">
                                    Job Description
                                </SectionTitle>
                                <div
                                    className={`text-slate-600 text-[1rem] leading-relaxed overflow-hidden transition-all duration-500 ease-in-out
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul>li]:mb-1.5
                    ${showMore ? "max-h-[2000px] opacity-100" : "max-h-24 opacity-80"}`}
                                    dangerouslySetInnerHTML={{ __html: jobDescription }}
                                />
                                <button
                                    onClick={() => setShowMore((p) => !p)}
                                    className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                >
                                    {showMore
                                        ? <><FaChevronUp size={13} /> Show Less</>
                                        : <><FaChevronDown size={13} /> Show More</>}
                                </button>
                            </Section>

                            {/* ── Client Info ── */}
                            <Section>
                                <div className="flex items-center justify-between mb-5">
                                    <SectionTitle icon={FaUser} iconBg="bg-emerald-100" iconColor="text-emerald-600">
                                        About Client
                                    </SectionTitle>
                                    <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full -mt-5">
                                        <MdVerified size={15} /> Verified
                                    </span>
                                </div>

                                <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                                            <img
                                                src={clientId.profileImage?.url}
                                                alt={`${clientId.firstName} ${clientId.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                                    </div>

                                    {/* Details grid */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3 className="text-[16px] font-black text-slate-900 capitalize">
                                                {clientId.firstName} {clientId.lastName}
                                            </h3>
                                            <MdVerified className="text-blue-500 shrink-0" size={16} />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                                            {[
                                                { icon: FaBuilding, label: "Company", value: clientId.company },
                                                { icon: MdOutlineEmail, label: "Email", value: clientId.email },
                                                { icon: FaMapMarkerAlt, label: "Location", value: `${clientId.state}, ${clientId.country}` },
                                            ].map(({ icon: Icon, label, value }) => (
                                                <div key={label} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                        <Icon size={15} className="text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[0.9rem] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                                                        <p className="text-[0.9rem] font-semibold text-slate-700 truncate">{value}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Rating box */}
                                            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                                <div className="w-6 h-6 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                                                    <FaStar size={10} className="text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500">Rating</p>
                                                    <p className="text-[12px] font-semibold text-amber-700">
                                                        4.8 <span className="font-normal text-amber-500">(120 reviews)</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>

                      
                        {/* ══════════ RIGHT SIDEBAR — BID FORM ══════════ */}
                        <div className="sticky top-24 h-fit">
                            <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_12px_40px_rgba(79,107,255,0.13)] hover:border-blue-300 transition-all duration-300">

                                {/* Permanent top accent bar */}
                                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl
                                    ${status === "assigned"
                                        ? "bg-gradient-to-r from-red-500 to-rose-500"
                                        : "bg-gradient-to-r from-blue-500 to-violet-500"
                                    }`}
                                />

                                {/* Header */}
                                <div className="px-6 pt-7 pb-5 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm
                                                    ${status === "assigned"
                                                    ? "bg-red-500 shadow-red-200"
                                                    : "bg-blue-600 shadow-blue-200"
                                                }`}
                                        >
                                            <FaPaperPlane size={17} className="text-white" />
                                        </div>

                                        <div>
                                            <h2 className="text-[1.2rem] font-black text-slate-900 leading-tight">
                                                {status === "assigned" ? "Project Closed" : "Place Your Bid"}
                                            </h2>

                                            <p className="text-[1rem] text-slate-400 font-medium">
                                                {status === "assigned"
                                                    ? "This project has already been assigned"
                                                    : "Apply for this project now"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Closed State Message */}
                                {status === "assigned" && (
                                    <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-[13px] font-semibold text-red-600 leading-relaxed">
                                            🚫 Bidding is closed because the client has already assigned this project to another freelancer.
                                        </p>
                                    </div>
                                )}

                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className={`p-6 space-y-5 ${status === "assigned" ? "opacity-60 cursor-not-allowed" : ""
                                        }`}
                                >

                                    {/* Bid Amount */}
                                    <FormField
                                        label="Your Bid Amount"
                                        icon={FaDollarSign}
                                        error={errors.bid?.message}
                                    >
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <FaDollarSign size={15} />
                                            </span>

                                            <input
                                                type="number"
                                                disabled={status === "assigned"}
                                                {...register("bid", {
                                                    required: status !== "assigned"
                                                        ? "Bid amount is required"
                                                        : false,
                                                })}
                                                placeholder="Enter your bid"
                                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </FormField>

                                    {/* Timeline */}
                                    <FormField
                                        label="Delivery Timeline"
                                        icon={FaClock}
                                        error={errors.timeline?.message}
                                    >
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <FaClock size={15} />
                                            </span>

                                            <input
                                                type="text"
                                                disabled={status === "assigned"}
                                                {...register("timeline", {
                                                    required: status !== "assigned"
                                                        ? "Timeline is required"
                                                        : false,
                                                })}
                                                placeholder="E.g. 3 days, 2 weeks"
                                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </FormField>

                                    {/* Proposal Message */}
                                    <FormField
                                        label="Proposal Message"
                                        icon={FaFileAlt}
                                        error={errors.description?.message}
                                    >
                                        <textarea
                                            rows={5}
                                            disabled={status === "assigned"}
                                            {...register("description", {
                                                required: status !== "assigned"
                                                    ? "Proposal message is required"
                                                    : false,
                                                maxLength: 5000,
                                            })}
                                            placeholder="Explain why you're the best fit for this project..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white outline-none transition-all leading-relaxed disabled:bg-slate-100 disabled:cursor-not-allowed"
                                        />
                                    </FormField>

                                    {/* Divider */}
                                    <div className="border-t border-dashed border-slate-200" />

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || status === "assigned"}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-[13px] font-black transition-all duration-200 uppercase tracking-wider
          
          ${status === "assigned"
                                                ? "bg-red-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-blue-200 hover:shadow-lg cursor-pointer"
                                            }
          
          disabled:opacity-70`}
                                    >
                                        {status === "assigned" ? (
                                            <>Project Closed 🚫</>
                                        ) : isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-4 w-4 text-white"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    />
                                                </svg>

                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Submit Proposal <IoIosRocket size={17} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                );
            })}
        </>
    );
};

export default Detailed_gig;