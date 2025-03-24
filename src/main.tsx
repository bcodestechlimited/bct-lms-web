import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "./App.tsx";
import "./index.css";
import DashboardLayout from "./layouts/dashboard-layout.tsx";
import ForgotPasswordPage from "./pages/auth/forgot-password.tsx";
import ErrorPage from "./pages/error-page.tsx";
import LoginPage from "./pages/auth/login-page.tsx";
import UserDashboardHome from "./pages/dashboard/index.tsx";
import Courses from "./pages/dashboard/courses/index.tsx";
import AuthGuard from "./guards/auth-guard.tsx";
import CourseDetail from "./pages/dashboard/courses/[id]/index.tsx";
import AdminDashboardLayout from "./layouts/admin-dashboard-layout.tsx";
import AdminDashboardHome from "./pages/admin/dashboard/index.tsx";
import Users from "./pages/admin/dashboard/users/index.tsx";
import AdminLogin from "./pages/admin/auth/login.tsx";
import AdminGuard from "./guards/admin-guard.tsx";
import AdminCoursePage from "./pages/admin/dashboard/course/index.tsx";
import AddCoursePage from "./pages/admin/dashboard/course/[id]/add-course.tsx";
import AdminEditCoursePage from "./pages/admin/dashboard/course/[id]/edit-course.tsx";
import AdminCourseDetailPage from "./pages/admin/dashboard/course/[id]/index.tsx";
import RegisterPage from "./pages/auth/register.tsx";

const queryClient = new QueryClient();

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <AuthGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <UserDashboardHome />,
          },
          {
            path: "/dashboard/courses",
            element: <Courses />,
          },
          {
            path: "/dashboard/:courseId",
            element: <CourseDetail />,
          },
          {
            path: "/dashboard/courses/:courseId",
            element: <CourseDetail />,
          },
        ],
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <ErrorPage />,
  },
  {
    element: <AdminGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminDashboardLayout />,
        children: [
          {
            path: "/admin-dashboard",
            element: <AdminDashboardHome />,
          },
          {
            path: "/admin-dashboard/users",
            element: <Users />,
          },
          {
            path: "/admin-dashboard/course",
            element: <AdminCoursePage />,
          },
          {
            path: "/admin-dashboard/course/add",
            element: <AddCoursePage />,
          },
          {
            path: "/admin-dashboard/course/:courseId",
            element: <AdminCourseDetailPage />,
          },
          {
            path: "/admin-dashboard/course/:courseId/edit",
            element: <AdminEditCoursePage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.VITE_NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      <Toaster richColors={true} closeButton={true} />
    </QueryClientProvider>
  </StrictMode>
);
