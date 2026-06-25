import React, { useState, useRef, useEffect } from "react";
import { FaPlusCircle, FaSearchPlus, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecommendedFreelancers } from '../../../redux/getUser/User'

const ClientDashboard = () => {
  const dispatch = useDispatch();
  // fetching the freelancer data for showing in recommended freelancers

  const { recommendedFreelancers, recommendedLoading } = useSelector(state => state.userSlice)

  useEffect(() => {
    dispatch(fetchRecommendedFreelancers());
  }, []);

  // console.log("freelancerData in client dashboard", recommendedFreelancers);

  const { Clientjobs, searchGig, filterdGig, loading, error } = useSelector((state) => state.job);

  // console.log("Clientjobs in client dashboard", Clientjobs);

  const { AllBids, Bids, loading: bidLoading, error: bidError } = useSelector((state) => state.BidSlice);

  const getBidCountByGig = (gigId) => {
    return AllBids.filter((bid) => bid.gigId === gigId).length;
  };

  const getActiveJobsCount = () => {
    return Clientjobs.filter((job) => job.status === "active").length;
  };

  const getAssignedJobsCount = () => {
    return Clientjobs.filter((job) => job.status === "assigned").length;
  };


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
      <section className="">

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-transparent border border-secondary/10 bg-gradient-to-l from-secondary/10 to-secondary/5">

          <div className="flex min-h-80 flex-col gap-6 items-start justify-center px-8 py-10 @[480px]:px-16">

            {/* text contant  */}
            <div className="flex flex-col gap-3 max-w-2xl">
              <h1 className="text-secondary text-4xl font-extrabold tracking-[-0.033em] ">
                Welcome back, <span

                  // !user name
                  className="uppercase">satish</span>
              </h1>
              <p className="text-[#4c669a] text-base @[480px]:text-lg max-w-lg">
                Track your active milestones, manage your hired talent, and kickstart your next ambitious project today.
              </p>
            </div>

            {/* button */}
            <div className="btm-group flex  gap-3">
              <NavLink to={`/home/job_posting`} >
                <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-secondary text-white text-base font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all cursor-pointer">
                  <span><FaPlusCircle size={25} /></span>
                  <span className="truncate">Post a New Job</span>
                </button>
              </NavLink>

              <NavLink to={`/home/Find_freelancers`} >
                <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-white text-secondary text-base font-bold shadow-lg shadow-secondary/20 hover:bg-white/90 transition-all cursor-pointer">
                  <span><FaSearchPlus size={25} /></span>
                  <span className="truncate">Hire Freelancer</span>
                </button>
              </NavLink>

            </div>
          </div>

          {/* background circle */}
          <div className="absolute top-4 right-10 w-70 h-70 opacity-10 pointer-events-none bg-primary rounded-full " >

          </div>

        </div>
      </section>

      {/* states */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">

        {/* 1st */}
        <div className="flex flex-col gap-2 rounded-xl bg-white  p-6 border border-[#cfd7e7]  shadow-sm">

          <div className="flex justify-between items-start">
            <p className="text-[#4c669a] text-sm font-medium leading-normal">Total Jobs</p>

          </div>
          <p className="text-[#0d121b] tracking-tight text-3xl font-bold leading-tight">{Clientjobs.length}</p>
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
                  Clientjobs.length > 0 && Clientjobs.slice(0, 5).map((job) => {
                    const { _id, jobtitle, createdAt, status,contractId } = job;
                    console.log("contractId", contractId);

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
