// src/hooks/useAppSocket.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { addNotification } from "../../redux/Notification_actions/Notifications_actions.js";
import { addBidLive, updateBidLive, updateBidStatusLive } from "../../redux/Bid/Bid_slice.js";

export default function useAppSocket(socket, userId) {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket || !userId) return;

        const handleConnect = () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("register", userId);
            console.log("📡 Socket registered:", userId);
        };

        const handleBidViewed = (updatedBid) => {
            dispatch(updateBidLive(updatedBid));
        };

        const handleNewBid = (newBid) => {
            dispatch(addBidLive(newBid));
        };

        const handleBidStatus = ({ bidId, status }) => {
            dispatch(updateBidStatusLive({ bidId, status }));
        };

        const handleNotification = (data) => {
            console.log("🔔 New Notification:", data);
            dispatch(addNotification(data));
        };

        const handleMilestoneEvent = (payload) => {
            // console.log("🟦 Milestone event:", payload);

            if (!payload?.contractId) return;

            queryClient.invalidateQueries({
                queryKey: ["contract", payload.contractId],
            });

            queryClient.invalidateQueries({
                queryKey: ["ALLcontract"],
            });
        };

        socket.on("connect", handleConnect);
        socket.on("bid_viewed", handleBidViewed);
        socket.on("new_bid", handleNewBid);
        socket.on("bid_status_updated", handleBidStatus);
        socket.on("new_notification", handleNotification);

        socket.on("milestone_created", handleMilestoneEvent);
        socket.on("milestone_updated", handleMilestoneEvent);
        socket.on("milestone_work_uploaded", handleMilestoneEvent);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("bid_viewed", handleBidViewed);
            socket.off("new_bid", handleNewBid);
            socket.off("bid_status_updated", handleBidStatus);
            socket.off("new_notification", handleNotification);

            socket.off("milestone_created", handleMilestoneEvent);
            socket.off("milestone_updated", handleMilestoneEvent);
            socket.off("milestone_work_uploaded", handleMilestoneEvent);
        };
    }, [socket, userId, dispatch, queryClient]);
}