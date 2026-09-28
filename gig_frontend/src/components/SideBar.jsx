import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoSendOutline, IoBagCheckOutline } from "react-icons/io5";
import { FaRegCircleUser, FaBolt } from "react-icons/fa6";
import {
  MdOutlineExplore,
  MdTravelExplore
} from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { GoHome, GoSidebarCollapse, GoSidebarExpand, GoBookmark, GoFile } from "react-icons/go";

const navLinksForClinet = [
  { label: "Home", icon: GoHome, path: "/home" },
  { label: "My Gigs", icon: IoBagCheckOutline, path: "/home/my-gigs" },
  { label: "Post Gig", icon: CiCirclePlus, path: "/home/job_posting" },
  { label: "Find Freelancers", icon: MdTravelExplore, path: "/home/Find_freelancers" },
  { label: "Profile", icon: FaRegCircleUser, path: "/userProfile" },
]

const navLinksForFreelancers = [
  { label: "Home", icon: GoHome, path: "/home" },
  { label: "Explore Jobs", icon: MdOutlineExplore, path: "/home/explore" },
  { label: "My proposals", icon: IoSendOutline, path: "/home/my-proposals" },
  { label: "Saved jobs", icon: GoBookmark, path: "/saved-jobs" },
  { label: "Contracts", icon: GoFile, path: "/contracts" },
  { label: "Profile", icon: FaRegCircleUser, path: "/userProfile" },
]

const SideBar = () => {
  const [ishover, Setishover] = useState(false);
  const [expand, Setexpand] = useState(false);
  const { userData, loading, error } = useSelector(
    (state) => state.userSlice
  );

  const role = userData?.role;

  const Navlinks = role === "client" ? navLinksForClinet : navLinksForFreelancers;

  const handleMouseEnter = () => {
    if (expand) return
    Setishover(true);
  };

  const handleMouseLeave = () => {
    if (expand) return
    Setishover(false);
  };

  if (!userData) return null;

  return (
    <div className={`fixed top-0 left-0 h-screen ${expand ? "w-56" : "w-15"} bg-white/7 border-r border-white/20 shadow-sm flex flex-col items-center py-4 z-100 backdrop-blur-lg  mb-1.5 transition-all duration-300 ease-in-out `}>

      {/* logo */}
      <div className={`icon flex justify-between items-center  p-2 rounded-md  ${ishover ? 'bg-white text-black' : 'bg-primary text-white'} ${expand ? "w-full" : ""} `}

        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      // onClick={() => Setexpand(!expand)}
      >
        {!expand && ishover ? (
          <div
            className="cursor-pointer flex items-center justify-center w-full h-full "
            onClick={() => Setexpand(!expand)}
          >
            <GoSidebarCollapse size={20} />
          </div>
        ) : (
          <div className={`${!expand ? "flex items-center justify-center w-full h-full" : ""}`}>
            <NavLink to='/home' className={`flex items-center `}>
              <div className={`icon bg-primary text-white rounded-md  ${expand ? "p-2" : ""}`}>
                <FaBolt size={20} />
              </div>

              {expand && <h1 className="font-semibold text-primary text-xl">GigFlow</h1>}
            </NavLink>
          </div>
        )}

        {expand && <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded-xl"

          onClick={() => Setexpand(!expand)}
        >
          <GoSidebarExpand size={20} />
        </div>}

      </div>

      {/* links */}
      <nav className="flex flex-col gap-1 mt-8 w-full px-2 ">
        {Navlinks.map(({ label, icon: Icon, path }) => {
          // const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/home"}
              title={!expand ? label : undefined}
              className={({ isActive }) => `flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${expand ? "justify-start" : "justify-center"
                } 
               ${isActive
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-gray-600 hover:bg-black/5"
                }
                hover:text-priamary font-medium hover:border`}
            >
              <Icon size={22} className="shrink-0" />
              {expand && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

    </div>
  )
}

export default SideBar
