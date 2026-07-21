import {GetHiredRecord} from '../../api/Hired_releted_API';
import { useQuery } from "@tanstack/react-query";

export const useGetHiredRecord = (jobId) => {
    return useQuery({
        queryKey: ["hired_Record", jobId],
        queryFn: () => GetHiredRecord(jobId),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
    });
}