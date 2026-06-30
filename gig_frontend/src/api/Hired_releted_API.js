import api from "./axios";

// get the hired record info by a client
export const getAllHired = async () => {
    const response = await api.get(`/api/hired/client/`);
    return response.data;
};