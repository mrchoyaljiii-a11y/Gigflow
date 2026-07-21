import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'

//submit the bid by the freelancer || replaced by query
export const AddBid = createAsyncThunk('Bid/AddBid', async (BidData, { rejectWithValue }) => {

    try {
        const res = await api.post("/api/bids", BidData, { withCredentials: true });

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
        const res = await api.get(`/api/bid/${GigId}`, { withCredentials: true });
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
        const res = await api.get("/api/bids", { withCredentials: true });
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

// get the bids by freelancerId
export const GetBidsByFreelancer = createAsyncThunk('Bid/GetBidsByFreelancer', async (freelancerId, { rejectWithValue }) => {
    try {

        const res = await api.get(`/api/bids/freelancer/${freelancerId}`, { withCredentials: true });
        // console.log("GetBidsByFreelancer response:", res.data);
        return res.data; //backend response

    } catch (error) {
        console.log("from getting bids by freelancer", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting bids by freelancer.'
        });
    }
})

// update bid status
export const UpdateBidStatus = createAsyncThunk('Bid/UpdateBidStatus', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/bids/update`, data, { withCredentials: true });
        // console.log("UpdateBidStatus response:", res.data);
        return res.data; //backend response
    } catch (error) {
        console.log("from updating bid status", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while updating the bid status.'
        });
    }
});

// update the bid view status
export const IncrementBidView = createAsyncThunk('Bid/IncrementBidView', async (ViewdData, { rejectWithValue }) => {
    try {
        const res = await api.put(`/api/bids/view`, ViewdData, { withCredentials: true });
        // console.log("UpdateBidStatus response:", res.data);
        return res.data; //backend response
    } catch (error) {
        console.log("from updating bid view status", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while updating the bid view status.'
        });
    }
});

// withdraw the bid by freelancer
export const WithdrawBid = createAsyncThunk('Bid/WithdrawBid', async (data, { rejectWithValue }) => {
    try {
        // console.log("data",data)
        const res = await api.post(`/api/bids/withdraw`, data, { withCredentials: true });
        // console.log("UpdateBidStatus response:", res.data);
        return res.data; //backend response
    } catch (error) {
        console.log("from updating bid status", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while updating the bid status.'
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
        BidsByFreelancer: [],
        updateBidStatus: null,
        BidView: null,
        // searchGig:null,
        // filterdGig:null
    },
    reducers: {
        // for real-time bid view update in freelancer dashboard when client view the bid
        updateBidLive: (state, action) => {
            const updatedBid = action.payload;

            const index = state.BidsByFreelancer.findIndex(
                (b) => b._id === updatedBid._id
            );

            if (index !== -1) {
                state.BidsByFreelancer[index] = updatedBid;
            }
        },
        // for real-time bid status update in freelancer dashboard  and my proposals when client change the bid status ex: accept or reject
        updateBidStatusLive: (state, action) => {
            const { bidId, status } = action.payload;

            const bid = state.BidsByFreelancer.find(b => b._id === bidId);

            if (bid) {
                bid.status = status.toLowerCase();
            }
        },

        // for real-time new bid update in client view all bids.
        addBidLive: (state, action) => {
            const newBid = action.payload;

            const exists = state.AllBids.some(b => b._id === newBid._id);

            if (!exists) {
                state.AllBids.unshift(newBid);
            }

        }
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

        // Get bids by freelancer
        builder
            .addCase(GetBidsByFreelancer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetBidsByFreelancer.fulfilled, (state, action) => {
                state.loading = false;
                state.BidsByFreelancer = action.payload?.bids_by_freelancer || [];
                // console.log("Bids by freelancer in reducer:", state.BidsByFreelancer);
                state.message = action.payload?.message || null;
            })
            .addCase(GetBidsByFreelancer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get bids.';
            });

        // update bid status
        builder
            .addCase(UpdateBidStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(UpdateBidStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.updateBidStatus = action.payload;
                state.message = action.payload.message;
            })
            .addCase(UpdateBidStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update bid status.';
            });

        // update bid view status
        builder
            .addCase(IncrementBidView.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(IncrementBidView.fulfilled, (state, action) => {
                state.loading = false;
                state.BidView = action.payload;
                state.message = action.payload.message;

                const updatedBid = action.payload.bid;

                const index = state.BidsByFreelancer.findIndex(
                    (b) => b._id === updatedBid._id
                );

                if (index !== -1) {
                    state.BidsByFreelancer[index] = updatedBid;
                }
            })
            .addCase(IncrementBidView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update bid status.';
            });

        // withdraw bid
        builder
            .addCase(WithdrawBid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(WithdrawBid.fulfilled, (state, action) => {
                state.loading = false;

                const { bidId } = action.payload; //  must come from backend

                // find and update the bid instantly
                const bid = state.BidsByFreelancer.find(b => b._id === bidId);

                if (bid) {
                    bid.status = "withdraw"; //  instant UI update
                }

                state.message = action.payload?.message;
            })
            .addCase(WithdrawBid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to withdraw bid.";
            });
    }

});

export const { updateBidLive, updateBidStatusLive, addBidLive } = BidSlice.actions;
export default BidSlice.reducer;