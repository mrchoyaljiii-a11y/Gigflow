import { useDispatch } from 'react-redux';
import { AddBid } from '../../api/Bid_releted';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '../../redux/ShowTost/ShowToastSlice';

export const useAddBid = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: (BidData) => AddBid(BidData),
        onSuccess: (data) => {
            dispatch(
                showToast({
                    type: "success",
                    title: "Success",
                    message:
                        data.message ||
                        "Bid added successfully!",
                })
            );
        },

        onError: (error) => {
            // console.log("Error in useAddBid:", error);
            dispatch(
                showToast({
                    type: "error",
                    title: "Failed",
                    message: error?.response?.data?.message || error.message || "Failed to add bid",
                })
            );
        },
    });
}