import { HandleMilestoneAction } from '../../../api/contractAPI.js';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../../../redux/ShowTost/ShowToastSlice.js";

export const useHandleMilestone = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: HandleMilestoneAction,

        onSuccess: (data) => {

            // Refetch contract
            queryClient.invalidateQueries({
                queryKey: ["contract"],
            });

            dispatch(
                showToast({
                    type: "success",
                    title: "Milestone updated",
                    message:
                        data?.message ||
                        "Milestone updated successfully!",
                })
            );
        },

        onError: (error) => {

            dispatch(
                showToast({
                    type: "error",
                    title: "Failed",
                    message:
                        error?.response?.data?.message ||
                        error.message ||
                        "Failed to accept milestone",
                })
            );

        },
    });
};