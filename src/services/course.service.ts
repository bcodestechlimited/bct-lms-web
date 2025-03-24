import apiClient from "@/lib/api-client";

interface QueryParams {
  search?: string;
  limit?: number;
  page?: number;
}

class CourseService {
  async getAllCourses(params?: QueryParams) {
    try {
      const { data } = await apiClient.get(`/courses`, { params });
      // console.log({ courses: data.responseObject });

      return data.responseObject.courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }
  async getUserCourses(payload: any) {
    try {
      const { data } = await apiClient.get(`/users/${payload.userId}/courses`);
      console.log({ data });

      return data.responseObject.courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }
  async getCourseById(courseId: string) {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}`);
      console.log({ data });
      return data.responseObject;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }
  async createCourse(payload: any) {
    try {
      const { data } = await apiClient.post(`/courses`, payload);
      // console.log({ courses: data.responseObject });

      return data.responseObject.courses;
    } catch (error) {
      console.error("Error creating courses:", error);
      throw error;
    }
  }
  async deleteCourse(payload: any) {
    try {
      const { data } = await apiClient.delete(
        `/courses/${payload.courseId}`,
        payload
      );

      console.log({ data });

      return data.responseObject.courses;
    } catch (error) {
      console.error("Error creating courses:", error);
      throw error;
    }
  }
  async assignCourseToStudent(payload: { userId: string; courseId: string }) {
    try {
      const { data } = await apiClient.post(
        `/admin/toggle-enrollment`,
        payload
      );
      console.log({ data });
      return data;
    } catch (error) {
      console.error("Error assigning course to user:", error);
      throw error;
    }
  }
  //Modules, Lessons
  async updateCourseModule(payload: any) {
    try {
      const response = await apiClient.patch(
        `/courses/${payload.courseId}`,
        payload.data
      );
      return response;
    } catch (error) {
      console.error("Error creating courses:", error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
export default CourseService;
