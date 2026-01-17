import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../../api/axios'
import axios from "axios";

//user registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post('http://localhost:3000/api/auth/register', userData, { withCredentials: true });
        return res.data; //backend response

    }
    catch (error) {
        console.log("Backend error:", error.response.data);
        return rejectWithValue(error.response?.data || { signup_error: ["Signup failed"] });
    }
});

//user login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post('http://localhost:3000/api/auth/login', credentials, { withCredentials: true });
        // console.log("Login response data:", res.data);
        return res.data; //backend response
    }
    catch (error) {
        console.log("Backend error:", error.response.data);
        return rejectWithValue(error.response?.data || { login_error: ["Login failed"] });
    }
});

// check if user is logged in
export const checkLogin = createAsyncThunk('auth/checkLogin', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('http://localhost:3000/api/auth/check', { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Not logged in");
    }
});

//logout user
export const LogoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('http://localhost:3000/api/auth/logout', { withCredentials: true });
        return res.data;
    }
    catch (error) {
        console.log("Backend error:", error.response.data);
        return rejectWithValue(error.response?.data?.message || "Logout failed");
    }

})

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, //user info from backend
        error: null,
        loading: false,
        message: null,
        islogin: false,
    },
    extraReducers: (builder) => {
        //register user
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        //login user
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.islogin = action.payload.success;
                // console.log("islogin", state.islogin)
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // check user login or not 
        builder
            .addCase(checkLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(checkLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.islogin = action.payload.success;
                // console.log("islogin in check login", state.islogin)
                state.user = action.payload.user || null;
            })
            .addCase(checkLogin.rejected, (state, action) => {
                state.loading = false;
                state.islogin = false;
                state.user = null;
                state.error = action.payload || "Not logged in";
            });

            //Logout user 
            builder
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null; 
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.islogin = false;
                state.user = null;
                state.message = action.payload.message;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default AuthSlice.reducer;
