/* eslint-disable no-useless-catch */
import { LoginPayload, RegisterPayload } from "@/hooks/useAuth";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

class AuthService {
  async login(payload: LoginPayload) {
    try {
      const { data } = await apiClient.post(`/auth/login`, {
        email: payload.email,
        password: payload.password,
      });
      const user = data.responseObject.user;

      // if (user?.role !== "user") {
      //   throw Error("Unauthorized");
      // }

      const token = data.responseObject.token;

      useAuthStore.getState().actions.setUser(user);
      useAuthStore.getState().actions.setToken(token);

      console.log("Token saved");

      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(payload: RegisterPayload) {
    try {
      await apiClient.post(`/auth/register`, payload);
      const loginData = await this.login(payload);
      return loginData;
    } catch (error) {
      throw error;
    }
  }

  async validateUser() {
    try {
      const response = await apiClient.get(`/users/validate-user`);
      const user = response.data;
      useAuthStore.getState().actions.setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin Auth
  async adminLogin(payload: LoginPayload) {
    try {
      const { data } = await apiClient.post(`/auth/login`, {
        email: payload.email,
        password: payload.password,
      });
      const user = data.responseObject.user;

      if (user?.role !== "admin") {
        throw Error("Unauthorized");
      }

      const token = data.responseObject.token;

      useAuthStore.getState().actions.setAdmin(user);
      useAuthStore.getState().actions.setAdminToken(token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async validateAdmin() {
    try {
      const response = await apiClient.get(`/users/validate-user`);
      const user = response.data;
      // if (user?.role !== "admin") {
      //   throw Error("Unauthorized");
      // }

      useAuthStore.getState().actions.setAdmin(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export default AuthService;
