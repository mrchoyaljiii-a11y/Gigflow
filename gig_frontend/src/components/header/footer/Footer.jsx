import React from 'react'
import { NavLink } from 'react-router-dom';
import { MdOutlineExplore, MdDashboard, MdTravelExplore } from "react-icons/md";
import { IoBagCheckOutline,IoSend  } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

import { useDispatch, useSelector } from 'react-redux'

const Footer = () => {

  const { userData, loading, error } = useSelector(
    (state) => state.userSlice
  );

  const role = userData?.role;

  if (!userData) return null;


  // console.log("role", role);

  return (
    <footer className="fixed bottom-0 left-0 w-full border-t border-slate-200 z-50  bg-white/70 backdrop-blur-sm shadow-sm">

      {role === "client" && (<div className="flex justify-around items-center py-3">

        {/* Explore and dashboard */}

        {
          role === "client" && <NavLink
            to="/home"
            className={({ isActive }) =>
              `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
            }
          >
            <MdDashboard size={22} />
            <span className="text-xs mt-1">Dashboard</span>
          </NavLink>
        }


        {
          role === "freelancer" && <NavLink
            to="/home"
            className={({ isActive }) =>
              `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
            }
          >
            <MdOutlineExplore size={22} />
            <span className="text-xs mt-1">Explore</span>

          </NavLink>
        }

        {/* My Gigs */}
        <NavLink
          to="/home/my-gigs"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }
        >
          <IoBagCheckOutline size={22} />
          <span className="text-xs mt-1">My Gigs</span>
        </NavLink>


        {/* Post Gig  */}
        <NavLink to="/home/job_posting">
          <div className="flex flex-col items-center text-primary cursor-pointer font-medium">
            <CiCirclePlus size={34} />
            <span className="text-xs -mt-1 font-medium">Post</span>
          </div>
        </NavLink>


        {/* Messages */}
        <NavLink to="/home/Find_freelancers"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }>
          <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
            <MdTravelExplore size={22} />
            <span className="text-xs mt-1">Find Freelancers</span>
          </div>
        </NavLink>


        {/* Profile */}
        <NavLink to="/userProfile"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }>
          <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
            <CgProfile size={22} />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </NavLink>
      </div>)
      }


      {/* for freelancer's Navigations links */}

      {role === "freelancer" && (<div className="flex justify-around items-center py-3">

        {/* Explore and dashboard */}

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }
        >
          <MdDashboard size={22} />
          <span className="text-xs mt-1">Dashboard</span>
        </NavLink>

        <NavLink
          to="/home/explore"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }
        >
          <MdOutlineExplore size={22} />
          <span className="text-xs mt-1">Explore</span>
        </NavLink>


       
        <NavLink
          to="/home/my-proposals"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }
        >
          <IoSend  size={22} />
          <span className="text-xs mt-1">My proposals</span>
        </NavLink>


       
        {/* <NavLink to="/home/job_posting">
          <div className="flex flex-col items-center text-primary cursor-pointer font-medium">
            <CiCirclePlus size={34} />
            <span className="text-xs -mt-1 font-medium">Post</span>
          </div>
        </NavLink>


        
        <NavLink to="/home/Find_freelancers"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }>
          <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
            <MdTravelExplore size={22} />
            <span className="text-xs mt-1">Find Freelancers</span>
          </div>
        </NavLink> */}


        {/* Profile */}
        <NavLink to="/userProfile"
          className={({ isActive }) =>
            `group flex flex-col items-center cursor-pointer font-medium
     ${isActive ? "text-primary" : "text-slate-500 hover:text-primary"}`
          }>
          <div className="flex flex-col items-center text-slate-500 hover:text-primary cursor-pointer font-medium">
            <CgProfile size={22} />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </NavLink>
        
      </div>)
      }

    </footer>
  );
}

export default Footer
