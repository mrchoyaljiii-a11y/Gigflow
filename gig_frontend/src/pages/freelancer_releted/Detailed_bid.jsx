// ?these is the detailed bid page for the freelancer where they can see the details of their bid and the job post they applied for and many more.
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { GetBidsByFreelancer } from '../../redux/Bid/Bid_slice';

import { IoMdArrowRoundBack } from "react-icons/io";
import { MdCalendarToday, MdPayments, MdSend, MdCorporateFare, MdOutlineSchedule, MdEdit } from "react-icons/md";

const Detailed_bid = () => {
    const { bid_id } = useParams();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user._id) {
            dispatch(GetBidsByFreelancer(user._id));
        }
    }, [user, dispatch]);

    const { BidsByFreelancer } = useSelector((state) => state.BidSlice);

    console.log("bids_by_freelancer in detailed bid page", BidsByFreelancer);

    const FilterBidById = () => BidsByFreelancer.filter((bid) => bid._id === bid_id);

    // console.log("filtered bid", FilterBidById());

    return (
        <main className=" pb-12 px-6 max-w-7xl mx-auto">

            {/* back to proposals */}

            <div className="flex items-center gap-3 mb-4">

                <a className="flex items-center gap-1 text-on-surface-variant text-sm font-medium hover:text-primary transition-colors" href="#">

                    <span className="material-symbols-outlined text-sm"><IoMdArrowRoundBack size={20} /></span>
                    Back to Proposals
                </a>
            </div>

            {
                FilterBidById().map((bid) => {
                    const { bid: bid_by_freelancer, description, status, _id: bid_id, timeline: freelancer_timeline, gigId: { jobtitle, projectCategory, timeline, _id, jobDescription, minBudget, maxBudget, skills, clientId } } = bid;
                    const createdAt = new Date(bid.createdAt);
                    const formattedDate = createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
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
                                            : status === "hired"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>
                                            {status}
                                        </span>

                                        <div className="flex items-center gap-2 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-lg"><MdCalendarToday /></span>

                                            <span className="text-sm font-medium">{formattedDate}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-lg"><MdPayments /></span>
                                            <span className="text-sm font-medium">Est. Budget: {`$${minBudget} - $${maxBudget}`}</span>
                                        </div>

                                    </div>

                                </div>

                                <div className="flex items-center gap-3">
                                    <button className={`px-6 py-3 rounded-xl font-bold text-red-600 border border-error/20 bg-error-container/10 hover:bg-red-500/10 active:bg-error-container/20 transition-all ${status === "withdraw" ? "hidden" : ""} cursor-pointer`}>
                                        Withdraw Bid
                                    </button>

                                    <button className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                                        <span className="material-symbols-outlined text-lg"><MdSend /></span>
                                        Message Client
                                    </button>

                                </div>

                            </div>

                            {/* Asymmetric Bento-style Layout  */}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column: Original Job Post (8 Cols)  */}

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
                                                <h4 className="font-headline font-bold text-xl text-on-surface">{clientId.company}</h4>
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

                                {/* Right Column: Proposal Sidebar (4 Cols)  */}

                                <aside className="lg:col-span-4 space-y-6">
                                    {/* Submission Details Card  */}
                                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,30,0.04)] border border-outline-variant/10">
                                        <h2 className="font-headline text-xl font-bold text-on-surface mb-8">Your Submission</h2>
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl">
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bid Amount</p>
                                                    <p className="text-3xl font-black text-primary tracking-tight mt-1">${bid_by_freelancer}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Platform Fee</p>
                                                    <p className="text-sm font-bold text-on-surface-variant">-$320.00</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/40 flex items-center justify-center rounded-xl">
                                                    <span className="material-symbols-outlined text-secondary text-2xl"><MdOutlineSchedule /></span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Proposed Timeline</p>
                                                    <p className="text-lg font-bold text-on-surface">{freelancer_timeline} Delivery</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cover Letter</p>

                                                <div className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low/50 p-5 rounded-xl border-l-4 border-primary/20 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                                                    dangerouslySetInnerHTML={{ __html: description }}>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-outline-variant/10 flex flex-col gap-3">
                                            <button className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300/80 text-on-surface font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined text-lg"><MdEdit /></span>
                                                Edit Proposal
                                            </button>
                                        </div>
                                    </div>

                                    {/* Milestone Timeline (System Custom Component)  */}

                                    <div className="bg-gray-200/40 p-8 rounded-xl">
                                        <h3 className="font-headline font-bold text-lg text-on-surface mb-6">Payment Milestones</h3>
                                        <div className="space-y-6 relative">

                                            {/* Custom Dots Timeline  */}

                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center">

                                                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
                                                    <div className="w-0.5 h-12 bg-gray-400"></div>
                                                </div>
                                                <div className="flex-1 -mt-1">
                                                    <p className="text-sm font-bold text-on-surface">Initial UI Design &amp; Prototype</p>
                                                    <p className="text-xs font-medium text-on-surface-variant">$800.00 • 25%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
                                                    <div className="w-0.5 h-12 bg-surface-container-highest"></div>
                                                </div>
                                                <div className="flex-1 -mt-1">
                                                    <p className="text-sm font-bold text-on-surface-variant">Core Integration &amp; Data Link</p>
                                                    <p className="text-xs font-medium text-on-surface-variant">$1,200.00 • 37.5%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
                                                </div>
                                                <div className="flex-1 -mt-1">
                                                    <p className="text-sm font-bold text-on-surface-variant">Final QA &amp; Handover</p>
                                                    <p className="text-xs font-medium text-on-surface-variant">$1,200.00 • 37.5%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                        </div>
                    )
                })
            }

        </main>
    )
}

export default Detailed_bid


