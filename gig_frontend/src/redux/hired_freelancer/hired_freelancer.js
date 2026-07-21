import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'

// submit the hired info || replaced by query 
const SubmitHired = createAsyncThunk(
    'hired/SubmitHired',
    async (hiredData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/hired', hiredData, {
                withCredentials: true,
            });
            return response.data.hired;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to hire freelancer' }
            );
        }
    }
);

// get the hired info for a job || replaced by query
const GetHiredJOb = createAsyncThunk(
    'hired/GetHiredJOb',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/hired/job/${jobId}`, {
                withCredentials: true,
            });
            return response.data.hired;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'No hired freelancer' }
            );
        }
    }
);

// get all hired records for a freelancer dashboard
const GetHiredByFreelancer = createAsyncThunk(
    'hired/GetHiredByFreelancer',
    async (freelancerId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/hired/freelancer/${freelancerId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'No hired freelancer' }
            );
        }
    }
);

const hiredSlice = createSlice({
    name: 'hired_freelancer',
    initialState: {
        data: null,
        loading: false,
        error: null,
        hiredRecodrs:[]
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // SUBMIT HIRED
            .addCase(SubmitHired.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(SubmitHired.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(SubmitHired.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // GET HIRED
            .addCase(GetHiredJOb.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetHiredJOb.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(GetHiredJOb.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
            });
            // get all hired records for a freelancer dashboard
            builder
            .addCase(GetHiredByFreelancer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetHiredByFreelancer.fulfilled, (state, action) => {
                state.loading = false;
                state.hiredRecodrs = action.payload?.hiredRecords || [];
                // console.log("hiredRecodrs in fulfilled case", state.hiredRecodrs);
            })
            .addCase(GetHiredByFreelancer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export default hiredSlice.reducer;
export { SubmitHired, GetHiredJOb ,GetHiredByFreelancer};