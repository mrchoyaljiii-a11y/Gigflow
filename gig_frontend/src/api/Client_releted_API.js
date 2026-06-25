import api from "./axios";

// get the client info
export const getClient = async (clientId) => {
    const response = await api.get('/user/details');
    return response.data;
};