import api from "./axios";

// create contract
export const createContract = async (contractData) => {
    const response = await api.post("/api/contract/create", contractData);
    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create contract");
    }
    return response.data;
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

// update the contract in jobmodel and in bid model
export const updateContractID_jobmodel_bidmodel = async (contractId) => {

}