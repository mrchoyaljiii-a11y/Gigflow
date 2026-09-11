// hooks/contract/useContract.js
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContract } from "../../api/contractAPI";



export const useContract = (contractId) => {

    const query = useQuery({
        queryKey: ["contract", contractId],

        queryFn: async () => {
            // console.log("🚀 Fetching contract...");
            // console.log("📌 Contract ID:", contractId);

            const data = await getContract(contractId);

            // console.log("✅ API Response:", data);

            return data;
        },

        enabled: Boolean(contractId),

        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return query;
};