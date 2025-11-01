import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { register } from "@Services";
import type { RegisterRequest } from "@Types/authTypes";
import { handleApiError } from "@Utils/errorHandlerUtils";

export const useRegister = (): UseMutationResult<void, Error, RegisterRequest, unknown> => {
  return useMutation<void, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      try {
        await register(data);
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};
