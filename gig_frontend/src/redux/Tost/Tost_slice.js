import { createSlice } from "@reduxjs/toolkit";

const TostSlice = createSlice({
    name: 'tost',
    initialState: {
        message: "",
        show: false,
    },
    reducers: {
        showToast: (state, action) => {
            state.show = true;
            state.message = action.payload;
        },

        hideToast: (state, action) => {
            state.show = false;
        }

    },
})

export const { showToast, hideToast } = TostSlice.actions;
export default TostSlice.reducer;