import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestone } from "../../../api/contractAPI";


export const useUpdateMilestone = (contractId) => {
    
     console.log("contractId in useUpdateMilestone",contractId);

    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (milestoneData) => updateMilestone(contractId, milestoneData),
        onError: (error) => {
            console.error("Contract milestone updation failed:", error.message);
        },
        onSuccess: async (data) => {

            queryClient.invalidateQueries({
               
                queryKey: ["contract", contractId]
            });

            // console.log("Milestone created successfully:", data);
        },
    });

};
