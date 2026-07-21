import { updateClientProfile } from "../../api/Client_releted_API";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateClientProfil_Info = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (playload) => updateClientProfile(playload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientInfo"] });
        },
        
        onError: (error) => {
            console.log(error);
        },
    });

};