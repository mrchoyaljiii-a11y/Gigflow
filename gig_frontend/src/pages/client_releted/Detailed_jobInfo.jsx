import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCalendarToday, MdPayments, MdSend, MdCorporateFare, MdOutlineSchedule, MdEdit } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Detailed_jobInfo = () => {
    const { Clientjobs, loading, error } = useSelector((state) => state.job);

    const { job_id } = useParams();
    const job = Clientjobs.find(job => job._id === job_id);

    if (loading) {
        return <p className="text-center mt-10">Loading gigs...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!job) {
        return <div>Job not found</div>;
    }

    const { jobtitle, projectCategory, timeline, _id, jobDescription, minBudget, maxBudget, skills, clientId, createdAt, status, contractId } = job;

    return (
        <div key={_id}>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-3xl">

                    <h1 className="font-headline font-bold text-4xl text-on-surface tracking-tight leading-tight">
                        {jobtitle}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-6">

                        <span className={`bg-[#FFECB3] text-[#5F4900] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : status === "active"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {status}
                        </span>

                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg"><MdCalendarToday /></span>

                            <span className="text-sm font-medium">{createdAt.split("T")[0]}</span>
                        </div>

                        <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-lg"><MdPayments /></span>
                            <span className="text-sm font-medium">Est. Budget: {`$${minBudget} - $${maxBudget}`}</span>
                        </div>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    {
                        status === "assigned" && contractId ? (
                            <NavLink to={`/contracts/${contractId}`}>
                                <button className="text-primary border border-primary text-sm font-bold hover:bg-primary/10 transition-all px-6 py-3 rounded-xl cursor-pointer">View Contract</button>
                            </NavLink>
                        ) : ""

                    }
                    <button className={`px-6 py-3 rounded-xl font-bold text-red-600 border text-sm hover:bg-red-500/10 transition-all ${status === "withdraw" ? "hidden" : ""} cursor-pointer`}>
                        Demo btn now
                    </button>
                </div>

            </div>

            {/* Asymmetric Bento-style Layout  */}

            <div className="">

                <div className="lg:col-span-8 space-y-8">
                    {/* Detailed Description Card  */}
                    <section className="bg-gray-200/60 p-8 rounded-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="font-headline text-2xl font-bold text-on-surface">Client's Job Requirements</h2>

                            <span className="font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-highest px-3 py-1 rounded-lg">{projectCategory}</span>
                        </div>

                        <div className="space-y-6 text-on-surface-variant leading-relaxed font-body [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                            dangerouslySetInnerHTML={{ __html: jobDescription }}>

                        </div>
                        {/* Skills Required  */}
                        <div className="mt-10">
                            <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Required Skills &amp; Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {
                                    skills.map((skill) => {
                                        return (
                                            <span className="bg-white text-primary font-semibold px-4 py-2 rounded-xl text-sm shadow-sm" key={_id}>{skill}</span>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    {/* Client Info Tonal Card  */}
                    <section className="bg-white p-8 rounded-xl border border-outline-variant/10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-3xl"><MdCorporateFare /></span>
                            </div>
                            <div>
                                <h4 className="font-headline font-bold text-xl text-on-surface">{clientId.company?.name}</h4>
                                <p className="text-on-surface-variant text-sm">{clientId.country}, {clientId.state}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                    <span className="text-sm font-bold text-on-surface">4.9</span>
                                    <span className="text-on-surface-variant text-sm ml-1">(24 reviews)</span>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Budget</p>
                                    <p className="text-lg font-bold text-primary">${maxBudget} max</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Location</p>
                                    <p className="text-lg font-bold text-on-surface">Remote</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

            </div>

        </div>
    )
}

export default Detailed_jobInfo
