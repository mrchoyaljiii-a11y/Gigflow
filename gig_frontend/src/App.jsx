import { useEffect, useRef } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { socket } from './socket/socket.js'

import { useDispatch, useSelector } from "react-redux";
import "./style/App.css";


import Layout from "./components/Layouts/Layout.jsx";
// ShowToast

import ShowToast from './components/Toasts/ShowToast.jsx';

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
import Freelancer_page from "./pages/Navigation/Clients-Navigations/Freelancer_page.jsx";
import View_freelancer_profile from "./pages/freelancer_releted/View_freelancer_profile.jsx";
import Search_filters from "./components/Search_filters.jsx";
import Job_section from "./pages/Navigation/Freelancers-Navigations/Job_section.jsx";

import Myproposals from "./pages/Navigation/Freelancers-Navigations/Myproposals.jsx";
import Detailed_bid from "./pages/freelancer_releted/Detailed_bid.jsx";
import { addNotification, fetchNotifications } from "./redux/Notification_actions/Notifications_actions.js";
import { updateBidLive, updateBidStatusLive, addBidLive } from './redux/Bid/Bid_slice.js';
import Detailed_jobInfo from "./pages/client_releted/Detailed_jobInfo.jsx";

import Freelancer_dashboard_layout from './pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Freelancer_dashboard_layout.jsx';
import Second_Layout from "./components/Layouts/Second_Layout.jsx";
import Profile_section from "./pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Profile_section.jsx";
import Dashboard_section from "./pages/Navigation/Freelancers-Navigations/Freelaner_Profile/Dashboard_section.jsx";

//contract pages
import ContractPage from './pages/ContractPages/ContractPage.jsx'

//apis
import { useGetUserInfo } from './hooks/Client_releted/useGetUserInfo.js'
import Client_Dashboard_layout from "./pages/Navigation/Clients-Navigations/client-profile/Client_Dashboard_layout.jsx";
import Client_Dashboard from "./pages/Navigation/Clients-Navigations/client-profile/Client_Dashboard.jsx";
import Client_contracts from "./pages/Navigation/Clients-Navigations/client-profile/Client_contracts.jsx";
import Client_MYprofile from './pages/Navigation/Clients-Navigations/client-profile/Client_MYprofile.jsx';
import Error_componet from './components/Error_componet.jsx';
import useAppSocket from "./hooks/APPsocket/useAppSocket.js";
import Notification_show from "./components/Notification_show.jsx";
import GlobalLayout from "./components/Layouts/GlobalLayout.jsx";


const router = createBrowserRouter([
  {
    path: "*",
    element: <Error_componet type="404" />
  },

  {
    element: <GlobalLayout />,
    children: [

      /*  PUBLIC LANDING PAGE */
      {
        path: "/",
        element: <First_page />, // Landing page
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
            element: (<Freelancer_dashboard_layout />),
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


      // client profile + header with no footer
      {
        path: '/Client',
        element: (<Second_Layout />
        ),

        children: [
          {
            path: '',
            element: (<Client_Dashboard_layout />),
            children: [
              {

                index: true,
                element: (<Client_Dashboard />)
              },
              {
                path: "/Client/Contracts",
                element: <Client_contracts />
              },
              {
                path: "/Client/MyProfile",
                element: <Client_MYprofile />
              }
            ]
          },
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
            element: (<div
            className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 ml-3"
            >
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
        path: '/freelancers_profile/:freelancerid',
        element: <View_freelancer_profile />
      },
      // demo contract pages links
      {
        path: '/contracts/:contractId',
        element: <ContractPage />
      }
    ]

  }
]);


function App() {

  const dispatch = useDispatch();
  const { islogin, authChecked } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth?.user);

  const userData = useSelector(
    state => state.userSlice?.userData
  );

  useEffect(() => {
    dispatch(checkLogin());   // checks token validity
  }, [dispatch]);


  useEffect(() => {
    if (!authChecked) return;

    if (!islogin) return;

    socket.connect();
    dispatch(fetchUser());  // fetch user after login

  }, [authChecked, islogin, dispatch]);

//   console.log("🔥 APP RENDER", {
//     userId: user?._id,
//     userName: user?.firstName,
//     socketConnected: socket.connected,
//     socketId: socket.id,
// });

  // console.log("userData in app.jsx", userData);

  useEffect(() => {

    if (!userData?._id) return;

    console.log(
      "✅ User data ready in app.jsx:",
      userData._id,
      userData.firstName
    );

    dispatch(GetClientsJobs());

    dispatch(GetAllBids());

    dispatch(fetchNotifications());

  }, [userData?._id, dispatch]);

  // console.log("user in app.jsx", user?._id, "user name", user?.firstName);

  //* SOCKET CONNECTION
  useAppSocket(socket, userData?._id, userData?.firstName);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
