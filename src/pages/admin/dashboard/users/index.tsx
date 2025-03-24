import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user.interface";
import { userService } from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { courseService } from "@/services/course.service";
import { Course } from "@/interfaces/course.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Users() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssignCourse = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      header: "Firstname",
      render: (row: User) => row.firstName || "N/A",
    },
    {
      header: "Lastname",
      render: (row: User) => row.lastName || "N/A",
    },
    {
      header: "Email",
      render: (row: User) => row.email || "N/A",
    },
    {
      header: "Actions",
      render: (row: User) => (
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
            <DropdownMenuItem onClick={() => handleAssignCourse(row)}>
              Assign Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        noDataMessage="No users found."
      />
      <AssignCourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
      />
    </div>
  );
}

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

function AssignCourseModal({ isOpen, onClose, user }: AssignCourseModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const transformedCourses = async (value: string) => {
    const courses = await courseService.getAllCourses({ search: value });
    return courses.map((course: Course) => ({
      value: course._id,
      label: course.course_title,
    }));
  };

  const assignCourseMutation = useMutation({
    mutationFn: courseService.assignCourseToStudent,
  });

  const handleAssignCourse = async () => {
    if (!selectedCourse) {
      return toast.error("Please select a course");
    }

    if (!user || !user._id) {
      return toast.error("Please select a user");
    }

    console.log(
      `Course: ${selectedCourse} assigned to ${user?.firstName} with id:${user?._id}`
    );

    toast.promise(
      () =>
        assignCourseMutation.mutateAsync({
          userId: user?._id || "",
          courseId: selectedCourse,
        }),
      {
        loading: "Assigning course...",
        success: (data) => {
          return data.message;
        },
        error: (error) => {
          console.log({ error });
          if (error instanceof AxiosError) {
            return error.response?.data.message;
          }
          return "Failed to assign";
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Course</DialogTitle>
          <DialogDescription>
            Assign a course to{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add form elements here */}
          <p>Select a course for {user?.email}.</p>
          <form action="">
            <SearchableDropdown
              searchInputPlaceholder="Search for a course"
              placeholder={"Select a course"}
              fetchOptions={(value) => transformedCourses(value)}
              onChange={(value) => {
                console.log("Selected course:", value);
                setSelectedCourse(value);
              }}
            />
          </form>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={assignCourseMutation.isPending}
            onClick={() => handleAssignCourse()}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
