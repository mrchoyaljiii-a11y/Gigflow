import api from './axios';

export const Submited_Chat_message = async (chatData,contractId) => {
    try {
        const res = await api.post(`/api/chat/message/${contractId}`, chatData, { withCredentials: true });

        return res.data; //backend response

    } catch (error) {
        console.log("From submitting a message", error?.response?.data?.message || error.message);
        throw new Error(error?.response?.data?.message || error.message);

    }
}

export const Get_Chat_messages = async (contractId) => {

   try {
        const res = await api.get(`/api/chat/${contractId}`, { withCredentials: true });
      
        return res.data; //backend response
    }
    catch (error) {
        console.log("from getting a Bid", error);
        throw new Error(error?.response?.data?.message || error.message);
    }
};