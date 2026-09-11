// in these hook we are listening the chat releted socket events 
import { useEffect } from "react";
import { socket } from '../../socket/socket.js'

export const useContractSocket = (contractId, onNewMessage) => {
   
    useEffect(() => {
        if (!contractId || !socket) return;

        const joinRoom = () => {
            socket.emit("joinContractRoom", contractId);
        };

        if (socket.connected) joinRoom();

        // re-join on every reconnect too
        socket.on("connect", joinRoom);

        const handleNewMessage = (newMessage) => {
              if (newMessage.contractId?.toString() !== contractId?.toString()) return;

            console.log("📨 New message received:", newMessage);
            // Send message to component
            onNewMessage(newMessage);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.emit("leaveContractRoom", contractId);
            socket.off("connect", joinRoom);
            socket.off("newMessage", handleNewMessage);
        };
    }, [contractId,onNewMessage]);
}