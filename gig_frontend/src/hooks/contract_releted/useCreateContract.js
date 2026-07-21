import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContract } from "../../api/contractAPI";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/ShowTost/ShowToastSlice";

export const useCreateContract = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createContract,

        onSuccess: (data) => {
            // Refetch client jobs
            queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });

            dispatch(
                showToast({
                    type: "success",
                    title: "Success",
                    message:
                        data?.message ||
                        "Freelancer hired and contract created successfully!",
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
                        "Failed to hire freelancer and create contract",
                })
            ); 
        },
    });
};