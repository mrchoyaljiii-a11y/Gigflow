import {UploadWork} from '../../../api/contractAPI';
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadWork = (contractId) => {
    const queryClient = useQueryClient();
  
      return useMutation({
          mutationFn: UploadWork,
          onError: (error) => {
              console.error("upload work failed:", error.message);
          },
          onSuccess: async (data) => {
  
              queryClient.invalidateQueries({
                  queryKey: ["contract", contractId]
              });
  
             
          },
      });
  
  };