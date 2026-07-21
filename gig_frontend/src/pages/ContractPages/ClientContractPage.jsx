import React, { useEffect, useState } from "react";
import {
    FaFileContract,
    FaHashtag,
    FaTag,
    FaBriefcase,
    FaDollarSign,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
} from "react-icons/fa";


import UserCard from "./UserCard.jsx";
import ContractHeader from "./ContractHeader";
import PaymentOverview from "./PaymentOverview";
import Milestone_Timeline_For_Client from "./Milestone_Timeline_For_Client.jsx";
import DeliverablesCard from "./DeliverablesCard";
import ActivityFeed from "./ActivityFeed";
import StickyChat from "./StickyChat";
import { useParams, useSearchParams } from "react-router-dom";
import { useContract } from '../../hooks/contract_releted/useContract.js';
import { useSelector, useDispatch } from 'react-redux';
import Milestone_Timeline_For_Freelancer from "./Freelancer_side/Milestone_Timeline_For_Freelancer.jsx";


const ClientContractPage = () => {
    const [showTost, setShowTost] = useState({
        show: false,
        message: ""
    })

    const { user: loginUser } = useSelector((state) => state.auth);
    // console.log("user in contract page loginUser", loginUser);

    let UserRole = null;

    const IsClient = loginUser?.role === "client";
    const IsFreelancer = loginUser?.role === "freelancer";

    if (IsClient) {
        UserRole = "freelancer";
    } else if (IsFreelancer) {
        UserRole = "client";
    }

    // console.log("showTost",showTost);
    const dispatch = useDispatch();

    if (showTost.show) {
        console.log("inside if showTost", showTost);
    }

    const { contractId } = useParams();

    const {
        data: contractData,
        isLoading,
        error,
        isError,
        refetch,

    } = useContract(contractId);

    // console.log("contractData in contract page", contractData);


    const getRemainingDays = (endDate) => {
        if (!endDate) return "N/A";

        const today = new Date();
        const end = new Date(endDate);

        // Reset time so only dates are compared
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffInMs = end - today;

        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays > 0) {
            return `${diffInDays} Day${diffInDays > 1 ? "s" : ""} Left`;
        }

        if (diffInDays === 0) {
            return "Ends Today";
        }

        return "Expired";
    };

    const daysLeft = getRemainingDays(contractData?.endDate);

    if (isLoading) return <h1 className="text-3xl text-red-600">Loading...</h1>;

    if (isError) return <h1 className="text-3xl text-red-600">{error.message}</h1>;

    // console.log("contract", contractData);


    return (
        <div className="min-h-screen bg-slate-100">
            {/* Gradient Header */}
            <ContractHeader contracrtData={
                {
                    contractTitle: contractData.contractTitle,
                    contractStatus: contractData.contractStatus
                }
            } />

            {/* Main Content */}
            <div className="mx-auto max-w-[1800px] px-4 py-6 lg:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6">
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        {/* Freelancer */}

                        <UserCard
                            freelancerData={contractData.freelancerId}
                            clientData={contractData.clientId}
                            isLoading={isLoading}
                            UserRole={UserRole} />

                        {/* Contract info */}
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FaFileContract className="text-primary text-2xl" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Contract Information
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Complete details about this contract
                                    </p>
                                </div>
                            </div>

                            {/* Contract Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Contract Number */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaHashtag className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Contract Number
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            {contractData.contractNumber}
                                        </h4>
                                    </div>
                                </div>

                                {/* Contract Type */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaTag className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Contract Type
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            {contractData.contractType}
                                        </h4>
                                    </div>
                                </div>

                                {/* Job Title */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaBriefcase className="text-primary text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Hired For
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            {contractData.contractTitle}
                                        </h4>
                                    </div>
                                </div>

                                {/* Agreed Price */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaDollarSign className="text-green-600 text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Agreed Price
                                        </p>
                                        <h4 className="font-semibold text-green-600 text-lg">
                                            ${contractData.AgreedPrice}
                                        </h4>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaCalendarAlt className="text-blue-600 text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Start Date
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            {contractData.startDate.split("T")[0]}
                                        </h4>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaCalendarAlt className="text-red-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            End Date
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            {contractData.endDate.split("T")[0]}
                                        </h4>
                                    </div>
                                </div>

                                {/* Remaining Days */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaClock className="text-yellow-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Remaining Days
                                        </p>
                                        <h4 className="font-semibold text-slate-800">
                                            <span
                                                className={`font-semibold ${daysLeft < 0
                                                    ? "text-red-500"
                                                    : daysLeft <= 3
                                                        ? "text-yellow-500"
                                                        : "text-green-600"
                                                    }`}
                                            >
                                                {daysLeft < 0
                                                    ? "Expired"
                                                    : daysLeft === 0
                                                        ? "Ends Today"
                                                        : `${daysLeft}`}
                                            </span>
                                        </h4>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all">
                                    <FaCheckCircle className="text-green-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                                            Contract Status
                                        </p>

                                        <span
                                            className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold mt-1
                    ${contractData.contractStatus === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : contractData.contractStatus === "Completed"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : contractData.contractStatus === "Cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {contractData.contractStatus}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Payment */}
                        <PaymentOverview payment={contractData.payment} />

                        {/* milestone Timeline */}

                        {
                            IsFreelancer ? (

                                <Milestone_Timeline_For_Freelancer
                                 milestonesData={contractData.milestones}
                                  contractId={contractId}

                                 />
                            ):
                            (
                                <Milestone_Timeline_For_Client
                                    milestonesData={contractData.milestones}
                                    contractId={contractId}
                                    setShowTost={setShowTost}
                                    isLoading={isLoading}
                                    UserRole={UserRole} />
                            )
                        }

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                            <DeliverablesCard />

                            <ActivityFeed />
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <aside className="hidden xl:block">
                        <div className="sticky top-5 h-[calc(100vh-40px)]">
                            <StickyChat />
                        </div>
                    </aside>
                </div>

                {/* Tablet & Mobile Chat */}
                <div className="xl:hidden mt-6">
                    {/* <StickyChat mobile /> */}
                </div>
            </div>
        </div>
    );
};

export default ClientContractPage;