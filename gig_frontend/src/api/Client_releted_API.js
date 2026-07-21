import api from "./axios";

// get the client info
export const getClient = async (clientId) => {
    const response = await api.get('/user/details');
    return response.data;
};

// register new user || sign up
export const registerUser = async (userData) => {
    try {
        const res = await api.post('/api/auth/register', userData, { withCredentials: true });
        return res.data; //backend response

    }
    catch (error) {
        console.log("Backend error:", error.response.data);
        return error.response?.data || { signup_error: ["Signup failed"] };
    }
};

// update client profile
export const updateClientProfile = async (payload) => {
    try {
        const res = await api.put('/api/client/profile', payload, { withCredentials: true });
        return res.data; //backend response
    }
    catch (error) {
        console.log("Backend error:", error.response.data);
        return error.response?.data || { signup_error: ["Signup failed"] };
    }
};