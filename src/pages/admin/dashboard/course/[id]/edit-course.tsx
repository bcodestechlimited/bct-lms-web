import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/loading-spinner";
import { CourseForm } from "@/interfaces/course.interface";

export default function AdminEditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  if (!courseId) {
    return <p>No CourseId Provided</p>;
  }

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseForm>();

  const {
    fields: moduleFields,
    append: addModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "course_modules",
  });

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId as string),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseData) {
      reset(courseData); // Prefill form with existing data
    }
  }, [courseData, reset]);

  const updateCourseMutation = useMutation({
    mutationFn: (data: CourseForm) =>
      courseService.updateCourseModule({ courseId: courseId as string, data }),
    onSuccess: () => {
      toast.success("Course updated successfully!");
      //   navigate("/admin-dashboard/course");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update course"
      );
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: () => courseService.deleteCourse({ courseId: courseId }),
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      navigate("/admin-dashboard/course");
    },
  });

  const onSubmit = (data: CourseForm) => updateCourseMutation.mutate(data);

  if (isLoading) return <Loader />;

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Title */}
        <div>
          <label className="block font-medium">Course Title</label>
          <Input
            {...register("course_title", { required: "Title is required" })}
          />
          {errors.course_title && (
            <p className="text-red-500 text-sm">
              {errors.course_title.message}
            </p>
          )}
        </div>

        {/* Course Description */}
        <div>
          <label className="block font-medium">Course Description</label>
          <Textarea
            {...register("course_description", {
              required: "Description is required",
            })}
          />
          {errors.course_description && (
            <p className="text-red-500 text-sm">
              {errors.course_description.message}
            </p>
          )}
        </div>

        {/* Course Modules */}
        <div>
          <h3 className="text-xl font-semibold">Modules</h3>
          {moduleFields.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="p-4 border rounded-lg space-y-4 mt-2"
            >
              <div className="flex items-center gap-3">
                <Input
                  {...register(`course_modules.${moduleIndex}.title`, {
                    required: "Module title is required",
                  })}
                  placeholder="Module Title"
                />
                <Input
                  {...register(`course_modules.${moduleIndex}.duration`, {
                    required: "Duration is required",
                  })}
                  placeholder="Duration (e.g., 4h 30m)"
                />
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeModule(moduleIndex)}
                >
                  Remove
                </Button>
              </div>

              {/* Lessons */}
              <div>
                <h4 className="text-lg font-semibold">Lessons</h4>
                <LessonFields
                  moduleIndex={moduleIndex}
                  control={control}
                  register={register}
                />
              </div>
            </div>
          ))}
          <Button
            className="mt-4"
            type="button"
            onClick={() =>
              addModule({
                title: "",
                duration: "",
                lessons: [{ name: "", content: "", duration: "" }],
              })
            }
          >
            Add Module
          </Button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteCourseMutation.mutate()}
            disabled={deleteCourseMutation.isPending}
          >
            {deleteCourseMutation.isPending ? "Deleting..." : "Delete Course"}
          </Button>
          <Button type="submit" disabled={updateCourseMutation.isPending}>
            {updateCourseMutation.isPending ? "Updating..." : "Update Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Separate component for lesson fields
function LessonFields({
  moduleIndex,
  control,
  register,
}: {
  moduleIndex: number;
  control: any;
  register: any;
}) {
  const {
    fields: lessonFields,
    append: addLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `course_modules.${moduleIndex}.lessons`,
  });

  return (
    <div className="space-y-2">
      {lessonFields.map((lesson, lessonIndex) => (
        <div key={lesson.id} className="flex items-center gap-3">
          <Input
            {...register(
              `course_modules.${moduleIndex}.lessons.${lessonIndex}.name`,
              { required: "Lesson name is required" }
            )}
            placeholder="Lesson Name"
          />
          <Input
            {...register(
              `course_modules.${moduleIndex}.lessons.${lessonIndex}.content`,
              { required: "Lesson content URL is required" }
            )}
            placeholder="Content URL"
          />
          <Input
            {...register(
              `course_modules.${moduleIndex}.lessons.${lessonIndex}.duration`,
              { required: "Duration is required" }
            )}
            placeholder="Duration (e.g., 5:27)"
          />
          <Button
            variant="destructive"
            type="button"
            onClick={() => removeLesson(lessonIndex)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => addLesson({ name: "", content: "", duration: "" })}
      >
        Add Lesson
      </Button>
    </div>
  );
}
