import apiClient from "@/lib/api-client";

interface PaginationParams {
  page?: number;
  limit?: number;
}

class UserService {
  async getAllUsers({ page = 1, limit = 10 }: PaginationParams) {
    try {
      const { data } = await apiClient.get(`/users`, {
        params: { page, limit },
      });

      return data.responseObject;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
  async activateUser(payload: { userId: string }) {
    try {
      const { data } = await apiClient.patch(
        `/admin/activate-account`,
        payload
      );
      return data.responseObject.user;
    } catch (error) {
      console.error("Error activating user:", error);
      throw error;
    }
  }
  async deactivateUser(payload: { userId: string }) {
    try {
      const { data } = await apiClient.patch(
        `/admin/deactivate-account`,
        payload
      );
      return data.responseObject.user;
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default UserService;
