import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "../../../api/contractAPI";
import { getContract } from '../../../api/contractAPI';
import { useDispatch } from "react-redux";
import { showToast } from "../../../redux/ShowTost/ShowToastSlice.js";


export const useCreateMilestone = (contractId) => {
    const dispatch = useDispatch();

    console.log("contractId in useCreateMilestone", contractId);

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMilestone,
        onError: (error) => {
            console.error("Contract milestonecreation failed:", error.message);
            dispatch(
                showToast({
                    type: "error",
                    title: `Error: ${error?.response?.data?.title || "Milestone Creation Failed"}`,
                    message:
                        error?.response?.data?.message ||
                        error.message ||
                        "Failed to accept milestone",
                })
            );
        },
        
        onSuccess: async (data) => {

            queryClient.invalidateQueries({

                queryKey: ["contract", contractId]
            });

            // console.log("Milestone created successfully:", data);
        },
    });

};
