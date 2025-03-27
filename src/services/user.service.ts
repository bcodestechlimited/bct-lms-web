import apiClient from "@/lib/api-client";

class UserService {
  async getAllUsers() {
    try {
      const { data } = await apiClient.get(`/users`);
      return data.responseObject.users;
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
