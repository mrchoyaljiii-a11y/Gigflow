import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";

// POST FREELANCER PORTFOLIO INFO
export const Post_Freelancere_portfolio_info =
    createAsyncThunk(
        "freelancerPortfolio/postFreelancerPortfolio", async (portfolioData, { rejectWithValue }) => {
            try {
                // API REQUEST
                const res = await api.post("/api/freelancer_extra_info/post", portfolioData,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                // RETURN RESPONSE DATA
                return res.data;
            }
            catch (error) {
                console.log("Backend error:", error.response?.data);
                return rejectWithValue(
                    error.response?.data ||
                    {
                        add_portfolio_error: [
                            "Adding portfolio failed",
                        ],
                    }
                );
            }
        }
    );

// in these extra info will handle and update in DB when freelancer update their info like links , work experiance , education
export const freelancer_extra_info = createAsyncThunk(
    "freelancerExtrainfo/postFreelancerExtraInfo", async (freelancer_extra_info, { rejectWithValue }) => {
        try {
            const res = await api.patch("/api/freelancer_extra_info/extra_info", freelancer_extra_info,
                {
                    withCredentials: true,
                }
            );
            // RETURN RESPONSE DATA
            return res.data;
        } catch (error) {
            console.log("Backend error:", error.response?.data);
            return rejectWithValue(
                error.response?.data ||
                {
                    add_extra_info_error: [
                        "Adding extra info failed",
                    ],
                }
            );
        }
    }
)

export const freelancer_extra_profileImg = createAsyncThunk(
    'freelancerExtraProfileImg/patchfreelancerExtraProfileImg', async (freelancer_extra_profileImg, { rejectWithValue }) => {

        try {
            const res = await api.patch("/api/freelancer_extra_info/profileImg", freelancer_extra_profileImg,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // RETURN RESPONSE DATA
            return res.data;
        } catch (error) {
            console.log("Backend error:", error.response?.data);
            return rejectWithValue(
                error.response?.data ||
                {
                    add_extra_info_profileImg_error: [
                        "Adding extra info profile image failed",
                    ],
                }
            );
        }

    }
)

// INITIAL STATE
const initialState = {

    add_portfolio_loading: false,

    add_portfolio_success: false,

    add_portfolio_data: null,

    add_portfolio_error: null,

    add_extra_info_loading: false,

    add_extra_info_success: false,

    add_extra_info_data: null,

    add_extra_info_error: null,

    // PROFILE IMAGE
    add_profileImg_loading: false,

    add_profileImg_success: false,

    add_profileImg_data: null,

    add_profileImg_error: null,
};


// SLICE

const freelancerPortfolioSlice =
    createSlice({

        name: "freelancerPortfolio",

        initialState,

        reducers: {

            // CLEAR ERRORS
            clearPortfolioErrors: (state) => { state.add_portfolio_error = null; },

            clearExtraInfoErrors: (
                state
            ) => {

                state.add_extra_info_error =
                    null;
            },

            // RESET STATE
            resetPortfolioState: (state) => {
                state.add_portfolio_loading = false;

                state.add_portfolio_success = false;

                state.add_portfolio_data = null;

                state.add_portfolio_error = null;
            },

            resetExtraInfoState: (
                state
            ) => {

                state.add_extra_info_loading =
                    false;

                state.add_extra_info_success =
                    false;

                state.add_extra_info_data =
                    null;

                state.add_extra_info_error =
                    null;
            },
        },

        extraReducers: (builder) => {

            builder

                // PENDING
                .addCase(
                    Post_Freelancere_portfolio_info.pending,

                    (state) => {

                        state.add_portfolio_loading =
                            true;

                        state.add_portfolio_success =
                            false;

                        state.add_portfolio_error =
                            null;
                    }
                )

                // FULFILLED
                .addCase(
                    Post_Freelancere_portfolio_info.fulfilled,

                    (state, action) => {

                        state.add_portfolio_loading = false;

                        state.add_portfolio_success = true;

                        state.add_portfolio_data = action.payload;

                        state.add_portfolio_error = null;
                    }
                )

                // REJECTED
                .addCase(
                    Post_Freelancere_portfolio_info.rejected,

                    (state, action) => {

                        state.add_portfolio_loading = false;

                        state.add_portfolio_success = false;

                        state.add_portfolio_error = action.payload;
                    }
                );

            builder
                .addCase(

                    freelancer_extra_info.pending,

                    (state) => {

                        state.add_extra_info_loading =
                            true;

                        state.add_extra_info_success =
                            false;

                        state.add_extra_info_error =
                            null;
                    }
                )

                // FULFILLED
                .addCase(

                    freelancer_extra_info.fulfilled,

                    (state, action) => {

                        state.add_extra_info_loading =
                            false;

                        state.add_extra_info_success =
                            true;

                        state.add_extra_info_data =
                            action.payload;

                        state.add_extra_info_error =
                            null;
                    }
                )

                // REJECTED
                .addCase(

                    freelancer_extra_info.rejected,

                    (state, action) => {

                        state.add_extra_info_loading =
                            false;

                        state.add_extra_info_success =
                            false;

                        state.add_extra_info_error =
                            action.payload;
                    }
                );

            builder
                .addCase(
                    freelancer_extra_profileImg.pending,

                    (state) => {

                        state.add_profileImg_loading = true;

                        state.add_profileImg_success = false;

                        state.add_profileImg_error = null;
                    }
                )

                .addCase(
                    freelancer_extra_profileImg.fulfilled,

                    (state, action) => {

                        state.add_profileImg_loading = false;

                        state.add_profileImg_success = true;

                        state.add_profileImg_data = action.payload;

                        state.add_profileImg_error = null;
                    }
                )

                .addCase(
                    freelancer_extra_profileImg.rejected,

                    (state, action) => {

                        state.add_profileImg_loading = false;

                        state.add_profileImg_success = false;

                        state.add_profileImg_error = action.payload;
                    }
                );
        },
    });


// EXPORT ACTIONS
export const { clearPortfolioErrors, resetPortfolioState, } = freelancerPortfolioSlice.actions;


// EXPORT REDUCER
export default freelancerPortfolioSlice.reducer;