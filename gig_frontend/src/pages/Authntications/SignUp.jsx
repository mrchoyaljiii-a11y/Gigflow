import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../redux/Auth/Auth'
import { useDispatch, useSelector } from 'react-redux'

const SignUp = () => {
    const dispatch = useDispatch();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setServerError(null);
        try {
            dispatch(registerUser(data))
            // navigate('/login');
        }
        catch (error) {
            console.log("Signup error", error);
            setServerError(error.response?.data?.message || 'Signup failed.');
        }
    }

    const password = watch('password', '');

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow mb-20">
            <h2 className="text-2xl font-semibold mb-4">Create an account</h2>

            {serverError && (
                <div className="mb-4 text-red-600">{serverError}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">First name</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        {...register('firstName', {
                            required: 'First name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Last name</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        {...register('lastName', {
                            required: 'Last name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>

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

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary/90 text-white py-2 rounded pointer-cursor hover:bg-primary/80 transition-colors duration-200"
                >
                    Sign up
                </button>

            </form>

            <p className="mt-4 text-sm text-gray-600">Already have an account? <a className="text-blue-600" href="/login">Login</a></p>
        </div>
    )
}

export default SignUp
