import React, { useEffect, useState } from 'react'
import { CiLocationOn, CiMail, CiBookmarkCheck } from "react-icons/ci";
import { FaMoneyCheckDollar, FaRegMessage, FaLinkedin, FaLanguage } from "react-icons/fa6";
import { FaRegUser, FaBriefcase } from "react-icons/fa";
import { MdOutlinePsychology, MdOutlineVerified, MdOutlineNorthEast, MdMarkEmailRead, MdOutlineSchool } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpecificFreelancer } from '../../redux/getUser/User'

const View_freelancer_profile = () => {
    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        if (id) dispatch(fetchSpecificFreelancer(id))
    }, [id, dispatch])

    const { sepecificFreelancerData, loading, error } = useSelector((state) => state.userSlice)

    if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>
    if (!sepecificFreelancerData) return <p className="text-center py-20 text-gray-500">No data found.</p>

    const {
        firstName, lastName, professionalTitle,
        country, state,
        email, experienceLevel,
        freelanerSkills, languages,
        linkedInLink, websitelink,
        profileSummary, profileImage,
        rate, hourlyRate,
        workExperience, education,
    } = sepecificFreelancerData

    // support both `rate` and `hourlyRate` field names
    const displayRate = hourlyRate ?? rate


    const [showFullSummary, setShowFullSummary] = useState(false)
    
    const SUMMARY_LIMIT = 300  // chars shown when collapsed
    const summaryIsTruncatable = profileSummary && profileSummary.length > SUMMARY_LIMIT
    const visibleSummary = showFullSummary || !summaryIsTruncatable
        ? profileSummary
        : profileSummary.slice(0, SUMMARY_LIMIT).trimEnd() + '...'


    // formats month + year range string
    const dateRange = (startMonth, startYear, endMonth, endYear, currentRole) =>
        `${startMonth} ${startYear} – ${currentRole ? 'Present' : `${endMonth} ${endYear}`}`

    // proficiency badge colour
    const proficiencyColor = (level = '') => {
        const l = level.toLowerCase()
        if (l === 'native')       return 'bg-green-100 text-green-700'
        if (l === 'fluent')       return 'bg-blue-100 text-blue-700'
        if (l === 'conversational') return 'bg-yellow-100 text-yellow-700'
        return 'bg-gray-100 text-gray-600'
    }

    return (
        <div>
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Hero card ── */}
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">

                        {/* avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="size-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-primary/10">
                                <img className="w-full h-full object-cover" src={profileImage?.url} alt={`${firstName} ${lastName}`} />
                            </div>
                            <div className="absolute bottom-1 right-2 size-6 bg-green-500 border-4 border-white rounded-full" title="Available for work" />
                        </div>

                        {/* info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold text-[#0f172a] capitalize">{firstName} {lastName}</h1>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Top Rated</span>
                            </div>
                            <p className="text-xl font-semibold text-primary mb-3 capitalize">{professionalTitle}</p>

                            <div className="flex flex-wrap gap-5 text-[#64748b]">
                                {/* location */}
                                <div className="flex items-center gap-1.5">
                                    <CiLocationOn className="text-lg text-primary" />
                                    <span className="text-sm font-medium capitalize">{country}, {state}</span>
                                </div>

                                {/* rate */}
                                <div className="flex items-center gap-1.5">
                                    <FaMoneyCheckDollar className="text-lg text-primary" />
                                    <span className="text-sm font-medium">${displayRate} / hr</span>
                                </div>

                                {/* experience level */}
                                <div className="flex items-center gap-1.5">
                                    <MdOutlineVerified className="text-lg" />
                                    <span className="text-sm font-medium capitalize">{experienceLevel}</span>
                                </div>

                                <div className="w-px bg-gray-200 self-stretch" />

                                {/* languages — now objects {languageName, proficiency} */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <FaLanguage size={22} className="text-primary" />
                                    {Array.isArray(languages) && languages.map((lang, i) => (
                                        <span key={i} className="text-sm font-medium">
                                            {/* handle both string and object shapes */}
                                            {typeof lang === 'string' ? lang : lang.languageName}
                                            {typeof lang === 'object' && lang.proficiency && (
                                                <span className="text-xs text-gray-400 ml-1">({lang.proficiency})</span>
                                            )}
                                            {i < languages.length - 1 && ','}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* shortlist btn */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button className="px-6 py-3 bg-[#f1f5f9] text-[#0f172a] font-bold rounded-lg hover:bg-[#e2e8f0] transition-all flex items-center gap-2.5">
                                <CiBookmarkCheck size={20} /> Save to shortlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ════ Left column ════ */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Professional Summary */}
                        <section className="bg-white rounded-xl border border-[#e2e8f0] p-8">
                            <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                                <FaRegUser className="text-primary" /> Professional Summary
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

                        {/* Skills */}
                        <section className="bg-white rounded-xl border border-[#e2e8f0] p-8">
                            <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                                <MdOutlinePsychology size={26} className="text-primary" /> Skills &amp; Expertise
                            </h3>
                            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-4">Core Tech Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(freelanerSkills) && freelanerSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-primary/5 border border-primary/20 text-primary font-semibold rounded-lg text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Work Experience */}
                        {Array.isArray(workExperience) && workExperience.length > 0 && (
                            <section className="bg-white rounded-xl border border-[#e2e8f0] p-8">
                                <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                                    <FaBriefcase className="text-primary" /> Work Experience
                                </h3>
                                <div className="space-y-6">
                                    {workExperience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-primary/20 last:border-l-transparent">
                                            {/* dot on timeline */}
                                            <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-white border-2 border-primary" />

                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                                                <h4 className="font-bold text-[#0f172a] capitalize">{exp.title}</h4>
                                                <span className="text-xs text-[#94a3b8] whitespace-nowrap">
                                                    {dateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.currentRole)}
                                                </span>
                                            </div>

                                            <p className="text-sm font-semibold text-primary mb-2 capitalize">
                                                {exp.company}
                                                {exp.city && <span className="text-[#64748b] font-normal"> · {exp.city}{exp.country ? `, ${exp.country}` : ''}</span>}
                                            </p>

                                            {exp.description && (
                                                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {Array.isArray(education) && education.length > 0 && (
                            <section className="bg-white rounded-xl border border-[#e2e8f0] p-8">
                                <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                                    <MdOutlineSchool size={26} className="text-primary" /> Education
                                </h3>
                                <div className="space-y-6">
                                    {education.map((edu, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-primary/20 last:border-l-transparent">
                                            {/* dot on timeline */}
                                            <div className="absolute -left-[9px] top-1.5 size-4 rounded-full bg-white border-2 border-primary" />

                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                                                <h4 className="font-bold text-[#0f172a] capitalize">{edu.school}</h4>
                                                {(edu.fromYear || edu.toYear) && (
                                                    <span className="text-xs text-[#94a3b8] whitespace-nowrap">
                                                        {edu.fromYear} – {edu.toYear}
                                                    </span>
                                                )}
                                            </div>

                                            {(edu.degree || edu.field) && (
                                                <p className="text-sm font-semibold text-primary mb-2 capitalize">
                                                    {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                                                </p>
                                            )}

                                            {edu.description && (
                                                <p className="text-sm text-[#475569] leading-relaxed">{edu.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {Array.isArray(languages) && languages.length > 0 && (
                            <section className="bg-white rounded-xl border border-[#e2e8f0] p-8">
                                <h3 className="text-xl font-extrabold text-[#0f172a] mb-6 flex items-center gap-2">
                                    <FaLanguage size={22} className="text-primary" /> Languages
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {languages.map((lang, i) => {
                                        const name  = typeof lang === 'string' ? lang : lang.languageName
                                        const level = typeof lang === 'object'  ? lang.proficiency : null
                                        return (
                                            <div key={i} className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-4 py-2.5">
                                                <span className="font-semibold text-[#0f172a] text-sm capitalize">{name}</span>
                                                {level && (
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${proficiencyColor(level)}`}>
                                                        {level}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* ════ Right column (sidebar) ════ */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-6">

                            {/* Action buttons */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
                                <div className="space-y-3">
                                    <button className="w-full py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                        <IoBagOutline size={20} /> Hire {firstName}
                                    </button>
                                    <button className="w-full py-3.5 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                                        <FaRegMessage size={18} /> Message
                                    </button>
                                    <button className="w-full py-3.5 bg-[#f8fafc] text-[#0f172a] font-bold rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-all flex items-center justify-center gap-2">
                                        <CiMail size={20} /> Invite to Job
                                    </button>
                                </div>

                                {/* Hourly rate highlight */}
                                <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                                    <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Hourly Rate</p>
                                    <p className="text-3xl font-extrabold text-primary">${displayRate}<span className="text-base font-semibold text-[#64748b]">/hr</span></p>
                                </div>

                                {/* External Links */}
                                <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
                                    <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-4">External Links</p>
                                    <div className="space-y-2">

                                        {/* LinkedIn */}
                                        {linkedInLink && (
                                            <a href={linkedInLink} target="_blank" rel="noreferrer"
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f8fafc] transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5]">
                                                        <FaLinkedin />
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#475569]">LinkedIn Profile</span>
                                                </div>
                                                <MdOutlineNorthEast className="text-xl text-gray-400" />
                                            </a>
                                        )}

                                        {/* Website */}
                                        {websitelink && websitelink.length > 0 && (
                                            <a href={websitelink} target="_blank" rel="noreferrer"
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f8fafc] transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <CgWebsite />
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#475569]">Personal Website</span>
                                                </div>
                                                <MdOutlineNorthEast className="text-xl text-gray-400" />
                                            </a>
                                        )}

                                        {/* Email */}
                                        {email && (
                                            <a href={`mailto:${email}`}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f8fafc] transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5]">
                                                        <MdMarkEmailRead />
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#475569] truncate max-w-[140px]">{email}</span>
                                                </div>
                                                <MdOutlineNorthEast className="text-xl text-gray-400" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats card */}
                            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-[#0f172a] mb-4">Profile Stats</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="text-[#64748b]">Job Success Score</span>
                                            <span className="font-bold text-primary">98%</span>
                                        </div>
                                        <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '98%' }} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-tighter">Total Jobs</p>
                                            <p className="text-lg font-extrabold text-[#0f172a]">47</p>
                                        </div>
                                        <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-tighter">Hours Worked</p>
                                            <p className="text-lg font-extrabold text-[#0f172a]">1.2k+</p>
                                        </div>
                                    </div>

                                    {/* Experience level badge */}
                                    <div className="pt-2 border-t border-[#e2e8f0]">
                                        <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-tighter mb-2">Experience Level</p>
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full capitalize">
                                            {experienceLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default View_freelancer_profile