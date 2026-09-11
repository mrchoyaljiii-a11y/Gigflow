import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import {
    addNotification
} from "../../redux/Notification_actions/Notifications_actions.js";

import {
    addBidLive,
    updateBidLive,
    updateBidStatusLive
} from "../../redux/Bid/Bid_slice.js";

import {
    userOffline,
    userOnline,
    setOnlineUsers
} from "../../redux/OnlineUserStatus/onlineUsersSlice.js";


export default function useAppSocket(
    socket,
    userId,
    UserName
) {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {

        // console.log("🚀 useAppSocket ", {
        //     userId,
        //     UserName,
        //     socketConnected: socket?.connected,
        //     socketId: socket?.id,
        // });

        if (!socket) {
            console.log("⏸️ Socket not available");
            return;
        }

        // NO LOGGED-IN USER
        if (!userId) {
            console.log("🔴User No logged-in user");

            if (socket.connected) {

                console.log("🔌 Disconnecting socket...");

                socket.disconnect();
            }

            return;
        }


        // REGISTER USER

        const registerUser = () => {
            if (!userId) return;

            console.log(
                "📡 Registering socket for user:",
                {
                    userId,
                    UserName,
                    socketId: socket.id
                }
            );

            socket.emit(
                "register",
                userId.toString(),
                UserName
            );
        };

        // SOCKET CONNECTED
        const handleConnect = () => {
            console.log("✅ Socket connected:", socket.id);
            registerUser();
        };


        // USER ONLINE
        const handleOnlineStatus = ({
            userId
        }) => {

            console.log("🟢 User online event:", userId);
            dispatch(
                userOnline(userId)
            );
        };


        // ONLINE USERS SNAPSHOT

        const handleOnlineUsers = (
            users
        ) => {

            console.log("📡 Online users List:", users);

            dispatch(
                setOnlineUsers(users)
            );
        };


        // USER OFFLINE

        const handleUserOffline = ({
            userId,
            lastSeen
        }) => {

            console.log(
                "⚫ User offline event:",
                userId,
                lastSeen
            );

            dispatch(
                userOffline({
                    userId,
                    lastSeen
                })
            );
        };

        // OTHER SOCKET EVENTS

        const handleBidViewed = (
            updatedBid
        ) => {

            dispatch(
                updateBidLive(updatedBid)
            );
        };


        const handleNewBid = (
            newBid
        ) => {

            dispatch(
                addBidLive(newBid)
            );
        };


        const handleBidStatus = ({
            bidId,
            status
        }) => {

            dispatch(
                updateBidStatusLive({
                    bidId,
                    status
                })
            );
        };

        const handleNotification = (
            data
        ) => {

            console.log(
                "🔔 New Notification:",
                data
            );

            dispatch(
                addNotification(data)
            );
        };

        const handleMilestoneEvent = (payload) => {

            // console.log("🟦 Milestone event:", payload)
            if (!payload?.contractId) return;

            queryClient.invalidateQueries({ queryKey: ["contract", payload.contractId], });

            queryClient.invalidateQueries({ queryKey: ["ALLcontract"], });

        };

        // REGISTER SOCKET LISTENERS

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "userOnline",
            handleOnlineStatus
        );

        socket.on(
            "online-Users",
            handleOnlineUsers
        );

        socket.on(
            "userOffline",
            handleUserOffline
        );

        socket.on(
            "bid_viewed",
            handleBidViewed
        );

        socket.on(
            "new_bid",
            handleNewBid
        );

        socket.on(
            "bid_status_updated",
            handleBidStatus
        );

        socket.on(
            "new_notification",
            handleNotification
        );

        socket.on("milestone_created", handleMilestoneEvent);

        socket.on("milestone_updated", handleMilestoneEvent);

        socket.on("milestone_work_uploaded", handleMilestoneEvent);
        // CONNECT / REGISTER

        if (!socket.connected) {

            console.log("🔌 Socket is disconnected. Connecting...");

            socket.connect();

        } else {

            console.log("🔄 Socket already connected:", socket.id);
            // Socket is already connected,
            // therefore connect event will NOT fire.
            // We must register manually.
            registerUser();
        }


        // CLEANUP

        return () => {

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "userOnline",
                handleOnlineStatus
            );

            socket.off(
                "online-Users",
                handleOnlineUsers
            );

            socket.off(
                "userOffline",
                handleUserOffline
            );

            socket.off(
                "bid_viewed",
                handleBidViewed
            );

            socket.off(
                "new_bid",
                handleNewBid
            );

            socket.off(
                "bid_status_updated",
                handleBidStatus
            );

            socket.off(
                "new_notification",
                handleNotification
            );

            socket.off("milestone_created", handleMilestoneEvent);

            socket.off(
                "milestone_updated",
                handleMilestoneEvent
            );

            socket.off("milestone_work_uploaded", handleMilestoneEvent);
        };


    }, [
        socket,
        userId,
        UserName,
        dispatch,
        queryClient
    ]);
}