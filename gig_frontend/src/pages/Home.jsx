import React from 'react'
import Search_filters from '../components/Search_filters'
import Job_section from '../components/Job_section'
import { useSelector } from "react-redux";
import ClientDashboard from '../pages/Navigation/Clients-Navigations/ClientDashboard.jsx';

import Freelancers_dashboard from './Navigation/Freelancers-Navigations/Freelancers_dashboard.jsx';

const Home = () => {
  const { userData, userLoading, error } = useSelector(
  (state) => state.userSlice
);

  const { role } = userData;

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return <h1 className='text-5xl text-red-500'>kuch to problem hai </h1>
  }



  return (
    <div>
      {role === "client" && <ClientDashboard />}

      {/* {role === "freelancer" && (
        <div>
          <Search_filters />
          <Job_section />
        </div>
      )} */}


      {role === "freelancer" && (
        <div>
          <Freelancers_dashboard />
        </div>
      )}


    </div>
  );
}

export default Home
