import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineVideoCamera,
  HiOutlineDotsHorizontal,
  HiOutlineStatusOnline,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

import { HiBellAlert } from "react-icons/hi2";

import {
  FiPlus,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import { IoMdNotifications } from "react-icons/io";
import { IoChatbox } from "react-icons/io5";

import { CiCircleRemove } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, Show_notification_component } from "../../redux/Notification_actions/Notifications_actions";

const ContractHeader = ({ contracrtData, setShowChat }) => {

  const dispatch = useDispatch();
  const { user: loginUser } = useSelector((state) => state.auth);
 
  const { notifications, unreadCount } = useSelector((state) => state.Notification_actions_slice);
  // console.log("user in contract page loginUser", loginUser);

  let UserRole = null;

  const IsClient = loginUser?.role === "client";
  const IsFreelancer = loginUser?.role === "freelancer";

  const navigate = useNavigate();

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-xl">

      <div className="relative mx-auto max-w-[1800px] px-5 py-3.5 lg:px-8">

        {/* Top Row */}
        <div className={`flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between ${IsFreelancer ? "flex flex-row justify-between items-center" : ""}`}>

          {/* Left */}
          <div className="flex items-start gap-4">
            {/* Back Button */}

            <button
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-white/10
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/20
                hover:shadow-lg
              "
              onClick={() => navigate(-1)}
            >
              <HiArrowLeft size={22} />
            </button>

            {/* Contract Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl capitalize">
                  {contracrtData.contractTitle}
                </h1>

                <div
                  className="
                    flex items-center gap-2
                    rounded-full
                    bg-green-500/90
                    px-3 py-1
                    text-sm
                    font-semibold
                    text-emerald-100
                    ring-1
                    ring-emerald-300/30
                    backdrop-blur
                    capitalize
                  "
                >
                  <HiOutlineStatusOnline size={14} />
                  {contracrtData.contractStatus}
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-blue-100/90">
                <span className="cursor-pointer transition hover:text-white">
                  Dashboard
                </span>

                <span>/</span>

                <span className="cursor-pointer transition hover:text-white">
                  Contracts
                </span>

                <span>/</span>

                <span className="font-medium text-white">
                  E-Commerce Website Redesign
                </span>

              </div>
            </div>
          </div>

          {/* show Right side wwhen role === client */}

          {!IsFreelancer && (

            <div className=" flex flex-row items-center justify-between gap-3">


              <div className="flex flex-wrap items-center gap-3">
                {/* Add Milestone */}
                {/* <button
                  className="
                group
                flex items-center gap-2
                rounded-xl
                border border-white/20
                bg-white/10
                px-5 py-3
                font-medium
                text-white
                backdrop-blur-md

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-white/20
                hover:shadow-xl
              "
                >
                  <FiPlus
                    size={18}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                  Add Milestone
                </button> */}

                {/* Release Payment */}

                {/* <button
                  className="
                group
                flex items-center gap-2
                rounded-xl

                bg-emerald-500

                px-5 py-3

                font-medium
                text-white

                shadow-lg

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-emerald-600
                hover:shadow-2xl
              "
                >
                  <HiOutlineCurrencyDollar
                    className="transition-transform duration-300 group-hover:scale-110"
                    size={20}
                  />
                  Release Payment
                </button> */}

                {/* Video Call */}
                <button
                  className="
                group
                flex items-center gap-2

                rounded-xl

                border border-white/20

                bg-red-500

                px-5 py-3

                text-white

                backdrop-blur-md

                transition-all
                duration-300

                hover:-translate-y-1
                hover:bg-white/20
                
              "
                >
                  <CiCircleRemove
                    className="transition-transform group-hover:scale-110 font-semibold"
                    size={22}
                  />

                  Cancle Contract
                </button>
              </div>

              {/* Notification bell  and chat (//?chat for small screen only) */}


              <div className=" flex flex-row items-center justify-between gap-3">

                {/* notification bell */}
                <button
                  className="group relative flex h-11 w-11 items-center justify-center
                        rounded-full bg-blue-50 border border-blue-100
                        shadow-sm transition-all duration-200
                        hover:bg-blue-100 hover:border-blue-300
                        hover:shadow-md cursor-pointer"

                  onClick={() => {
                    dispatch(Show_notification_component(true));
                    dispatch(fetchNotifications());
                  }}
                >
                  {/* Bell */}
                  <HiBellAlert
                    size={22}
                    className="text-blue-600 transition-all duration-200 group-hover:text-blue-700 hover:scale-110 "
                  />

                  {/* Animated Notification Dot */}
                  {unreadCount > 0 && (
                    <>
                      {/* Notification Count */}
                      <span
                        className="absolute -top-1.5 -right-1.5
                              min-w-[20px] h-5 px-1
                              flex items-center justify-center
                              rounded-full bg-gradient-to-r from-blue-600 to-blue-500
                              text-[10px] font-bold text-white
                              border-2 border-white shadow-lg"
                      >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping"></span>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    </>
                  )}
                </button>

                {/* chat */}
                <button
                  className="group relative flex h-11 w-11 items-center justify-center
                        rounded-full bg-blue-50 border border-blue-100
                        shadow-sm transition-all duration-200
                        hover:bg-blue-100 hover:border-blue-300
                        hover:shadow-md lg:hidden cursor-pointer"

                  onClick={() => {
                    setShowChat((prev) => !prev);
                  }}
                >

                  <IoChatbox
                    size={22}
                    className="text-blue-600 transition-all duration-200 group-hover:text-blue-700 hover:scale-110 "
                  />

                  <span
                    className="absolute -top-1.5 -right-1.5
                              min-w-[20px] h-5 px-1
                              flex items-center justify-center
                              rounded-full bg-gradient-to-r from-blue-600 to-blue-500
                              text-[10px] font-bold text-white
                              border-2 border-white shadow-lg"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping"></span>
                    {unreadCount > 99 ? "99+" : unreadCount}

                  </span>
                </button>

              </div>

            </div>
          )}


          {!IsClient && (
            <div className=" flex flex-row items-center justify-between gap-3">

              {/* notification bell */}
              <button
                className="group relative flex h-11 w-11 items-center justify-center
                        rounded-full bg-blue-50 border border-blue-100
                        shadow-sm transition-all duration-200
                        hover:bg-blue-100 hover:border-blue-300
                        hover:shadow-md cursor-pointer"

                onClick={() => {
                  dispatch(Show_notification_component(true));
                  dispatch(fetchNotifications());
                }}
              >
                {/* Bell */}
                <HiBellAlert
                  size={22}
                  className="text-blue-600 transition-all duration-200 group-hover:text-blue-700 hover:scale-110 "
                />

                {/* Animated Notification Dot */}
                {unreadCount > 0 && (
                  <>
                    {/* Notification Count */}
                    <span
                      className="absolute -top-1.5 -right-1.5
                              min-w-[20px] h-5 px-1
                              flex items-center justify-center
                              rounded-full bg-gradient-to-r from-blue-600 to-blue-500
                              text-[10px] font-bold text-white
                              border-2 border-white shadow-lg"
                    >
                      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping"></span>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {/* chat */}
              <button
                className="group relative flex h-11 w-11 items-center justify-center
                        rounded-full bg-blue-50 border border-blue-100
                        shadow-sm transition-all duration-200
                        hover:bg-blue-100 hover:border-blue-300
                        hover:shadow-md lg:hidden cursor-pointer"

                onClick={() => {
                  setShowChat((prev) => !prev);
                }}
              >

                <IoChatbox
                  size={22}
                  className="text-blue-600 transition-all duration-200 group-hover:text-blue-700 hover:scale-110 "
                />

                <span
                  className="absolute -top-1.5 -right-1.5
                              min-w-[20px] h-5 px-1
                              flex items-center justify-center
                              rounded-full bg-gradient-to-r from-blue-600 to-blue-500
                              text-[10px] font-bold text-white
                              border-2 border-white shadow-lg"
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping"></span>
                  {unreadCount > 99 ? "99+" : unreadCount}

                </span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default ContractHeader;