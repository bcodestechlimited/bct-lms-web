import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { Book, Home, LogOut, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@/store/auth.store";

// Route type definition
type Route = {
  label: string;
  icon: LucideIcon;
  path: string;
  match: (pathname: string) => boolean;
};

// Abstracted routes with proper types
const routes: Route[] = [
  {
    label: "My Courses",
    icon: Book,
    path: "/dashboard",
    match: (pathname) => pathname === "/dashboard",
  },
  {
    label: "All Courses",
    icon: Home,
    path: "/dashboard/courses",
    match: (pathname) => pathname.startsWith("/dashboard/courses"),
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuthActions();

  return (
    <div className="w-44 left-0 top-0 h-full min-h-screen p-4 border-r bg-background flex flex-col">
      <div className="space-y-4 flex-1">
        <h2 className="text-lg font-semibold px-4">BCT LMS</h2>
        <Separator />
        <nav className="space-y-2">
          {routes.map(({ label, icon: Icon, path, match }) => (
            <Button
              key={label}
              variant={match(location.pathname) ? "secondary" : "ghost"}
              className={cn(
                `w-full justify-start gap-2 border-l-2 rounded-none`,
                match(location.pathname) ? "border-black" : "border-white"
              )}
              type="button"
              onClick={() => navigate(path)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="px-4 mt-auto">
        <Separator className="mb-4" />
        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={() => {
            logout();
            navigate("/auth/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="">
            {pathnames.map((value, index) => {
              const path = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return (
                <span key={path} className="flex items-center">
                  <BreadcrumbItem className=" pr-1">
                    <BreadcrumbLink asChild>
                      {isLast ? (
                        <span className="font-medium">
                          {value
                            .replace(/-/g, " ")
                            .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                        </span>
                      ) : (
                        <Link to={path}>
                          {value
                            .replace(/-/g, " ")
                            .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                        </Link>
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
}
