import api from "./axios";

// get the hired record info by a client
export const getAllHired = async () => {
    const response = await api.get(`/api/hired/client/`);
    return response.data;
};

// get the hired records for a specific job
export const GetHiredRecord = async (jobId) => {
    try {
        const response = await api.get(`/api/hired/job/${jobId}`, {
            withCredentials: true,
        });
        // console.log("hired record response", response);
        return response.data.hired;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message);
    }
}
