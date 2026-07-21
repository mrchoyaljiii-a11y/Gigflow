import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GetBid } from '../../../redux/Bid/Bid_slice.js'
import { DeleteJob } from '../../../redux/slices/job_slice.js'
import { GetClientsJobs } from '../../../redux/slices/job_slice.js'
import { useGetJobs } from "../../../hooks/job_releted/useGetJobs.js";
const MyGigs = () => {


  const {
    data: clientjobs = {},
    isLoading: jobsLoading,
    error: jobsError,
    isError: jobsIsError,
    refetch: jobsRefetch,
  } = useGetJobs();


  console.log("client jobs in client dashboard", clientjobs?.Clientjobs);

  const jobs = clientjobs?.Clientjobs || [];

  const dispatch = useDispatch();

  const [filter, setFilter] = useState("all");

  const getFilteredJobs = () => {
    if (filter === "all") return jobs;
    return jobs.filter((job) => job.status === filter);
  };

  // console.log("all jobs", getFilteredJobs().length);

  //all bids
  const { AllBids, Bids, loading: bidLoading, error: bidError } = useSelector((state) => state.BidSlice);

  // console.log("all bids", AllBids);

  const getBidCountByGig = (gigId) => {
    return AllBids.filter((bid) => bid.gigId === gigId).length;
  };


  const HandleDispatchGigs = (GigId) => {
    dispatch(GetBid(GigId))
  }

  const handleCloseJob = (jobId) => {
    dispatch(DeleteJob(jobId))
    // console.log("job_id", job_id);
  }

  if (jobsLoading) {
    return <p className="text-center mt-10">Loading gigs...</p>;
  }

  if (jobsIsError) {
    return (
      <p className="text-center text-red-500 mt-10">
        {jobsError?.message || "Something went wrong"}
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">My Gigs <span>({getFilteredJobs().length})</span></h1>

        {/* Filters */}
        <div className="flex gap-2">

          {["all", "active", "assigned", "completed",].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${filter === type
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Gig Cards */}
      <div className="space-y-4">
        {getFilteredJobs().length === 0 ? (
          <p className="text-center text-slate-500">No gigs found.</p>
        ) : (
          getFilteredJobs().map((job) => {
            const {
              _id,
              clientId,
              experiance,
              jobDescription,
              job_attachment,
              jobtitle,
              maxBudget,
              minBudget,
              price,
              projectCategory,
              skills,
              timeline,
              createdAt,
              status,
              contractId
            } = job;

            return (
              <div
                key={_id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 relative"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-primary font-semibold">
                      {projectCategory}
                    </p>

                    <NavLink to={`/home/detailed_job_info/${_id}`}>
                      <h2 className="text-lg font-semibold text-slate-800 cursor-pointer hover:text-primary transition">
                        {jobtitle}
                      </h2>
                    </NavLink>

                  </div>

                  {/* left side in header */}

                  <div className="flex justify-between gap-3 items-center">
                    {/* view Contract */}
                    {
                      status === "assigned" && contractId ? (
                        <NavLink to={`/contracts/${contractId}`}>
                          <button className="text-primary border border-primary text-sm font-bold hover:bg-primary/10 transition-all px-3 py-1.5 rounded-2xl cursor-pointer">View Contract</button>
                        </NavLink>
                      ) : ""

                    }

                    {/* close the job btn */}
                    <button
                      className="text-red-500 border border-red-400 text-sm font-bold hover:bg-red-500/10 transition-all px-3 py-1.5 rounded-2xl cursor-pointer capitalize"
                      onClick={() => handleCloseJob(_id)}
                    >
                      close the job
                    </button>

                    <span className={`text-sm px-3 py-1.5 rounded-full ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} ${status === "assigned" ? "bg-yellow-100 text-yellow-700" : ""}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                </div>

                {/* Description */}
                <div
                  className="text-slate-600 text-sm line-clamp-2 mb-4"
                  dangerouslySetInnerHTML={{ __html: jobDescription }}
                ></div>


                {/* Budget and Date */}
                <div className="flex justify-between items-center">

                  <p className="text-sm font-semibold text-primary">
                    ${minBudget} – ${maxBudget}
                  </p>
                  <p className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white mt-1">
                    Posted on {new Date(createdAt).toLocaleDateString()}
                  </p>

                </div>

                {/* bids recieved */}
                <div className="bids_recieved bg-primary px-2 py-1 rounded-lg text-white mt-1 text-center w-60 mx-auto">
                  <p className="no_of_bids">
                    {getBidCountByGig(_id)} <span>Bids Received</span>
                  </p>
                </div>

                {/*freelancers sections list af freelancers  */}

                <div className="freelancers mt-5 pb-3">
                  <div className="freelancer_card group flex items-center justify-between 
        bg-white p-4 rounded-xl shadow-sm border border-gray-100
        hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer">

                    {/* Profile Section */}
                    <div className="flex items-center gap-4">
                      {/* Profile Image */}
                      <div className="profile_img w-12 h-12 rounded-full bg-blue-100 
            flex items-center justify-center text-blue-600 font-semibold text-lg">
                        JD
                      </div>

                      {/* Name & Location */}
                      <div className="group">
                        <p className="name text-sm font-semibold text-gray-800">
                          John Doe
                        </p>
                        <p className="location text-xs text-gray-500">
                          New York, USA
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="arrow text-gray-400 group-hover:text-blue-500 transition">
                      <MdKeyboardArrowRight size={25} />
                    </div>
                  </div>
                </div>

                {/* View all Bids */}

                <div className="view_all_bids text-center border-primary border w-[10rem] mx-auto mt-4 py-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-all duration-300"
                  onClick={() => HandleDispatchGigs(_id)}>
                  {/* to={`/job/${_id}`}  */}
                  <NavLink to={`/home/bids/${_id}`} className="view_all_bids text-primary font-semibold text-center">
                    View All Bids
                  </NavLink>
                </div>
              </div>
            )
          })
        )
        }
      </div>
    </div>
  );
};

export default MyGigs;
