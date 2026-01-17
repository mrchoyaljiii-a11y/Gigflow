import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AllBids = () => {
    const { gig_id } = useParams();
    const [openBid, setOpenBid] = useState(null);
    const [hired, setHired] = useState({
        index: null,
        hire: false,
        status: "pending"
    });


    const Handle_hire = (index) => {
        setHired(pre => {
            return {
                ...pre,
                index: index,
                hire: !pre.hire,
                status: pre.hire ? "pending" : "accepted",
                gigId: gig_id
            }
        }
        )
    }

    console.log(hired);




    const toggleMessage = (index) => {
        setOpenBid(openBid === index ? null : index);
    };

    const { AllBids, loading, error } = useSelector(
        (state) => state.BidSlice
    );

    const Bids_of_gig = AllBids.filter(
        (bid) => bid.gigId === gig_id
    );

    if (loading) {
        return <p className="text-center mt-10">Loading bids...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-24">

            {/* Header */}
            <div className="flex items-center gap-4 py-6">
                <NavLink
                    to="/my-gigs"
                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                >
                    <FaArrowLeft size={18} />
                </NavLink>

                <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                        Bid Details
                    </h2>
                    <p className="text-sm text-slate-500">
                        Gig ID: {gig_id}
                    </p>
                </div>
            </div>

            {/* Sub Header */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-lg font-semibold text-slate-800">
                        All Bids
                    </h1>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {Bids_of_gig.length} Total Bids
                    </span>
                </div>

                <p className="text-sm text-slate-600">
                    Compare bids and choose the best freelancer based on price and delivery time.
                </p>
            </div>

            {/* Table Head */}
            <div className="hidden md:grid grid-cols-3 px-6 py-3 text-xs font-semibold text-slate-500">
                <p className="bg bg-blue-100 text-blue-600 p-3">FREELANCER</p>
                <p className=" bg-blue-100 text-blue-600 p-3">BID</p>
                <p className="text-right bg-blue-100 text-blue-600 p-3">ACTION</p>
            </div>

            {/* Bid Cards */}
            <div className="space-y-4">
                {Bids_of_gig.map((bidItem, index) => {
                    const { bid, timeline, description, freelancerId, _id } = bidItem;

                    return (
                        <div
                            key={_id}
                            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
                        >
                            <div className="grid md:grid-cols-3 gap-4 items-center">

                                {/* Freelancer */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                                        { }
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            Freelancer #{freelancerId?.slice(-4)}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            ⭐ 4.5 (Demo Rating)
                                        </p>
                                    </div>
                                </div>

                                {/* Bid */}
                                <div>
                                    <p className="text-lg font-semibold text-primary">
                                        ${bid}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {timeline}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end items-center gap-3">
                                    <button
                                        onClick={() => toggleMessage(index)}
                                        className={`p-2 rounded-full hover:bg-slate-100 transition
                                        ${openBid === index ? "rotate-180" : ""}`}
                                    >
                                        <IoIosArrowDown size={20} />
                                    </button>

                                    <button

                                        onClick={() => {
                                            // handleHire(index);
                                            Handle_hire(index);
                                        }}

                                        className={`px-5 py-2 rounded-full text-sm font-medium transition

                                            ${hired.index === index
                                                ? "bg-green-600 text-white cursor-default"
                                                : hired.index !== null
                                                    ? "bg-red-100 text-red-600 cursor-pointer"
                                                    : "bg-primary text-white hover:bg-primary/90"
                                            }

                                         `}
                                    >
                                        {

                                            hired.index === index ? hired.hire ? "HIRED" : "REJECTED" : hired.index !== null ? "REJECTED" : "HIRE"
                                        }

                                    </button>

                                </div>
                            </div>

                            {/* Expandable Message */}
                            <div
                                className={`mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-600
                  transition-all duration-300 overflow-hidden
                  ${openBid === index ? "max-h-96" : "max-h-12"}`}
                            >
                                <p className={openBid === index ? "" : "line-clamp-2"}>
                                    {description}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {Bids_of_gig.length === 0 && (
                    <p className="text-center text-slate-500 py-10">
                        No bids received for this gig yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AllBids;
