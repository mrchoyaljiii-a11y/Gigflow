// in these a client see all the bids by the freelancers
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes, FaUserTie } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UpdateJob } from '../../redux/slices/job_slice.js';
import { SubmitHired } from '../../redux/hired_freelancer/hired_freelancer.js';
import { GetHiredJOb } from '../../redux/hired_freelancer/hired_freelancer.js';
import { UpdateBidStatus, IncrementBidView, GetBidsByFreelancer } from '../../redux/Bid/Bid_slice.js';
import { HandleView } from "../../redux/Notification_actions/Notifications_actions.js";

import { useCreateContract } from '../../hooks/useCreateContract.js';

const ConfirmHire = ({
    setOpenModel,
    onHire,
    hireLoading,
    freelancer,
    project
}) => {
    return (
        <>
            {/* Backdrop — blocked while loading */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => !hireLoading && setOpenModel(false)}
            />

            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b">
                        <h2 className="text-2xl font-bold">Confirm Hiring</h2>
                        <button
                            disabled={hireLoading}
                            onClick={() => setOpenModel(false)}
                            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:opacity-40"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Freelancer info */}
                        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                            {freelancer?.avatar ? (
                                <img
                                    src={freelancer.avatar}
                                    alt=""
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaUserTie size={24} />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{freelancer?.name}</h3>
                                <p className="text-slate-500">You are about to hire this freelancer.</p>
                            </div>
                        </div>

                        {/* Contract details */}
                        <div className="border rounded-2xl overflow-hidden">
                            <div className="bg-slate-50 px-5 py-3 border-b">
                                <h3 className="font-semibold">Contract Details</h3>
                            </div>
                            <div className="p-5 grid md:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-sm text-slate-500">Project</p>
                                    <p className="font-medium">{project?.jobtitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Agreed Price</p>
                                    <p className="font-semibold text-green-600">${project?.agreedPrice}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Timeline</p>
                                    <p className="font-medium">{project?.timeline || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Contract Type</p>
                                    <p className="font-medium">{project?.contractType || "Fixed"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm text-amber-800">
                                Hiring this freelancer will create a contract
                                and lock this project to the selected freelancer.
                            </p>
                        </div>

                        {/* ✅ Loading state — only visible while contract is creating */}
                        {hireLoading && (
                            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">
                                        Creating your contract...
                                    </p>
                                    <p className="text-xs text-blue-600 mt-0.5">
                                        Please don't close this window
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-5 border-t bg-slate-50">
                        <button
                            disabled={hireLoading}
                            onClick={() => setOpenModel(false)}
                            className="px-5 py-2 rounded-xl border disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onHire}
                            disabled={hireLoading}
                            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                        >
                            {hireLoading
                                ? <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Contract...
                                </>
                                : "Hire Freelancer"
                            }
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

const AllBids = () => {

    const [openModel, setOpenModel] = useState(false);

    const [selectedBid, setSelectedBid] = useState(null);

    // const [hireLoading, setHireLoading] = useState(false);

    const [viewedBids, setViewedBids] = useState(new Set());

    const dispatch = useDispatch();

    const { gig_id } = useParams();

    const nevigate = useNavigate();


    //  React Query mutation for contract creation
    const {
        mutateAsync: createContract,
        isPending: contractCreating
    } = useCreateContract();


    useEffect(() => {
        dispatch(GetHiredJOb(gig_id));
        // dispatch()
    }, [gig_id, dispatch]);

    const hiredData = useSelector(state => state.hired_slice.data);

    // console.log("hired data ", hiredData);

    const [openBid, setOpenBid] = useState(null);

    const [hired, setHired] = useState({
        index: null,
        hire: false,
        status: null,
        gigId: gig_id,
    });

    const { Clientjobs } = useSelector((state) => state.job);
    // console.log("Clientjobs in all bids", Clientjobs);

    const filtered_job = Clientjobs.filter(
        (job) => job._id === gig_id
    );

    console.log("filtered_job", filtered_job)

    const { AllBids, loading, error } = useSelector(
        (state) => state.BidSlice
    );

    const Bids_of_gig = AllBids.filter(
        (bid) => bid.gigId === gig_id
    );

    // console.log("Bids_of_gig", Bids_of_gig);
    const Handle_hire = async () => {


        if (!selectedBid) return;

        // setHireLoading(true);

        const { bidItem, index } = selectedBid;

        const freelancerId = bidItem.freelancerId._id;

        const freelancerName =
            `${bidItem.freelancerId.firstName} ${bidItem.freelancerId.lastName}`;

        try {

            setHired({
                index,
                hire: true,
                status: "hired",
                freelancerId
            });

            await dispatch(
                UpdateJob({
                    gigId: gig_id,
                    status: "assigned",
                    freelancerId
                })
            ).unwrap();

            await dispatch(
                SubmitHired({
                    jobId: gig_id,
                    freelancerId,
                    freelancerName,
                    bidId: bidItem._id,
                    clientid: bidItem.clientId,
                    clientCompanyName:
                        filtered_job[0]?.clientId?.company,
                    clientName:
                        `${filtered_job[0]?.clientId?.firstName}
                    ${filtered_job[0]?.clientId?.lastName}`,
                    agreedPrice: bidItem.bid,
                    gigName: filtered_job[0]?.jobtitle,
                    hiredStatus: "hired",
                    contractType: filtered_job[0]?.BudgetType,
                })
            ).unwrap();

            //create contract for the hired freelancer
            const result = await createContract({
                jobId: gig_id,
                bidId: bidItem._id,
                freelancerId,
                clientCompanyName: filtered_job[0]?.clientId?.company,
                agreedPrice: bidItem.bid,
                timeline: bidItem.timeline,
                gigName: filtered_job[0]?.jobtitle,
                contractType: filtered_job[0]?.BudgetType,
            });

            console.log("Contract created successfully:", result);

            setOpenModel(false);

            setSelectedBid(null);

            nevigate(`/contracts/${result.contract._id}`);

        } catch (error) {

            console.error("Hiring Failed", error);

            setHired({
                index: null,
                hire: false,
                status: null,
                freelancerId: null
            });

        }
    };
    // console.log("DATA IN ALL BIDS", hired);

    const toggleMessage = (index, bidId) => {
        const freelancerId = Bids_of_gig[index].freelancerId._id;

        const clientID = filtered_job[0]?.clientId?._id;

        const ViewdData = {
            freelancerId,
            clientID,
            bidId
        }
        // console.log("freelancerId", freelancerId, "clientID", clientID);
        const isOpening = openBid !== index;

        setOpenBid(isOpening ? index : null);

        if (isOpening && !viewedBids.has(bidId)) {
            dispatch(IncrementBidView(ViewdData));
            setViewedBids(prev => new Set(prev).add(bidId));
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading bids...</p>;
    }

    if (!hiredData) {
        // return <p className="text-center text-red-500 mt-10 text-4xl">loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-24">

            {
                openModel &&
                selectedBid && (
                    <ConfirmHire
                        setOpenModel={setOpenModel}
                        onHire={Handle_hire}
                        hireLoading={contractCreating}
                        freelancer={{
                            name:
                                `${selectedBid.bidItem.freelancerId.firstName}
                         ${selectedBid.bidItem.freelancerId.lastName}`,

                            avatar:
                                selectedBid.bidItem.freelancerId.profileImage.url,

                            freelancerId: selectedBid.bidItem.freelancerId._id
                        }}
                        project={{
                            jobtitle: filtered_job[0]?.jobtitle,
                            budget: filtered_job[0]?.budget,
                            agreedPrice: selectedBid.bidItem.bid,
                            timeline: selectedBid.bidItem.timeline
                        }}
                    />
                )
            }

            {/* Header */}
            <div className="flex items-center justify-between gap-4 py-6">

                <div className="group flex items-center gap-4 py-6">
                    <NavLink
                        to="/home/my-gigs"
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

                <div className="gig_detaile ">
                    <h2 className="text-xl font-semibold text-slate-800">
                        GiG Name : {filtered_job[0]?.jobtitle}
                    </h2>
                    <p className="text-sm text-slate-500">
                        By Client: {filtered_job[0]?.clientId?.company}
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
                    const { bid, timeline = "", description = "", freelancerId = {}, _id = "" } = bidItem;
                    console.log("bidItem", bidItem);
                    // console.log("freelancerId", freelancerId._id);
                    const hiredFreelancerId = hiredData?.freelancerId?._id || hired.freelancerId || null;

                    const isHired = hiredFreelancerId === freelancerId?._id;
                    const someoneHired = Boolean(hiredFreelancerId);

                    return (
                        <div
                            key={_id}
                            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
                        >
                            <div className="grid md:grid-cols-3 gap-4 items-center">

                                {/* Freelancer */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                                        {`${freelancerId}`}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {`${freelancerId.firstName} ${freelancerId.lastName}`}
                                        </p>

                                        <p className="font-semibold text-slate-800">
                                            {`${freelancerId.country} ${freelancerId.state}`}
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
                                        time line: {timeline}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end items-center gap-3">

                                    {/* message btn */}
                                    <button
                                        onClick={() => {
                                            toggleMessage(index, _id);
                                            dispatch(HandleView({
                                                freelancer_id: freelancerId._id,
                                                actiontype: "bid_view",
                                                bid_id: _id.toString()
                                            }));
                                        }}
                                        className={`p-2 rounded-full hover:bg-slate-100 transition
                                        ${openBid === index ? "rotate-180" : ""}`}

                                    >
                                        <IoIosArrowDown size={20} />
                                    </button>


                                    {/* hire btn */}
                                    <button
                                        onClick={() => {

                                            if (someoneHired) return;

                                            setSelectedBid({
                                                bidItem,
                                                index
                                            });

                                            setOpenModel(true);
                                        }}
                                        disabled={someoneHired}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer
    ${isHired
                                                ? "bg-green-600 text-white"
                                                : someoneHired
                                                    ? "bg-red-500 text-white"
                                                    : "bg-primary text-white hover:bg-primary/90"
                                            }
  `}
                                    >
                                        {isHired ? "HIRED" : someoneHired ? "REJECTED" : "HIRE"}
                                    </button>


                                    <NavLink to={`/freelancers_profile/${freelancerId._id}`}>
                                        <button className="px-5 py-2 rounded-full text-sm font-medium bg-white text-primary  hover:bg-primary/10 cursor-pointer border-2 border-primaryr"
                                            onClick={() => dispatch(HandleView({
                                                freelancer_id: freelancerId._id,
                                                actiontype: "view" // view profile action
                                            }))
                                            }
                                        >
                                            View Profile
                                        </button>
                                    </NavLink>

                                </div>
                            </div>

                            {/* Expandable Message */}
                            <div
                                className={`mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-600
                  transition-all duration-300 overflow-hidden
                  ${openBid === index ? "max-h-fit" : "max-h-10"}`}
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
        </div >
    );
};

export default AllBids;
