import api from "./axios";

// Fetch freelancer data for find freelancer page //* client navigations -> find freelancer page

export const getFreelancer = async ({ pageNo, search, limit }) => {
    try {
        console.log("API function called");

        const response = await api.get(`/user/freelancers?pageNo=${pageNo}&search=${search || ""}&limit=${limit || 6}`);

        console.log("all freelancer response", response);

        return response.data;
        // get freelancer data from response
    } catch (error) {
        console.log("Error in fetch freelancer data :", error);
        return error
    }

};

export const fetchSpecificFreelancer = async (freelancerId) => {
    try {
        const response = await api.get(`/user/freelancer/${freelancerId}`);
        console.log("fetch Specific Freelancer response", response);
        return response.data; // get freelancer data from response
    } catch (error) {
        console.log("Error in fetch freelancer data :", error);
        return error;
    }
}
