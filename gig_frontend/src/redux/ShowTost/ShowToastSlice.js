import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  type: "success",
  title: "",
  message: "",
};

const ShowToastSlice = createSlice({
  name: "Showtoast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      const {
        type = "success",
        title = "",
        message = "",
      } = action.payload;

      state.isOpen = true;
      state.type = type;
      state.title = title;
      state.message = message;
    },

    hideToast: (state) => {
      state.isOpen = false;
      state.type = "success";
      state.title = "";
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = ShowToastSlice.actions;
export default ShowToastSlice.reducer;