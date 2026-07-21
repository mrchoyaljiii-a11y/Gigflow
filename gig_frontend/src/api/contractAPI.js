import api from "./axios";

// create contract
export const createContract = async (contractData) => {
    try {
        const response = await api.post("/api/contract/create", contractData);
        return response.data;

    } catch (error) {
        throw new Error(
            error?.response?.data?.message || error.message || "Failed to Hired freelancer and create contract"
        );
    }
}

// get a sepecific contract
export const getContract = async (contractId) => {

    const response = await api.get(
        `/api/contracts/${contractId}`
    );
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch contract");
    }
    return response.data.contract;
};

// get all contracts
export const getAllContracts = async () => {

    // console.log("API function called");

    const response = await api.get("/api/contracts");

    // console.log("all contracts response",response);

    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch contracts");
    }
    return response.data.contracts;
};

// create milestone
export const createMilestone = async (milestoneData) => {
    const response = await api.post("/api/milestone/create", milestoneData);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create milestone");
    }
    return response.data;
}


// get milestone of the contract
export const getMilestone = async (contractId) => {

    const response = await api.get(
        `/api/milestones/${contractId}`
    );
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch milestone");
    }
    return response.data.milestone;
};

// Handle milestone action by freelancer like accept or reject , submit work etc...
//milestoneAction caontain milestoneId and action
export const HandleMilestoneAction = async (milestoneAction) =>
{
    const response = await api.put(`/api/milestone/actions`, milestoneAction);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to accept milestone");
    }
    return response.data;
}

// upload the work add by freelancer when submit milestone || when a milestone is completed by freelancer they upload their work in this function

export const UploadWork = async (UploadData) => {
    const response = await api.post("/api/milestone/upload_Freelancer_Work", UploadData);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to upload work by freelancer");
    }
    return response.data;
}