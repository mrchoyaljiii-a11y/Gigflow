import React, { useState, useRef, useEffect } from "react";
import {
  FaPlusCircle, FaSearchPlus, FaAngleRight, FaAngleLeft,
  FaBriefcase, FaRocket, FaUsers, FaCheckCircle, FaArrowRight, FaClipboardList,
  FaRegLightbulb,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecommendedFreelancers } from '../../../redux/getUser/User'
import { useGetJobs } from '../../../hooks/job_releted/useGetJobs';

const ClientDashboard = () => {

  const {
    data: clientjobs = {},
    isLoading: jobsLoading,
    error: jobsError,
    isError: jobsIsError,
    refetch: jobsRefetch,
  } = useGetJobs();

  console.log("client jobs in client dashboard", clientjobs?.Clientjobs);



  const dispatch = useDispatch();
  // fetching the freelancer data for showing in recommended freelancers

  const { recommendedFreelancers, recommendedLoading } = useSelector(state => state.userSlice)

  useEffect(() => {
    dispatch(fetchRecommendedFreelancers());
  }, []);

  // console.log("Clientjobs in client dashboard", Clientjobs);

  const { AllBids, Bids, loading: bidLoading, error: bidError } = useSelector((state) => state.BidSlice);

  const getBidCountByGig = (gigId) => {
    return AllBids.filter((bid) => bid.gigId === gigId).length;
  };

  const getActiveJobsCount = () => {
    return clientjobs?.Clientjobs?.filter((job) => job.status === "active").length;
  };

  const getAssignedJobsCount = () => {
    return clientjobs?.Clientjobs?.filter((job) => job.status === "assigned").length;
  };

  const AlljobsCount = clientjobs?.Clientjobs?.length;

  const ClientProfileImg = clientjobs?.Clientjobs?.[0]?.clientId?.profileImage?.url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80";

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300, // scroll amount
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };


  return (

    <main className="hero-section max-w-320 mx-auto mb-20">

      {/* hero section */}
      <section>
        <div
          className="relative overflow-hidden rounded-3xl
    bg-gradient-to-r from-secondary/10 via-white to-secondary/5
    border border-secondary/10"
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-40 w-52 h-52 bg-secondary/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex justify-between items-center min-h-[340px] px-8 lg:px-16">

            {/* Left Side */}
            <div className="max-w-2xl">
              <h1 className="text-secondary text-5xl font-extrabold leading-tight">
                Welcome back,
                <span className="uppercase text-primary ml-2">
                  Satish
                </span>
              </h1>

              <p className="mt-5 text-[#4c669a] text-lg leading-8">
                Track your active milestones, manage your hired talent,
                and kickstart your next ambitious project today.
              </p>

              <div className="flex gap-4 mt-8">
                <NavLink to="/home/job_posting">
                  <button
                    className="flex items-center gap-3
              px-7 h-12 rounded-xl
              bg-secondary text-white
              font-bold shadow-lg
              hover:scale-105
              transition-all"
                  >
                    <FaPlusCircle size={22} />
                    Post a Job
                  </button>
                </NavLink>

                <NavLink to="/home/Find_freelancers">
                  <button
                    className="flex items-center gap-3
              px-7 h-12 rounded-xl
              bg-white text-secondary
              font-bold shadow-lg
              hover:scale-105
              transition-all"
                  >
                    <FaSearchPlus size={22} />
                    Hire Freelancer
                  </button>
                </NavLink>
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex relative items-center justify-center">

              {/* Glow */}
              <div
                className="absolute w-80 h-80 bg-primary/20 rounded-full blur-3xl" ></div>

              {/* Outer Ring */}
              <div
                className="relative w-72 h-72 rounded-full p-2 bg-gradient-to-br from-primary
           via-secondary to-primary shadow-2xl hover:scale-105 transition-all duration-500" >
                {/* Image */}
                <img
                  src={ClientProfileImg}
                  alt="Client"
                  className="w-full h-full rounded-full object-cover border-6 border-white"
                />

                {/* Online Badge */}
                <div
                  className="absolute bottom-6 right-6
            w-8 h-8
            rounded-full
            bg-green-500
            border-4 border-white"
                ></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* States + allActive jobs + No jobs section*/}

      {
        AlljobsCount > 0 ? (
          <div className="mainContant ">

            {/* states */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">

              {/* 1st */}
              <div className="flex flex-col gap-2 rounded-xl bg-white  p-6 border border-[#cfd7e7]  shadow-sm">

                <div className="flex justify-between items-start">
                  <p className="text-[#4c669a] text-sm font-medium leading-normal">Total Jobs</p>

                </div>
                <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">{AlljobsCount}</p>
                <div className="flex items-center gap-1 text-[#07883b] text-sm font-bold">

                  {/* <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+5.2%</span>
            <span className="text-xs font-normal text-[#4c669a] ml-1">vs last month</span> */}

                </div>
              </div>

              {/* 2nd */}

              <div className="flex justify-between gap-2 rounded-xl bg-white  p-6 border border-[#cfd7e7]  shadow-sm">

                <div className="div">
                  <div className="flex justify-between items-start">
                    <p className="text-green-500 text-sm font-medium leading-normal">Active Jobs</p>

                  </div>

                  <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">{getActiveJobsCount()}</p>

                </div>

                <div className="div">
                  <div className="flex justify-between items-start">
                    <p className="text-red-500 text-sm font-medium leading-normal">Assigned Jobs</p>

                  </div>

                  <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">{getAssignedJobsCount()}</p>

                </div>

              </div>

              {/* 3rd */}
              <div className="flex flex-col gap-2 rounded-xl bg-white  p-6 border border-[#cfd7e7]  shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-[#4c669a] text-sm font-medium leading-normal">Unread Messages</p>

                </div>
                <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">12</p>

              </div>

              {/* 4th */}
              <div className="flex flex-col gap-2 rounded-xl bg-white  p-6 border border-[#cfd7e7]  shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-[#4c669a] text-sm font-medium leading-normal">New bids</p>

                </div>
                <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">4</p>
                <div className="flex items-center gap-1 text-[#4c669a] text-sm font-medium">

                </div>
              </div>

            </section>

            {/* Active Jobs Section */}
            <section className="space-y-4 mt-4">
              {/* heading */}
              <div className="flex items-center justify-between">
                <h2 className="text-[#0d121b]  text-2xl font-extrabold tracking-tight">Active Job Postings</h2>

                <NavLink to={`/home/my-gigs`}>
                  <p className="text-secondary text-sm font-medium leading-normal cursor-pointer hover:underline ">View All</p>
                </NavLink>

              </div>

              {/* table */}
              <div className="overflow-hidden rounded-xl border border-[#cfd7e7]  bg-white ">
                <div className="overflow-x-auto">

                  <table className="w-full text-left border-collapse">

                    <thead>
                      <tr className="bg-[#f8f9fc]  border-b border-[#cfd7e7] ">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c669a] ">Job Title</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c669a] ">Date Posted</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c669a] ">Status</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c669a] ">Proposals</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#4c669a] text-center">
                          Actions
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-[#cfd7e7]">
                      {
                        clientjobs?.Clientjobs?.slice(0, 5).map((job) => {
                          const { _id, jobtitle, createdAt, status, contractId } = job;
                          // console.log("contractId", contractId);

                          let JobPostDate = createdAt.split("T")[0]
                          return (
                            <tr className="bg-[#f8f9fc]  border-b border-[#cfd7e7] hover:bg-primary/5 transition-colors"
                              key={job._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-[#0d121b]">
                                  {jobtitle}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-[#4c669a]">
                                  {JobPostDate}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-bold text-[#0d121b] ${status === "active" ? "text-green-600" : "text-red-600"} capitalize`}>
                                  {status}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-[#0d121b]">
                                  {getBidCountByGig(_id)} <span>Bids</span>
                                </div>
                              </td>

                              {/* View Bids , view contract action */}
                              <td className="px-3 py-4 whitespace-nowrap flex gap-2">

                                <div className="text-sm font-bold text-[#0d121b]">
                                  <NavLink to={`/home/bids/${_id}`}>
                                    <button className="text-white bg-secondary text-sm font-bold hover:bg-primary/90 transition-all px-4 h-9 rounded-2xl">View Bids</button>
                                  </NavLink>
                                </div>

                                {
                                  status === "assigned" && contractId ? (
                                    <div className="text-sm font-bold text-[#0d121b]">
                                      <NavLink to={`/contracts/${contractId}`}>
                                        <button className="text-white bg-secondary text-sm font-bold hover:bg-primary/90 transition-all px-4 h-9 rounded-2xl">View Contract</button>
                                      </NavLink>
                                    </div>
                                  ) : ""

                                }

                              </td>

                            </tr>
                          )
                        })
                      }
                    </tbody>

                  </table>

                </div>
              </div>
            </section>

          </div>
        ) : (

          <section
            className="relative overflow-hidden rounded-3xl
  bg-gradient-to-r from-primary via-secondary to-primary
  text-white mt-5 shadow-2xl"
          >
            {/* Background Decorations */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

            <div className="absolute -bottom-24 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 px-10 py-16 lg:px-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Side */}
                <div>
                  <div
                    className="w-24 h-24 rounded-3xl bg-white/15
          flex items-center justify-center
          backdrop-blur-sm mb-8
          shadow-xl animate-bounce"
                  >
                    <FaBriefcase size={48} />
                  </div>

                  <h1 className="text-5xl font-extrabold leading-tight">
                    Welcome!
                    <br />
                    Ready to hire your first freelancer?
                  </h1>

                  <p className="mt-6 text-lg text-white/90 max-w-xl leading-8">
                    You haven't posted any jobs yet. Create your first project and
                    receive proposals from talented freelancers around the world.
                    Compare bids, chat with candidates, and hire the perfect match.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-10">
                    <NavLink to="/home/job_posting">
                      <button
                        className="flex items-center gap-3
              bg-white text-primary
              px-8 py-4 rounded-2xl
              font-bold shadow-xl
              hover:scale-105
              hover:shadow-2xl
              transition-all duration-300"
                      >
                        <FaPlusCircle />
                        Post Your First Job
                      </button>
                    </NavLink>

                    <NavLink to="/home/Find_freelancers">
                      <button
                        className="flex items-center gap-3
              border border-white/30
              bg-white/10 backdrop-blur-md
              px-8 py-4 rounded-2xl
              font-semibold
              hover:bg-white hover:text-primary
              transition-all duration-300"
                      >
                        Browse Freelancers
                        <FaArrowRight />
                      </button>
                    </NavLink>
                  </div>
                </div>

                {/* Right Side */}
                <div className="grid grid-cols-1 gap-5">

                  <div
                    className="bg-white/10 backdrop-blur-md
          rounded-2xl p-6
          hover:bg-white/20
          transition-all duration-300
          hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <FaClipboardList className="text-4xl" />
                      <div>
                        <h3 className="font-bold text-xl">
                          Create a Job
                        </h3>
                        <p className="text-white/80 mt-1">
                          Describe your project, budget and timeline.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white/10 backdrop-blur-md
          rounded-2xl p-6
          hover:bg-white/20
          transition-all duration-300
          hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <FaUsers className="text-4xl" />
                      <div>
                        <h3 className="font-bold text-xl">
                          Receive Proposals
                        </h3>
                        <p className="text-white/80 mt-1">
                          Skilled freelancers will send their best offers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white/10 backdrop-blur-md
          rounded-2xl p-6
          hover:bg-white/20
          transition-all duration-300
          hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <FaRegLightbulb className="text-4xl" />
                      <div>
                        <h3 className="font-bold text-xl">
                          Hire with Confidence
                        </h3>
                        <p className="text-white/80 mt-1">
                          Review profiles, compare bids and start your project.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>
        )
      }

      {/*  Recommended Freelancers Section */}
      <section className="space-y-4 mt-5">
        {/* headings */}
        <div className="flex items-center justify-between">
          <h2 className="text-[#0d121b]  text-xl font-bold tracking-tight">Recommended freelancers for your open roles</h2>
          {/* btns */}
          <div className="flex gap-2">

            <button
              onClick={scrollLeft}
              className="size-8 rounded-full border border-[#cfd7e7] flex items-center justify-center text-[#4c669a] hover:bg-white transition-colors"
            >
              <FaAngleLeft />
            </button>

            <button
              onClick={scrollRight}
              className="size-8 rounded-full border border-[#cfd7e7] flex items-center justify-center text-[#4c669a] hover:bg-white transition-colors"
            >
              <FaAngleRight />
            </button>

          </div>

        </div>

        {/*  Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth no-scrollbar"
          ref={scrollRef}
        >

          {
            recommendedFreelancers.length > 0 && recommendedFreelancers.map((freelancer) => {

              const { profileImage, firstName, lastName, professionalTitle, freelanerSkills, profileSummary, country, state, experienceLevel, rate } = freelancer;

              return (
                <div
                  key={freelancer._id}
                  className="min-w-60 shrink-0 snap-start bg-white rounded-xl p-5 border border-[#cfd7e7] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">

                    {/* img */}
                    <div className="relative shrink-0">

                      <div className="size-20  bg-center bg-cover border border-gray-100">
                        <img src={profileImage?.url} alt="" className="w-full h-full object-cover rounded-xl" />
                      </div>

                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#0d121b]">
                        {freelancer.firstName} {freelancer.lastName}
                      </h4>
                      <p className="text-xs text-[#4c669a]">
                        {freelancer.professionalTitle}
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-[#f8f9fc] text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all">
                    Invite to Job
                  </button>
                </div>
              )
            })
          }

        </div>


      </section>

    </main >
  );
};

export default ClientDashboard;
