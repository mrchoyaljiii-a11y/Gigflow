import { useQuery } from "@tanstack/react-query";
import { Get_Chat_messages } from "../../api/Chat_releted.js";

export const useGetChatMessages = (contractId) => {

    return useQuery({

        queryKey: ["chatMessages", contractId],

        queryFn: () => Get_Chat_messages(contractId),

        enabled: Boolean(contractId),

    });
};