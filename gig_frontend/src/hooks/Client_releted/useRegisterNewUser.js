import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/Client_releted_API";

export const useRegisterNewUser = () => {
  return useMutation({
    mutationFn: (userData) => registerUser(userData),
  });
};