import api from "./axios";

// get all the job of the client
export const getJob = async () => {
    try {
        const res = await api.get(`/api/get/client-jobs`, { withCredentials: true });
        // console.log("GetClientsJobs response:", res.data);
        return res.data; //backend response

    } catch (error) {
        console.log("from getting client jobs", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting the client jobs.'
        });
    }
};
