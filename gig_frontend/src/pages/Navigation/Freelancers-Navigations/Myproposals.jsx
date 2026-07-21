import React, { useEffect, useMemo, useState } from 'react'
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { GetBidsByFreelancer, WithdrawBid } from '../../../redux/Bid/Bid_slice';
import { MdKeyboardArrowRight } from "react-icons/md";
import { useGetSpecificFreelancerBids } from '../../../hooks/Bid_releted/useGetSpecificFreelancerBids.js';
const Myproposals = () => {
    const [filter, setFilter] = useState("all");

    const { user } = useSelector((state) => state.auth);
    // console.log("freelancerId", user?._id);

    const {
        data: bids,
        isLoading,
        isError,
        error,
    } = useGetSpecificFreelancerBids(user?._id);

    // console.log("bids in freelancer ", bids?.bids_by_freelancer);

    const Allbids = bids?.bids_by_freelancer || [];

    console.log("All bids", Allbids)


    const getStatus = (status) => {
        // console.log("bid", bid._id);
        if (status === "pending") {
            return "Pending";
        } else if (status === "hired") {
            return "Accepted";
        } else if (status === "rejected") {
            return "Rejected";
        } else if (status === "withdraw") {
            return "Withdraw";
        }
    };


    const filterdBids = useMemo(() => {
        if (filter === "all") return Allbids;

        const statusMap = {
            accepted: "hired",
        };

        const actualStatus = statusMap[filter] || filter;

        return Allbids.filter(
            (bid) => bid.status === actualStatus
        );
    }, [filter, Allbids]);

    console.log("filterd bids ", filterdBids);

    if (isLoading) {
        return (
            <div className="text-center py-10">
                Loading proposals...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 py-10">
                {error.message}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">My Proposals <span>({Allbids.length})</span></h1>

                {/* Filters */}
                <div className="flex gap-2">

                    {["all", "pending", "accepted", "rejected", "withdraw"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                                ${filter === type
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }  

                               `}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gig Cards */}

            <div className="space-y-4">
                {filterdBids.length === 0 ? (
                    <p className="text-center text-slate-500">No proposals found.</p>
                ) : (
                    filterdBids?.map((bid) => {
                        const {
                            bid: bid_by_freelancer,
                            status,
                            _id: bid_id,
                            contractId,
                            gigId,
                        } = bid;

                        const {
                            jobtitle,
                            projectCategory,
                            timeline,
                            jobDescription,
                            minBudget,
                            maxBudget,
                            _id: gigIdValue,
                        } = gigId;


                        const updatedStatus = getStatus(status);

                        return (
                            <div className="bg-surface-container-lowest p-6 rounded-xl hover:bg-surface-bright transition-all duration-300 group hover:shadow-[0_8px_24px_-4px_rgba(25,28,30,0.04)] shadow-sm"
                                key={bid_id}>
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">

                                        {/* status + category */}
                                        <div className="flex items-center gap-3">

                                            <span className={`bg-[#FFECB3] text-[#5F4900] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider  ${updatedStatus === "Pending"
                                                ? "bg-amber-100 text-amber-700"
                                                : updatedStatus === "Accepted"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700"
                                                } `}>{updatedStatus}</span>

                                            <span className="text-on-surface-variant text-sm font-medium">{projectCategory}</span>
                                        </div>

                                        {/* title */}
                                        <div>
                                            <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{jobtitle}</h3>
                                        </div>

                                        {/* description */}
                                        <div
                                            className="text-slate-600 text-sm line-clamp-2 mb-4"
                                            dangerouslySetInnerHTML={{ __html: jobDescription }}
                                        ></div>


                                        {/* budget */}
                                        <div className="flex flex-wrap gap-6 items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-outline tracking-wider">Client Budget</span>
                                                <span className="text-on-surface font-semibold">${`${minBudget}-${maxBudget}`}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-outline tracking-wider">Your Bid</span>
                                                <span className="text-primary font-bold">${bid_by_freelancer}</span>
                                            </div>

                                        </div>

                                    </div>

                                    {/* buttons */}
                                    <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                        {status === "hired" ? (
                                            <NavLink
                                                to={`/contracts/${contractId}`}
                                                className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold text-center"
                                            >
                                                View Contract
                                            </NavLink>
                                        ) : (
                                            <button
                                                disabled
                                                className="bg-slate-200 text-slate-500 px-5 py-2.5 rounded-full text-sm font-bold cursor-not-allowed"
                                            >
                                                No Contract
                                            </button>
                                        )}
                                        <NavLink to={`/home/freelancer/detailed-bid/${bid_id}`} className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 hover:text-slate-800 transition-all border">View Bid Details</NavLink>
                                        <button className={`text-red-500 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-300/20 hover:text-red-container/20 transition-all ${status === "rejected" || status === "withdraw" ? "hidden" : ""} border`}
                                            onClick={() => {
                                                const data = {
                                                    bidId: bid_id,
                                                    gigId: _id,
                                                };
                                                dispatch(WithdrawBid(data));

                                            }}
                                        >Withdraw</button>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                )
                }
            </div>

        </div>
    );
}

export default Myproposals
