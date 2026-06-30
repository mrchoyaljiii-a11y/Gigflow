import { useQuery } from "@tanstack/react-query";
import { getFreelancer } from "../../api/Freelancer_releted";

export const useGetFreelancers = ({
  pageNo,
  search,
  limit = 6,
}) => {
  return useQuery({
    queryKey: ["freelancers", pageNo, search, limit],
    queryFn: () =>
      getFreelancer({
        pageNo,
        search,
        limit,
      }),
    keepPreviousData: true,
  });
};