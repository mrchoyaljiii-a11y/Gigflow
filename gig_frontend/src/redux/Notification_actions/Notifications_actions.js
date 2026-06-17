import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'


//  GET ALL NOTIFICATIONS 
// in these userId is not required its optional used in future need as we will get the notifications based on the logged in user from the backend using the token
export const fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (userId, thunkAPI) => {
        try {
            const res = await api.get(`/api/notifications`);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

// when the client view freelancer profile and when the client view freelancer bid 
export const HandleView = createAsyncThunk(
    "notification/view_profile",
    async ({ freelancer_id, actiontype, bid_id }, thunkAPI) => {
        // console.log("HandleView called with:", { bid_id });
        try {
            let res;

            if (bid_id) {
                res = await api.get(
                    `/api/notifications/view_profile/?freelancer_id=${freelancer_id}&action=${actiontype}&bid_id=${bid_id}`
                );
            } else {
                res = await api.get(
                    `/api/notifications/view_profile/?freelancer_id=${freelancer_id}&action=${actiontype}`
                );
            }

            return res.data;
        } catch (error) {
            console.log("error in view profile notification", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// when user view/read notification 
export const ReadNotification = createAsyncThunk("notification/read_notification",
    async (id, thunkAPI) => {
        try {
            const res = await api.post(`/api/notifications/read/${id}`);

            return res.data;

        } catch (error) {
            console.log("error in read notification", error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    })

const Notification_actions_slice = createSlice({
    name: 'Notification_actions',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
        showNotification: false
    },

    reducers: {
        //Toggle UI
        Show_notification_component: (state, action) => {
            state.showNotification = action.payload;
            console.log("show", state.showNotification)
        },

        // real-time add notification 
        addNotification: (state, action) => {
            console.log("Adding notification to state:", action.payload);
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
    }
    ,

    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;

                // console.log("Notifications fetched:", action.payload);

                // //  calculate unread
                state.unreadCount = action.payload.notifications.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // .addCase(HandleView.fulfilled, (state, action) => {
            //     const newNotification = action.payload.notification;

            //     //  Only add if backend actually created one
            //     if (newNotification && action.payload.message.includes("sent")) {
            //         state.notifications.unshift(newNotification);
            //         state.unreadCount += 1;
            //     }
            // })

            .addCase(HandleView.rejected, (state, action) => {
                state.error = action.payload;
            });

        builder
            .addCase(ReadNotification.fulfilled, (state, action) => {
                const updated = action.payload.notification;

                const index = state.notifications.findIndex(
                    (n) => n._id === updated._id
                );

                if (index !== -1) {
                    state.notifications[index] = updated;
                }

                state.unreadCount = state.notifications.filter(n => !n.isRead).length;
            })
    }

});


export const { Show_notification_component, addNotification } = Notification_actions_slice.actions;

export default Notification_actions_slice.reducer;