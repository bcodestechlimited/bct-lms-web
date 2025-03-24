import DataTable from "@/components/data-table";
import { Course } from "@/interfaces/course.interface";
import { courseService } from "@/services/course.service";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router";

export default function AdminCoursePage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["course"],
    queryFn: () => courseService.getAllCourses(),
  });

  const columns = [
    {
      header: "Title",
      render: (row: Course) => row.course_title || "N/A",
    },
    {
      header: "Description",
      render: (row: Course) =>
        row.course_description.slice(0, 34) + "..." || "N/A",
    },
    {
      header: "Actions",
      render: (row: Course) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full outline-none"
              aria-label="Open actions"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <Link to={`/admin-dashboard/course/${row._id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/admin-dashboard/course/${row._id}/edit`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/admin-dashboard/course/add">Add Course</Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={courses || []}
        isLoading={isLoading}
        noDataMessage="No courses found."
      />
    </div>
  );
}
