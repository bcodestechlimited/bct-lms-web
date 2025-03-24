import { authService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    // onSuccess: (data) => {
    //   // console.log(data);
    // },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
};

export const useValidateUser = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: () => authService.validateUser(),
    retry: false,
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.adminLogin(payload),
    // onSuccess: (data) => {
    //   // console.log(data);
    // },
  });
};

export const useValidateAdmin = () => {
  return useQuery({
    queryKey: ["admin-auth"],
    queryFn: () => authService.validateAdmin(),
    retry: false,
  });
};
