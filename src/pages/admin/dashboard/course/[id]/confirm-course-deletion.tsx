import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Course } from "@/interfaces/course.interface";
import { courseService } from "@/services/course.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export default function ConfirmCourseDeletion({
  isOpen,
  onClose,
  course,
}: ConfirmActionModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteCourseMutation = useMutation({
    mutationFn: () => courseService.deleteCourse({ courseId: course._id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      navigate("/admin-dashboard/course");
    },
  });

  const onSubmit = () => {
    toast.promise(deleteCourseMutation.mutateAsync, {
      loading: "Deleting course...",
      success: "Course deleted successfully!",
      error: (error) => {
        return `Error: ${error.message}`;
      },
      id: "delete-course",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Course </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this{" "}
            <strong>{course.course_title}</strong> course?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => onSubmit()}
            disabled={deleteCourseMutation.isPending}
          >
            {deleteCourseMutation.isPending ? "Deleting..." : "Delete Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
