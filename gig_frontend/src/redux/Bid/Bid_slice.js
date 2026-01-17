import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//submit the bid
export const AddBid = createAsyncThunk('Bid/AddBid', async (BidData, { rejectWithValue }) => {

    try {
        const res = await axios.post("http://localhost:3000/api/bids", BidData, { withCredentials: true });

        return res.data; //backend response

    } catch (error) {
        console.log("from submitting a bid", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while submitting the bid.'
        });
    }
});


// get the bid by GigId
export const GetBid = createAsyncThunk('Bid/GetBid', async (GigId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/bid/${GigId}`, { withCredentials: true });
        // console.log("GetBid response:", res.data);
        return res.data; //backend response
    }
    catch (error) {
        console.log("from getting a Bid", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting the Bid.'
        });
    }
});

// get the all bids
export const GetAllBids = createAsyncThunk('Bid/GetAllBids', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:3000/api/bids", { withCredentials: true });
        // console.log("GetAllBids response:", res.data);
        return res.data; //backend response
    }
    catch (error) {
        console.log("from getting all bids", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting all bids.'
        });
    }
});

const BidSlice = createSlice({
    name: 'BidSlice',
    initialState: {
        AllBids: [],
        Bids: [],
        data: null,
        loading: false,
        error: null,
        message: null,
        // searchGig:null,
        // filterdGig:null
    },

    extraReducers: (builder) => {
        // add cases for AddBid post request
        builder
            .addCase(AddBid.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(AddBid.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.message = action.payload.message;
            })
            .addCase(AddBid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add job.';
            });

        // add cases for GetBid get request

        builder
            .addCase(GetBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetBid.fulfilled, (state, action) => {
                state.loading = false;
                state.Bids = action.payload?.bids || [];
                state.message = action.payload?.message || null;
            })
            .addCase(GetBid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get bids.';
            });

            // Get all bids
            builder
            .addCase(GetAllBids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAllBids.fulfilled, (state, action) => {
                state.loading = false;
                state.AllBids = action.payload?.bids || [];
                state.message = action.payload?.message || null;
            })
            .addCase(GetAllBids.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get bids.';
            });
    }

});

export default BidSlice.reducer;