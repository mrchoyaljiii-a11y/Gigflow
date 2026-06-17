const { Server } = require("socket.io");

let io;

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
        socket.on("register", (userId) => {
            const roomId = userId.toString();

            socket.join(roomId); // ✅ join room
            socket.userId = roomId;

            console.log(`🟢 User ${roomId} joined room`);
            console.log("📦 Rooms:", Array.from(socket.rooms));
        });

        // 🔴 DISCONNECT
        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);

            // No manual cleanup needed 
            // Socket.IO automatically removes socket from rooms
        });
    });
};

const getIO = () => io;

module.exports = { initSocket, getIO };