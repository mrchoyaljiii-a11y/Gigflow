import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/axios'
import axios from 'axios';


//add the job
export const Addjob = createAsyncThunk('job/Addjob', async (jobData, {rejectWithValue}) => {

    try {
        const res = await api.post("/api/gigs", jobData,{withCredentials:true});

        return res.data; //backend response

    } catch (error) {
        console.log("from adding a job",error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while adding the job.'
        });
    }
});


// get the job 
export const Getjob = createAsyncThunk('job/Getjob', async (_, {rejectWithValue}) => {
    try {
        const res = await api.get("/api/get/gigs",{withCredentials:true});
        // console.log("Getjob response:", res.data);
        return res.data; //backend response
    } 
    catch (error) {
         console.log("from getting a job",error);
        return rejectWithValue(error.response?.data || {
            message: 'An error occurred while getting the job.'
        });
    }
});

const jobSlice = createSlice({
    name: 'job',
    initialState: {
        jobs:[],
        data: null,
        loading: false,
        error: null,
        message: null,
        searchGig:null,
        filterdGig:null
    },

    reducers:{
        setSearchGig:(state,action)=>
        {
            state.searchGig = action.payload;
        },
        setFilterdGig:(state,action)=>
        {
            state.filterdGig = action.payload;
        }
    },
    extraReducers:(builder) =>{
        // add cases for Addjob post request
        builder
        .addCase(Addjob.pending,(state)=>
        {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(Addjob.fulfilled,(state,action)=>
        {
            state.loading = false;
            state.data = action.payload;
            state.message = action.payload.message;
        })
        .addCase(Addjob.rejected,(state,action)=>
        {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to add job.';
        });

        // add cases for Getjob get request

        builder
        .addCase(Getjob.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(Getjob.fulfilled,(state,action)=>
        {
            state.loading = false;
            state.jobs = action.payload?.jobs || [];
            state.message = action.payload?.message || null;
        })
        .addCase(Getjob.rejected,(state,action)=>
        {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to get jobs.';
        });
    }

});
export const{setSearchGig,setFilterdGig} = jobSlice.actions;
export default jobSlice.reducer;