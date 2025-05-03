export interface User {
  // id: string;
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  isActive: boolean;
  courses: string[];
  role: "user" | "admin";
}
