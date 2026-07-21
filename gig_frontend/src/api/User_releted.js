import api from "./axios";

// fetch user data for client and freelancer dashboard if user is client then show client dashboard and if user is freelancer then show freelancer dashboard || get the whole user data:
export const FetchUser = async () => {
    try {
        const response = await api.get('/user/details');
        return response.data; // get user data from response

    } catch (error) {
        console.log("Error in fetchUser:", error);
        throw new Error(error?.response?.data?.message || error.message);
    }
};
