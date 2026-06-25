// these hooks is used to get the client detaile
import { useQuery } from "@tanstack/react-query";
import { getClient } from "../../api/Client_releted_API";

export const useGetClientInfo = () => {

    return useQuery({

        queryKey: ["user"],

        queryFn: () => getClient(),

        // enabled: !!clientID, // only run the query if contractId is truthy or available

        staleTime: 5 * 60 * 1000 // 5 minutes
        

    });


};