import { HandleMilestoneAction } from '../../../api/contractAPI.js';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../../../redux/ShowTost/ShowToastSlice.js";

export const useHandleMilestone = (contractId) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: HandleMilestoneAction,

        onSuccess: async (data) => {

            // console.log("contractId in useHandleMilestone", contractId);

            // console.log("Mutation Success");

            // Refetch contract
            queryClient.invalidateQueries({
                queryKey: ["contract", contractId]
            });

            // console.log("Invalidated");

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