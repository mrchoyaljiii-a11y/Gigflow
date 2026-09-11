import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Submited_Chat_message } from '../../api/Chat_releted.js';
import { showToast } from '../../redux/ShowTost/ShowToastSlice';
import { useDispatch } from 'react-redux';

export const useSubmitChat = (contractId) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (chatData) => Submited_Chat_message(chatData, contractId),
        
        onError: (error) => {
            dispatch(
                showToast({
                    type: "error",
                    title: "Failed to send chat message",
                    message: error?.response?.data?.message || error.message || "Failed to send chat message",
                })
            );
        }
    });
}