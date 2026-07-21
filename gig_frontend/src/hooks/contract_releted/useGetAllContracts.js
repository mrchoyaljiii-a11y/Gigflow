// these hooks is used to get the contract detailed 
import { useQuery } from "@tanstack/react-query";
import { getAllContracts } from "../../api/contractAPI";

export const useGetAllContracts = () => {

    return useQuery({
        queryKey: ["ALLcontract"],
        queryFn: () => getAllContracts(),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
    });

};