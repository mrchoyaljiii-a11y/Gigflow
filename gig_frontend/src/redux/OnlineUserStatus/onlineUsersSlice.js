import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    
    onlineUsers: {},
};

const onlineUsersSlice = createSlice({
    name: "onlineUsers",

    initialState,

    reducers: {

        // User came online
        userOnline(state, action) {

            const userId = action.payload;

            state.onlineUsers[userId] = {

                ...state.onlineUsers[userId],

                online: true,

                // While online we don't display lastSeen
                lastSeen: null
            };
        },


        // User went offline

        userOffline(state, action) {

            const {
                userId,
                lastSeen
            } = action.payload;

            state.onlineUsers[userId] = {

                ...state.onlineUsers[userId],

                online: false,

                lastSeen
            };
        },


        // Complete server snapshot

        setOnlineUsers: (state, action) => {

            const users = action.payload || [];

            // Keep existing lastSeen information
            const previousUsers = state.onlineUsers;

            state.onlineUsers = {};

            users.forEach((userId) => {

                if (!userId) return;

                const id = userId.toString();

                state.onlineUsers[id] = {
                    ...previousUsers[id],
                    online: true,
                    lastSeen: null,
                };
            });

            // Keep previously known offline users
            Object.keys(previousUsers).forEach((id) => {

                if (!users.includes(id)) {

                    state.onlineUsers[id] = {
                        ...previousUsers[id],
                        online: false,
                        lastSeen: previousUsers[id]?.lastSeen || null,
                    };
                }
            });
        },
    },
});

export const {
    userOnline,
    userOffline,
    setOnlineUsers,
} = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;