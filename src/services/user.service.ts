import apiClient from "@/lib/api-client";

class UserService {
  async getAllUsers() {
    try {
      const { data } = await apiClient.get(`/users`);
      return data.responseObject.users; // Assuming responseObject contains users
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default UserService;
