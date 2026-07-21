import { FetchUser } from '../../api/User_releted.js';
import { useQuery } from "@tanstack/react-query";

export const useGetUserInfo = () => {

    return useQuery({
        queryKey: ["userInfo"],
        queryFn: () => FetchUser(),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
}