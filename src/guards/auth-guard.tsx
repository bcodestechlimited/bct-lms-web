import Loader from "@/components/loading-spinner";
import { useValidateUser } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

export default function AuthGuard() {
  const { data, isLoading, isError } = useValidateUser();
  const user = data;

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user) {
    toast.error("Please login", {
      id: "unique",
    });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
