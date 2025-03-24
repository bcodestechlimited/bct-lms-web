import Loader from "@/components/loading-spinner";
import { useValidateAdmin } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

export default function AdminGuard() {
  const { data, isLoading, isError } = useValidateAdmin();

  const user = data;

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user) {
    toast.error("Please login", {
      id: "unique",
    });
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
