import api from "./axios";


/*
POST    /api/gigs        → add job
GET     /api/gigs        → get all jobs
PATCH   /api/gigs/:id    → update job
DELETE  /api/gigs/:id    → delete job

end point are different api is same 
 */


// get all the job of the client
export const GetClientJobs = async () => {
    try {
        const res = await api.get(`/api/get/client-jobs`, { withCredentials: true });
        // console.log("GetClientsJobs response:", res.data);
        return res.data; //backend response

    } catch (error) {
        console.log("From getting client jobs", error);
        throw (
            error.response?.data?.message || {
                message: "An error occurred while fetching the jobs.",
            }
        );
    }
};


// post a new job 
export const Addjob = async (jobData) => {
  try {
    const res = await api.post(
      "/api/gigs",
      jobData,
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || {
        message: "An error occurred while adding the job.",
      }
    );
  }
};

