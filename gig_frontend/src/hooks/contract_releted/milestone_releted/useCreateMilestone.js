import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "../../../api/contractAPI";
import { getContract } from '../../../api/contractAPI';

export const useCreateMilestone = (contractId) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createMilestone,
        onError: (error) => {
            console.error("Contract milestonecreation failed:", error.message);
        },
        onSuccess: async (data) => {

            queryClient.invalidateQueries({
                queryKey: ["contract", contractId]
            });

            // console.log("Milestone created successfully:", data);
        },
    });

};
