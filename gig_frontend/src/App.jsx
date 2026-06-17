import { useEffect, useRef } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
});

import { useDispatch, useSelector } from "react-redux";
import "./style/App.css";


import Layout from "./components/Layout";


import First_page from "./pages/Initial_page/First_page.jsx";
import Login from "./pages/Authntications/Login.jsx";
import SignUp from "./pages/Authntications/SignUp.jsx";


import Home from "./pages/Home";
import JobPosting from "./pages/Navigation/Clients-Navigations/JobPosting.jsx";
import MyGigs from "./pages/Navigation/Clients-Navigations/MyGigs.jsx";
import Profile from "./pages/Navigation/Clients-Navigations/Profile.jsx";
import Message from "./pages/Navigation/Clients-Navigations/Message.jsx";
import Detailed_gig from "./pages/freelancer_releted/Detailed_gig.jsx";
import AllBids from "./pages/client_releted/AllBids.jsx";
import Job_posting from "./pages/Navigation/Clients-Navigations/Job_posting.jsx";
import ProfileForm from "./pages/profile/ProfileForm.jsx";
import UserProfile from "./pages/profile/UserProfile.jsx";

// protected rote
import ProtectedRoute from "./middleware/ProtectedRoute.jsx";

/*  Redux  */
import { GetClientsJobs, Getjob } from "./redux/slices/job_slice.js";
import { GetAllBids, GetBidsByFreelancer, } from "./redux/Bid/Bid_slice.js";
import { checkLogin } from "./redux/Auth/Auth.js";
import { fetchUser } from "./redux/getUser/User.js";

import ClientDashboard from "./pages/Navigation/Clients-Navigations/ClientDashboard.jsx";
import Freelancer_page from "./pages/freelancer_releted/Freelancer_page.jsx";
import View_freelancer_profile from "./pages/freelancer_releted/View_freelancer_profile.jsx";
import Search_filters from "./components/Search_filters.jsx";
import Job_section from "./components/Job_section.jsx";

import Myproposals from "./pages/Navigation/Freelancers-Navigations/Myproposals.jsx";
import Detailed_bid from "./pages/freelancer_releted/Detailed_bid.jsx";
import { addNotification, fetchNotifications } from "./redux/Notification_actions/Notifications_actions.js";
import { updateBidLive, updateBidStatusLive, addBidLive } from './redux/Bid/Bid_slice.js';
import Detailed_jobInfo from "./pages/client_releted/Detailed_jobInfo.jsx";

import Freelancre_own_profile from './pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Freelancre_own_profile.jsx';
import Second_Layout from "./components/Second_Layout.jsx";
import Profile_section from "./pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Profile_section.jsx";
import Dashboard_section from "./pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Dashboard_section.jsx";

//contract pages
import ClientContractPage from './pages/ContractPages/ClientContractPage.jsx'

const router = createBrowserRouter([
  /*  PUBLIC LANDING PAGE */
  {
    path: "/",
    element: <First_page />,
  },

  /*  AUTH */
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  // freelancer own profile + header with no footer
  {
    path: '/freelancer_own_profile',
    element: (<Second_Layout />

    ),

    children: [
      {
        path: '',
        element: (<Freelancre_own_profile />),
        children: [
          {
            index: true,
            element: (<Profile_section />)
          },
          {
            path: 'dashboard',
            element: (<Dashboard_section />)
          }
        ]
      }
    ]
  },

  /*  logged-in  */
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "my-gigs",
        element: <MyGigs />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "Find_freelancers",
        element: <Freelancer_page />,
      },
      {
        path: "detailed_gig/:id",
        element: <Detailed_gig />,
      },
      {
        path: "bids/:gig_id",
        element: <AllBids />,
      },
      {
        path: 'deshboard',
        element: <ClientDashboard />
      },
      {
        path: 'job_posting',
        element: <Job_posting />
      },

      {
        path: "my-proposals",
        element: <Myproposals />
      },

      {
        path: 'detailed_job_info/:job_id',
        element: <Detailed_jobInfo />
      },

      // freelancer routes
      {
        path: "explore",
        element: (<div>
          <Search_filters />
          <Job_section />
        </div>)
      },
      {
        path: 'freelancer/detailed-bid/:bid_id',
        element: <Detailed_bid />
      }
    ],
  },

  /*  profile pages */
  {
    path: "/createAccount",
    element: <ProfileForm />,
  },
  {
    path: "/userProfile",
    element: <UserProfile />,
  },

  {
    path: '/freelancers_profile/:id',
    element: <View_freelancer_profile />
  },
  // demo contract pages links
  {
    path:'/contract/:freelancerId',
    element:<ClientContractPage/>
  }

]);


function App() {

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(checkLogin());   // checks token validity
    dispatch(fetchUser());    // fetch user after login
    dispatch(GetClientsJobs());      // all jobs of a client
    dispatch(GetAllBids());   // only works if logged in
    dispatch(fetchNotifications()); // fetch notifications for logged in user
  }, [dispatch]);

  const user = useSelector((state) => state.auth?.user);

  // GET LOGGED-IN USER

  const hasRegistered = useRef(false);

  console.log("user in app.jsx", user?._id, "user name", user?.firstName);

  //  SOCKET CONNECTION
  useEffect(() => {
    if (!user?._id) return;

    // ! for real-time bid viewed by client in freelancer dashboard.
    const handleBidViewed = (updatedBid) => {
      // console.log("👁️ Bid viewed real-time:", updatedBid);
      dispatch(updateBidLive(updatedBid)); //  update instantly
    };
    socket.on("bid_viewed", handleBidViewed);


    // ! for real-time add bid in client view all bids.
    const handleaddBidLive = (newBid) => {
      // console.log(" New bid received real-time:", newBid);
      dispatch(addBidLive(newBid)); //  update instantly
    };
    socket.on("new_bid", handleaddBidLive);

    // ! for real-time bid status update
    const handleStatus = ({ bidId, status }) => {
      dispatch(updateBidStatusLive({ bidId, status }));
    };
    socket.on("bid_status_updated", handleStatus);


    if (hasRegistered.current) return;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("register", user._id);
      console.log("📡 Socket registered:", user._id);
      hasRegistered.current = true;
    };


    const handleNotification = (data) => {
      console.log("🔔 New Notification:", data);
      dispatch(addNotification(data));
    };
    socket.on("new_notification", handleNotification);

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("bid_viewed", handleBidViewed);
      socket.off("new_notification", handleNotification);
      socket.off("bid_status_updated", handleStatus);
      socket.off("new_bid", handleaddBidLive);
    };

  }, [user?._id]);

  return <RouterProvider router={router} />;
}

export default App;
