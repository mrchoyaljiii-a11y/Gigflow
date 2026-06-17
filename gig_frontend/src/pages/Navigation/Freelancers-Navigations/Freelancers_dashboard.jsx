import React, { useEffect, useState } from 'react'
import { MdOutlineWorkHistory } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from 'react-router-dom';

import { GetBidsByFreelancer } from '../../../redux/Bid/Bid_slice';
import { GetHiredByFreelancer } from '../../../redux/hired_freelancer/hired_freelancer';
import ProfileStrenght from '../../../components/ProfileStrenght';

const Freelancers_dashboard = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    // console.log("user in freelancer dashboard", user)

    const { BidsByFreelancer } = useSelector((state) => state.BidSlice);
    // console.log("bids_by_freelancer in freelancer dashboard", BidsByFreelancer);


    // const { hiredRecodrs } = useSelector((state) => state.hired_slice);
    // console.log("hiredRecodrs in freelancer dashboard", hiredRecodrs);

    const HiredCount = BidsByFreelancer.filter((bid) => bid.status === "hired").length;
    const ViewdCount = BidsByFreelancer.reduce(
        (total, bid) => total + (bid.viewd?.views || 0),
        0
    );

    // console.log("ViewdCount in freelancer dashboard", ViewdCount);
    useEffect(() => {
        if (user && user._id) {
            dispatch(GetBidsByFreelancer(user._id));
            dispatch(GetHiredByFreelancer(user._id));
        }
    }, [user, dispatch]);

    const getStatus = (bid) => {
        // console.log("bid", bid._id);
        if (bid.status === "pending") {
            return "Pending";
        } else if (bid.status === "hired") {
            return "Accepted";
        } else if (bid.status === "rejected") {
            return "Rejected";
        } else if (bid.status === "withdraw") {
            return "Withdraw";
        }
    };

    const StatsOverview = [
        {
            heading: "Proposals Sent",
            data: BidsByFreelancer.length,
        },
        {
            heading: "Viewed by Clients",
            data: ViewdCount,
        },
        {
            heading: "Hired",
            data: HiredCount,
        },
        {
            heading: "Active Jobs",
            data: 1,
        },
        {
            heading: "Total Earnings",
            data: 12.5,
        }
    ]

    return (
        <div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                <div className="grid grid-cols-12 gap-8">
                    {/*  Main Content Area  */}
                    <div className="col-span-12 lg:col-span-8 space-y-8 ">

                        {/*  Welcome Hero  */}
                        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-white   
                         border border-primary/10 p-8">
                            <div className="relative z-10 max-w-lg">
                                <h1 className="text-3xl font-extrabold text-slate-900  mb-3">👋 Hi {user?.firstName || "Freelancer"}, Ready to land your next project?</h1>
                                <p className="text-slate-600  mb-6 text-lg">Your profile performance is up by 15% this week. Check out the latest opportunities curated just for you.</p>
                                <div className="flex flex-wrap gap-3">
                                    <NavLink to={`/home/explore`} className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Browse Jobs</NavLink>
                                    <NavLink to={`/home`} className="px-6 py-2.5 bg-white  text-slate-700  font-bold rounded-lg border border-slate-200  hover:bg-slate-50 transition-all">Complete Profile</NavLink>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden md:block">
                                <span className=" text-[200px] text-primary translate-x-10"><MdOutlineWorkHistory /></span>
                            </div>
                        </section>

                        {/*  Stats Overview */}
                        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {
                                StatsOverview.map((item) => {
                                    return (
                                        <div className="bg-white  p-5 rounded-xl border border-slate-200  shadow-sm">
                                            <p className="text-sm text-slate-500  font-medium">{item.heading}</p>
                                            <div className="flex items-end justify-between mt-1">
                                                <h3 className="text-2xl font-bold">{item.data}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </section>

                        {/*  Sent Proposals Section */}
                        <section className="bg-white  p-6 rounded-xl border border-slate-200  shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary bg-blue-50 p-3 rounded-xl text-center"><IoMdSend /></span>
                                    Sent Proposals
                                </h2>
                            </div>

                          {
                            BidsByFreelancer.length > 0 ? (
                                   <table className="w-full text-left border-collapse table-fixed">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-[40%]">
                                            Job Title
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-[20%]">
                                            Date Sent
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-[20%]">
                                            Budget
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-[20%]">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {BidsByFreelancer?.map((bid) => {
                                        const status = getStatus(bid);
                                        const createdAt = new Date(bid.createdAt);
                                        const formattedDate = createdAt.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });

                                        return (
                                            <tr key={bid._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-sm truncate">
                                                        {bid.gigId?.jobtitle}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {bid.gigId?.projectCategory}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {formattedDate}
                                                </td>

                                                <td className="px-6 py-4 text-sm font-semibold">
                                                    ${bid.bid}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2.5 py-1 text-xs font-bold rounded-full 
                                                                 ${status === "Pending"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : status === "Accepted"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-red-100 text-red-700"
                                                            } flex items-center w-fit gap-1`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full 
                                                                       ${status === "Pending"
                                                                    ? "bg-amber-600"
                                                                    : status === "Accepted"
                                                                        ? "bg-blue-600"
                                                                        : "bg-red-600"
                                                                }`}
                                                        ></span>
                                                        {status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            ):(
                                <div className="text-center py-10">
                                    <p className="text-slate-500 text-lg pb-3">You haven't sent any proposals yet. Start exploring jobs and send your first proposal!</p>
                                    
                                    <NavLink to="/home/explore">
                                        <span className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4 cursor-pointer">Browse Jobs</span>
                                    </NavLink>

                                </div>
                            )
                          }

                        </section>
                    </div>

                    {/*  Sidebar  */}
                    <aside className="col-span-12 lg:col-span-4 space-y-8">
                       
                        {/*  Profile Strength  */}

                   <ProfileStrenght />

                    </aside>

                </div>

            </main>
        </div>
    )
}

export default Freelancers_dashboard
