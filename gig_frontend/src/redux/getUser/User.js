import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios'

// fetch user data for client and freelancer dashboard if user is client then show client dashboard and if user is freelancer then show freelancer dashboard

const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/details');
            return response.data; // get user data from response

        } catch (error) {
            console.log("Error in fetchUser:", error);
            return rejectWithValue(error.response.data);
        }
    });


// fetch freelancers data in freelancer_page.jsx

const fetchFreelancer = createAsyncThunk(
    'user/fetchFreelancer',
    async ({ pageNo, search, limit }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/freelancers?pageNo=${pageNo}&search=${search || ""}&limit=${limit || 6}`);

            return response.data; // get freelancer data from response
        } catch (error) {
            console.log("Error in fetch freelancer data :", error);
            return rejectWithValue(error.response.data);
        }

    }
)

// fetch {specific} freelancer by id

const fetchSpecificFreelancer = createAsyncThunk(
    'user/fetchSpecificFreelancer',
    async (freelancerId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/freelancer/${freelancerId}`);
            return response.data; // get freelancer data from response
        } catch (error) {
            console.log("Error in fetch freelancer data :", error);
            return rejectWithValue(error.response.data);
        }
    }
)

// fetch recommended freelancers for client dashboard
const fetchRecommendedFreelancers = createAsyncThunk(
    'user/fetchRecommendedFreelancers',
    async (_, { rejectWithValue }) => {
        const response = await api.get('/user/freelancers?recommended=true');
        return response.data;
    }
);


const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        userData: {},
        sepecificFreelancerData: null,
        freelancerData: {},
        recommendedFreelancers: [],

        userLoading: false,
        freelancerLoading: false,
        specificFreelancerLoading: false,
        recommendedLoading: false,

        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.userLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.userLoading = false;
                state.userData = action.payload.user;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.userLoading = false;
                state.error = action.payload?.message || 'Failed to fetch user';
            });


        builder
            .addCase(fetchFreelancer.pending, (state) => {
                state.freelancerLoading = true;
            })
            .addCase(fetchFreelancer.fulfilled, (state, action) => {
                state.freelancerLoading = false;
                state.freelancerData = action.payload;
            })
            .addCase(fetchFreelancer.rejected, (state, action) => {
                state.freelancerLoading = false;
                state.error = action.payload?.message || 'Failed to fetch freelancers';
            });


        // fetch specific freelancer
        builder
            .addCase(fetchSpecificFreelancer.pending, (state) => {
                state.specificFreelancerLoading = true;
            })
            .addCase(fetchSpecificFreelancer.fulfilled, (state, action) => {
                state.specificFreelancerLoading = false;
                state.sepecificFreelancerData = action.payload.freelancer;
            })
            .addCase(fetchSpecificFreelancer.rejected, (state, action) => {
                state.specificFreelancerLoading = false;
                state.error = action.payload?.message || 'Failed to fetch specific freelancer';
            });


        // fetch recommended freelancers

        builder
            .addCase(fetchRecommendedFreelancers.pending, (state) => {
                state.recommendedLoading = true;
            })
            .addCase(fetchRecommendedFreelancers.fulfilled, (state, action) => {
                state.recommendedLoading = false;
                state.recommendedFreelancers = action.payload.freelancers;
            })
            .addCase(fetchRecommendedFreelancers.rejected, (state, action) => {
                state.recommendedLoading = false;
                state.error = action.payload?.message || 'Failed to fetch recommended freelancers';
            });

    }

});

export default userSlice.reducer;
export { fetchUser, fetchFreelancer, fetchSpecificFreelancer, fetchRecommendedFreelancers };