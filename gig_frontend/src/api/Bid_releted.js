import api from './axios';
//submit the bid by the freelancer

export const AddBid = async (BidData) => {

    try {
        const res = await api.post("/api/bids", BidData, { withCredentials: true });

        return res.data; //backend response

    } catch (error) {
        console.log("from submitting a bid", error?.response?.data?.message || error.message);
        throw new Error(error?.response?.data?.message || error.message);

    }
};

// get the all bids of specific freelancer 
export const GetSpecificFreelancerBids = async (freelancerId) => {
    try {
        console.log("freelancerId", freelancerId)
        const res = await api.get(`/api/bids/freelancer/${freelancerId}`, { withCredentials: true });
        console.log("GetBidsByFreelancer response:", res.data);
        return res.data; //backend response
    } catch (error) {
        console.log("from getting bids by freelancer", error);
        throw new Error(error?.response?.data?.message || error.message);
    }
}