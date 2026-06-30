import {getAllHired} from '../../api/Hired_releted_API';
import { useQuery } from "@tanstack/react-query";

export const useGetHired = () => {
    return useQuery({
        queryKey: ["hired"],
        queryFn: () => getAllHired(),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
    });
}