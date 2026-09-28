const { Server } = require("socket.io");
const ClientModel = require('../model/UserModel/User_model');
const FreelancerModel = require('../model/UserModel/Freelancer_Model');
const contractModel = require('../model/Contract/contract');
// console.log("Socket PID:", process.pid);

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id);

        //  REGISTER USER → JOIN ROOM
        socket.on("register", (userId, UserName) => {

            if (!userId) {
                console.warn("Register called without userId : userId required");
                return;
            }

            userId = userId.toString();

            socket.userId = userId;
            socket.userName = UserName;

            // Join personal room
            socket.join(userId);

            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }

            onlineUsers.get(userId).add(socket.id);

            console.log(`🟢 User Online: ${userId}:${UserName}`);

            console.log("ALL Online Users:", [...onlineUsers.keys()]);

            // Notify User Online
            io.emit("userOnline", {
                userId,
            });

            // Notify All Online Users
            io.emit("online-Users", [...onlineUsers.keys()]);

        });

        socket.on('joinContractRoom', async (contractId) => {

            console.log("📡 Joining contract room:", contractId);

            const contract = await contractModel.findById(contractId);
            const isParticipant = contract && (
                contract.clientId.toString() === socket.userId ||
                contract.freelancerId.toString() === socket.userId
            );

            if (!isParticipant) return;
            const roomId = `contract:${contractId}`;
            socket.join(roomId);
        });

        socket.on("leaveContractRoom", (contractId) => {
            socket.leave(`contract:${contractId}`);
        });

        //  DISCONNECT
        socket.on("disconnect", async () => {
            console.log("🔴 Socket disconnected:", socket.id);

            if (!socket.userId) return;

            const userId = socket.userId;
            const userName = socket.userName; ``
            const sockets = onlineUsers.get(userId); // here its a size of a set ->  onlineUsers.get(userId).add(socket.id);

            if (sockets) {
                sockets.delete(socket.id);

                // User completely offline
                if (sockets.size === 0) {
                    onlineUsers.delete(userId);

                    console.log(`⚫ User ${userId}:${userName} went offline`);

                    const lastSeen = new Date();

                    // Save last seen
                    try {
                        const updatedClient = await ClientModel.findByIdAndUpdate(
                            userId,
                            { lastSeen }
                        );

                        if (!updatedClient) {

                            await FreelancerModel.findByIdAndUpdate(
                                userId,
                                { lastSeen }
                            );

                        }
                    } catch (err) {
                        console.error("Last Seen Update Error:", err.message);
                    }

                    // Notify everyone
                    io.emit("userOffline", {
                        userId,
                        lastSeen,
                    });

                    io.emit("online-Users", [...onlineUsers.keys()]);
                }
            }

            // console.log("All Online Users: after disconnect", [...onlineUsers.keys()]);
        });


    });
};

const getIO = () => io;

const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
};


module.exports = { initSocket, getIO, isUserOnline, onlineUsers };