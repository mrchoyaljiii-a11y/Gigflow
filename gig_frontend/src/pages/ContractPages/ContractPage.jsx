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
import ContractHeader from "./ContractHeader.jsx";
import PaymentOverview from "./PaymentOverview.jsx";
import Milestone_Timeline_For_Client from "./Milestone_Timeline_For_Client.jsx";
import DeliverablesCard from "./DeliverablesCard.jsx";
import ActivityFeed from "./ActivityFeed.jsx";
import StickyChat from "./StickyChat.jsx";
import { useParams, useSearchParams } from "react-router-dom";
import { useContract } from '../../hooks/contract_releted/useContract.js';
import { useSelector, useDispatch } from 'react-redux';
import Milestone_Timeline_For_Freelancer from "./Freelancer_side/Milestone_Timeline_For_Freelancer.jsx";
import ContractInfo from "./ContractInfo.jsx";


const ContractPage = () => {
    const [showTost, setShowTost] = useState({
        show: false,
        message: ""
    })

    const [ShowChat, setShowChat] = useState(false);

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

    const { contractId } = useParams();

    const {
        data,
        isLoading,
        error,
        isError,
        refetch,
    } = useContract(contractId);

    const contractData = data?.contract;


    // for online status of freelancer or client in contract page
    const { onlineUsers } = useSelector((state) => state.onlineUsers);

    // console.log("onlineUsers in contract page", onlineUsers);


    if (isLoading) return <h1 className="text-3xl text-red-600">Loading...</h1>;

    if (isError) return <h1 className="text-3xl text-red-600">{error.message}</h1>;

    // console.log("contract", contractData?.freelancerId?._id);


    return (
        <>
            <div className="min-h-screen bg-slate-100">
                {/* Gradient Header */}
                <ContractHeader
                    contracrtData={
                        {
                            contractTitle: contractData.contractTitle,
                            contractStatus: contractData.contractStatus
                        }
                    }

                    setShowChat={setShowChat}
                />

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
                            <ContractInfo contractData={contractData} />


                            {/* Payment */}
                            <PaymentOverview payment={contractData.payment} />

                            {/* milestone Timeline */}

                            {
                                IsFreelancer ? (

                                    <Milestone_Timeline_For_Freelancer
                                        milestonesData={contractData.milestones}
                                        contractId={contractId}
                                    />
                                ) :
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
                                <DeliverablesCard
                                    UserRole={UserRole}
                                    milestonesData={contractData.milestones}
                                    contractId={contractId}
                                />

                                <ActivityFeed
                                    UserRole={UserRole}
                                    ActivityData={contractData.activities}
                                    contractId={contractId} />
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <aside className="hidden xl:block">
                            <div className="sticky top-5 h-[calc(100vh-40px)]">
                                <StickyChat
                                    freelancerData={contractData.freelancerId}
                                    clientData={contractData.clientId}
                                    isLoading={isLoading}
                                    UserRole={UserRole}
                                   contractId={contractId}
                                />
                            </div>
                        </aside>
                    </div>

                    {/* Tablet & Mobile Chat */}
                    <div className="xl:hidden mt-6">
                        {/* <StickyChat mobile /> */}
                    </div>
                </div>
            </div>

            {ShowChat && (
                <div
                    className="xl:hidden fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowChat(false)}
                >
                    <div
                        className="relative w-full max-w-sm h-[92vh] max-h-[820px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Contract Chat
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Stay connected during your project.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowChat(false)}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 transition shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Chat body — fills remaining space, allows internal scroll */}
                        <div className="flex-1 min-h-0">
                             <StickyChat
                                    freelancerData={contractData.freelancerId}
                                    clientData={contractData.clientId}
                                    isLoading={isLoading}
                                    UserRole={UserRole}
                                   contractId={contractId}
                                />
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default ContractPage;