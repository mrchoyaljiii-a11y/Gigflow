import { UploadWork } from '../../../api/contractAPI';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../../../redux/ShowTost/ShowToastSlice";


export const useUploadWork = (contractId) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: UploadWork,
        onError: (error) => {
            console.error("upload work failed:", error.message);
        },
        onSuccess: async (data) => {

            queryClient.invalidateQueries({
                queryKey: ["contract", contractId]
            });

            dispatch(
                showToast({
                    type: "success",
                    title: "Milestone Work Uploaded",
                    message:
                        data?.message ||
                        "Milestone Work uploaded successfully!",
                })
            );


        },
    });

};