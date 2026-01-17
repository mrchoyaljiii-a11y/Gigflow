import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { setSearchGig,setFilterdGig } from '../redux/slices/job_slice.js';

const Search_filters = () => {
  const [colorindex, setcolorindex] = useState(0);
  const [Gigs, setGis] = useState([]);
  const [filterdGig, setfilterdGig] = useState([]);
  const filters = ['All Gigs', 'UI/UX Design', 'Web Development', 'Java Developer', 'Data Science', 'Digital Marketing', 'Video & Animation',];

  const { jobs, loading, error } = useSelector((state) => state.job);
  const dispatch = useDispatch();

  useEffect(() => {
    setGis(jobs);
  }, [jobs]);

  // console.log("Gigs in Search_filters:", Gigs);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  let filtergig = [];

  const onSubmit = (data) => {

   filtergig = Gigs.filter((gig) => {
      return gig.projectName.toLowerCase().includes(data.search.toLowerCase()) ||
        gig.clientName.toLowerCase().includes(data.search.toLowerCase()) ||
        gig.category.toLowerCase().includes(data.search.toLowerCase())
    })

    dispatch(setSearchGig(filtergig));

    console.log("filterd gig",filtergig)
  }

  function handleFilter(filter,index) {
     setcolorindex(index);
     
     if(filter === 'All Gigs') {
      dispatch(setFilterdGig(Gigs));
     } else {
      //filter based on category
      const CategoryFilter = Gigs.filter((gig) => gig.category.toLowerCase() === filter.toLowerCase());
      console.log("CategoryFilter",CategoryFilter);
      dispatch(setFilterdGig(CategoryFilter));
     }
    
  }
  return (
    <div>
          {/* Search bar*/}
      <div className="search relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>

                    {/* Search input */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <input
            type="text"
            placeholder="Search gigs, skills, or clients..."
            className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl outline-none text-sm transition-all
      ${errors.search
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-slate-200 focus:ring-2 focus:ring-primary"}
    `}
            {...register("search", { required: "This field is required" })}
          />

          {errors.search && (
            <p className="text-red-500 text-xs mt-1">
              {errors.search.message}
            </p>
          )}
        </form>

      </div>

             {/* filters */}
      <div className="filters">
        <ul className="flex gap-4 mt-4 overflow-x-auto">
          {filters.map((filter, index) => (
            <li key={index} className={`whitespace-nowrap px-4 py-2 ${index === colorindex ? "bg-primary text-white hover:bg-primary" : "bg-white"} rounded-full text-sm cursor-pointer hover:bg-gray-300 transition-colors`}
              onClick={() => handleFilter(filter,index)}
            >{filter}</li>
          ))}

        </ul>
      </div>
    </div>
  )
}

export default Search_filters
