// these hooks is used to get the contract detailed 
import { useQuery } from "@tanstack/react-query";
import { getContract } from "../../api/contractAPI";

export const useContract = (contractId) => {

    return useQuery({

        queryKey: ["contract", contractId],

        queryFn: () => getContract(contractId),

        enabled: !!contractId, // only run the query if contractId is truthy or available

        staleTime: 5 * 60 * 1000 // 5 minutes

    });

};