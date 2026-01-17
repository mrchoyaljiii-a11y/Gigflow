import React from 'react'
import { FaRegBookmark } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

const Job_section = () => {

  const { jobs, searchGig, filterdGig, loading, error } = useSelector((state) => state.job);

  // console.log("Jobs in Job_section:", jobs);

  const jobList = filterdGig && filterdGig.length > 0 ? filterdGig : searchGig && searchGig.length > 0 ? searchGig : jobs || [];

  console.log("JobList in Job_section:", jobList);

  if (searchGig && searchGig.length === 0) {
    return (
      <div className="text-center mt-20 text-slate-500">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="jobs h-full px-2 pb-24 pt-6 bg-slate-100">

      {/* job card */}
      {
        jobList && jobList.map((job) => {
          const { _id, projectTitle, Freelancer_type, clientName, category, description, minBudget, maxBudget, tags, createdAt } = job;

          const formattedminBudget = minBudget.toLocaleString();
          const formattedmaxBudget = maxBudget.toLocaleString();
          return (
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition mt-5"
              key={_id}>

              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Logo */}
                  <div className="w-12 h-12 bg-[#C9A063] rounded-xl flex items-center justify-center text-white font-bold">
                    {clientName.charAt(0).toUpperCase()}
                  </div>

                  {/* Title & Company */}
                  <div>
                    <div className="group flex gap-5">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {Freelancer_type}
                      </h2>
                      <p className="category bg-primary text-white font-medium py-1 px-2 rounded-xl">{category}</p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {clientName} · {createdAt.split('T')[0]}
                    </p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-primary transition">
                  <FaRegBookmark />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 line-clamp-2">
                {description.slice(0, 150)}...
              </p>

              {/* skills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {tags.map((tag,index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* pricing and detailed  Section */}
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-xs text-slate-400">Budget Range</p>
                  <p className="text-lg font-semibold text-primary">
                    {`$${formattedminBudget} – $${formattedmaxBudget}`}
                  </p>
                </div>

                <NavLink to={`/detailed_gig/${_id}`}>
                  <button className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition">
                    Details
                  </button>
                </NavLink>

              </div>
            </div>
          )
        })

      }

    </div>
  );
}

export default Job_section
