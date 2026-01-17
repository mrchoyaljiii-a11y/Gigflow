import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GetBid } from '../../redux/Bid/Bid_slice.js'

const MyGigs = () => {

  const dispatch = useDispatch();
  // all jobs/gigs 
  const { jobs, loading, error } = useSelector((state) => state.job);

  //all bids
  const { AllBids, Bids, loading: bidLoading, error: bidError } = useSelector((state) => state.BidSlice);

  // console.log("all jobs", jobs);

  // console.log("all bids", AllBids);

  const getBidCountByGig = (gigId) => {
    return AllBids.filter((bid) => bid.gigId === gigId).length;
  };


  const [filter, setFilter] = useState("all");

  if (loading) {
    return <p className="text-center mt-10">Loading gigs...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  const HandleDispatchGigs = (GigId) => {
    dispatch(GetBid(GigId))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">My Gigs</h1>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "active", "assigned"].map((type) => (
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
        {jobs.map((job) => {
          const {
            _id,
            projectTitle,
            Freelancer_type,
            description,
            minBudget,
            maxBudget,
            createdAt,
            status
          } = job;

          return (
            <div
              key={_id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-primary font-semibold">
                    {Freelancer_type}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {projectTitle}
                  </h2>
                </div>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                {description}
              </p>

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

              <div className="view_all_bids text-center"
                onClick={() => HandleDispatchGigs(_id)}>
                {/* to={`/job/${_id}`}  */}
                <NavLink to={`/bids/${_id}`} className="view_all_bids text-primary font-semibold text-center">
                  View All Bids
                </NavLink>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  );
};

export default MyGigs;
