import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'
import axios from 'axios';

/*
POST    /api/gigs        → add job
GET     /api/gigs        → get all jobs
PATCH   /api/gigs/:id    → update job
DELETE  /api/gigs/:id    → delete job

end point are different api is same 
 */


//add the job || replaced by query
export const Addjob = createAsyncThunk('job/Addjob', async (jobData, { rejectWithValue }) => {

    try {
        const res = await api.post("/api/gigs", jobData, { withCredentials: true });

        return res.data; //backend response

    } catch (error) {
        console.log("from adding a job", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while adding the job.'
        });
    }
});


// get the job based on search and filter and pagination
export const Getjob = createAsyncThunk('job/Getjob', async ({ pageNo, search, limit }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/get/gigs?pageNo=${pageNo}&search=${search || ""}&limit=${limit || 6}`, { withCredentials: true });
        // console.log("Getjob response:", res.data);
        return res.data; //backend response
    }
    catch (error) {
        console.log("from getting a job", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting the job.'
        });
    }
});

// get the all jobs posted by the client
export const GetClientsJobs = createAsyncThunk('job/GetClientsJobs', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/get/client-jobs`, { withCredentials: true });
        // console.log("GetClientsJobs response:", res.data);
        return res.data; //backend response

    } catch (error) {
        console.log("from getting client jobs", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting the client jobs.'
        });
    }
})

//update the job status like active, assigned, cancelled etc
export const UpdateJob = createAsyncThunk('job/UpdateJob', async (jobData, { rejectWithValue }) => {
    try {
        // console.log("whole data in slice", jobData)
        const gig_id = jobData.gigId;
        const res = await api.patch(`/api/gigs/${gig_id}`,jobData, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("from updating a job status", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while updating the job status.'
        });
    }
})

// delete the job
export const DeleteJob = createAsyncThunk('job/DeleteJob', async (gig_id, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/gigs/${gig_id}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("from deleting a job", error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while deleting the job.'
        });
    }
})

const jobSlice = createSlice({
    name: 'job',
    initialState: {
        jobs: [],
        Clientjobs: [],
        data: null,
        loading: false,
        error: null,
        message: null,
        searchGig: null,
        filterdGig: null,
        playLoad: null,
        pageNo: 1,
    },

    // ! not used anymore but maybe used in future for search and filter in frontend without api call
    reducers: {
        setSearchGig: (state, action) => {
            state.searchGig = action.payload;
        },
        setFilterdGig: (state, action) => {
            state.filterdGig = action.payload;
        },
        setPageNo: (state, action) => {
            state.pageNo = action.payload;
        }
    },

    extraReducers: (builder) => {
        // add cases for Addjob post request
        builder
            .addCase(Addjob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(Addjob.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.message = action.payload.message;
            })
            .addCase(Addjob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add job.';
            });

        // add cases for Getjob get request based on search and filter and pagination
        builder
            .addCase(Getjob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(Getjob.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload?.jobs || [];
                state.playLoad = action.payload;
                state.message = action.payload?.message || null;
            })
            .addCase(Getjob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get jobs.';
            });

        // add cases for GetClientsJobs get request to get all the jobs posted by the client
        builder
            .addCase(GetClientsJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(GetClientsJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.Clientjobs = action.payload?.Clientjobs || [];
                state.message = action.payload?.message || null;
            })
            .addCase(GetClientsJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get client jobs.';
            });

        // update job status
        builder
            .addCase(UpdateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(UpdateJob.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.message = action.payload.message;
                
                const updatedJobId = action.meta.arg.gigId;

                //  update job inside Clientjobs array
                state.Clientjobs = state.Clientjobs.map((job) =>
                    job._id === updatedJobId
                        ? { ...job, status: action.meta.arg.status }
                        : job
                );

            })

            .addCase(UpdateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update job status.';
            });

        // delete job
        builder
            .addCase(DeleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeleteJob.fulfilled, (state, action) => {
                state.loading = false;

                const deletedJobId = action.payload.job._id;
                state.jobs = state.jobs.filter(
                    (job) => job._id !== deletedJobId
                );

                state.message = action.payload.message;
            })
            .addCase(DeleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete job';
            });

    }

});

export const { setSearchGig, setFilterdGig, setPageNo } = jobSlice.actions;
export default jobSlice.reducer;