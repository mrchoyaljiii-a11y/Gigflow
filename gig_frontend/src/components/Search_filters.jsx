import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { setSearchGig, setFilterdGig } from '../redux/slices/job_slice.js';
import { CiSearch, CiStar } from "react-icons/ci";
import { Getjob } from '../redux/slices/job_slice.js';
const Search_filters = () => {

  const [searchText, setsearchText] = useState("");
  // console.log("searchText", searchText);

  const [appliedSearch, setAppliedSearch] = useState("");
  console.log("appliedSearch", appliedSearch);
  const [colorindex, setcolorindex] = useState(0);

  const [Gigs, setGis] = useState([]);

  const filters = ['All Gigs', 'UI/UX Design', 'Web Development', 'Java Developer', 'Data Science', 'Digital Marketing', 'Video & Animation',];

  const { jobs, loading, error, pageNo } = useSelector((state) => state.job);

  // console.log("pageNo in Search_filters:", pageNo);
  const dispatch = useDispatch();

  useEffect(() => {
    // setGis(jobs);
    // dispatch(setFilterdGig(jobs));
    dispatch(Getjob({ pageNo: pageNo, search: appliedSearch, limit: 6}));
  }, [dispatch, appliedSearch, pageNo]);



  const onSubmit = (data) => {
    const searchText = data.search.toLowerCase();

    const filteredGigs = Gigs.filter((gig) =>
      gig.jobtitle?.toLowerCase().includes(searchText) ||
      // gig.clientName?.toLowerCase().includes(searchText) ||
      gig.projectCategory?.toLowerCase().includes(searchText)
    );

    dispatch(setFilterdGig(filteredGigs));
  };


  function handleFilter(filter, index) {
    setcolorindex(index);

    if (filter === 'All Gigs') {
      setAppliedSearch("");
    } else {
      setAppliedSearch(filter);
    }

  }
  return (
    <div>
      {/* Search bar*/}
      <div className="search relative">

        {/* Search input */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input className="w-full h-14 pl-14 pr-4 bg-white border-none rounded-xl text-base shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none"
                type="text"
                value={searchText}
                onChange={(e) => setsearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAppliedSearch(searchText);
                  }
                }}
                placeholder="Search by Name, Skill's, or keywords..."
              />
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">{<CiSearch size={20} />}</span>
            </div>
            <button
              className="w-full md:w-auto px-8 h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              onClick={() => {
                setAppliedSearch(searchText);
              }}
            >
              Search Jobs's
            </button>

          </div>

        </div>

      </div>

      {/* filters */}
      <div className="filters">
        <ul className="flex gap-4 mt-4 overflow-x-auto">
          {filters.map((filter, index) => (
            <li key={index} className={`whitespace-nowrap px-4 py-2 ${index === colorindex ? "bg-primary text-white hover:bg-primary" : "bg-white"} rounded-full text-sm cursor-pointer hover:bg-gray-300 transition-colors`}
              onClick={() => handleFilter(filter, index)}
            >{filter}</li>
          ))}

        </ul>
      </div>


    </div>
  )
}

export default Search_filters
