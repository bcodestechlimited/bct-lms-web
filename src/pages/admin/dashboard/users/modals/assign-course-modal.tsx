import { Course } from "@/interfaces/course.interface";
import { User } from "@/interfaces/user.interface";
import { courseService } from "@/services/course.service";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { Button } from "@/components/ui/button";

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function AssignCourseModal({
  isOpen,
  onClose,
  user,
}: AssignCourseModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [IsUserAssigned, setIsUserAssigned] = useState(false);
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
          setIsUserAssigned(!IsUserAssigned);
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
                console.log("Selected User:", user);

                if (user?.courses.includes(value)) {
                  setIsUserAssigned(true);
                } else {
                  setIsUserAssigned(false);
                }

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
            className={`${IsUserAssigned ? "bg-red-500 hover:bg-red-600" : ""}`}
            disabled={assignCourseMutation.isPending}
            onClick={() => handleAssignCourse()}
          >
            {IsUserAssigned ? "Unassign Course" : "Assign Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
