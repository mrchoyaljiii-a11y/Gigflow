import React,{useEffect,useState} from "react";
import { showToast } from '../../redux/Tost/Tost_slice.js'
import ContractHeader from "./ContractHeader";
import FreelancerCard from "./FreelancerCard";
import PaymentOverview from "./PaymentOverview";
import MilestoneTimeline from "./MilestoneTimeline";
import DeliverablesCard from "./DeliverablesCard";
import ActivityFeed from "./ActivityFeed";
import StickyChat from "./StickyChat";
import { useParams } from "react-router-dom";
import { useContract } from '../../hooks/useContract';
import { useDispatch } from "react-redux";

const ClientContractPage = () => {
    const [showTost,setShowTost] = useState({
        show:false,
        message:""
    })

    // console.log("showTost",showTost);
    const dispatch = useDispatch();

    if(showTost.show)
    {
        console.log("inside if showTost",showTost);
        dispatch(showToast(showTost.message));
    }

    const { contractId } = useParams();

    const {
        data: contractData,
        isLoading,
        error,
        isError,
        refetch,

    } = useContract(contractId);

    if (isLoading) return <h1 className="text-3xl text-red-600">Loading...</h1>;

    if (isError) return <h1 className="text-3xl text-red-600">{error.message}</h1>;

    console.log("contract", contractData);


    return (
        <div className="min-h-screen bg-slate-100">
            {/* Gradient Header */}
            <ContractHeader />

            {/* Main Content */}
            <div className="mx-auto max-w-[1800px] px-4 py-6 lg:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6">
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        {/* Freelancer */}
                        <FreelancerCard freelancerId={contractData.freelancerId} />

                        {/* Payment */}
                        <PaymentOverview payment={contractData.payment} />

                        {/* Timeline */}
                        <MilestoneTimeline milestonesData={contractData.milestones} contractId={contractId} setShowTost={setShowTost}/>

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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