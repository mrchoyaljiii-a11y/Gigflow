import { useState, useEffect } from 'react'
import { Routes, Route, Link, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './style/App.css'
import Layout from './components/Layout'
import Home from './pages/Home';
import JobPosting from './pages/Navigation/JobPosting';
import { useSelector, useDispatch } from 'react-redux';
import { Getjob } from './redux/slices/job_slice.js'; // get all jobs
import {GetAllBids} from './redux/Bid/Bid_slice.js' // get all bids
import Login from './pages/Authntications/Login.jsx';
import SignUp from './pages/Authntications/SignUp.jsx';
import { checkLogin } from "./redux/Auth/Auth.js"
import ProtectedRoute from './middleware/ProtectedRoute.jsx';
import MyGigs from './pages/Navigation/MyGigs.jsx';
import Profile from './pages/Navigation/Profile.jsx';
import Message from './pages/Navigation/Message.jsx';
import Detailed_gig from './pages/Detailed_gig/Detailed_gig.jsx';
import AllBids from './pages/view_all_bids/AllBids.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/my-gigs", element: <ProtectedRoute><MyGigs /></ProtectedRoute>
      },
    ]
  },
  {
    path: "/job-posting", element: <ProtectedRoute><JobPosting /></ProtectedRoute>
  },
  {
    path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/message", element: <ProtectedRoute><Message /></ProtectedRoute>
  },
  {
    path: "/detailed_gig/:id", element: <ProtectedRoute><Detailed_gig /></ProtectedRoute>
  },
  {
    path: "/bids/:gig_id", element: <ProtectedRoute><AllBids /></ProtectedRoute>
  }
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Getjob());
    dispatch(checkLogin());
    dispatch(GetAllBids());
    
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
