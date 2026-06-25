import { useMutation } from "@tanstack/react-query";
import { createContract } from "../api/contractAPI";

export const useCreateContract = () => {
    return useMutation({
        mutationFn: createContract,
        onError: (error) => {
            console.error("Contract creation failed:", error.message);
        },
    });

};

// ? these hook is used for creating a contract when client hire a freelancer from allBids page