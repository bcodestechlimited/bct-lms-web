export interface User {
  // id: string;
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  role: "user" | "admin";
}
