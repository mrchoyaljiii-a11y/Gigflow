import { getJob } from "../../api/Job_releted_API";
import { useQuery } from "@tanstack/react-query";

export const useGetJobs = () => {
    return useQuery({
        queryKey: ["jobs"],
        queryFn: () => getJob(),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
    });
}
