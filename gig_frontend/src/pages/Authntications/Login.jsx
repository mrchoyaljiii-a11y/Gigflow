import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../redux/Auth/Auth'
import { showToast } from '../../redux/Tost/Tost_slice'
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    // const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, error, loading, message, islogin } = useSelector((state) => state.auth);

    // console.log("islogin:", islogin);

    const onSubmit = async (data) => {
        setServerError(null);
        // setLoading(true);
        try {
            const result = await dispatch(loginUser(data)).unwrap();

            if (result.success) {
                dispatch(showToast(result.message));
                navigate('/');
            }
            } 
            catch (err) {
                console.error('Login error', err);
                setServerError(err.response?.data?.message || 'Login failed.');
            } finally {
                // setLoading(false);
            }
        }

    return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>

                {serverError && (
                    <div className="mb-4 text-red-600">{serverError}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                            })}
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border rounded px-3 py-2"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-300"

                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600">Don't have an account? <span className='text-blue-600 font-semibold'> <NavLink to="/signup">Sign up</NavLink></span></p>
            </div>
        )
    }

    export default Login
