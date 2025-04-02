import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/loading-spinner";
import {
  Course,
  CourseForm,
  Lesson,
  Module,
} from "@/interfaces/course.interface";
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react"; // Added Chevron icons
import ConfirmCourseDeletion from "./confirm-course-deletion";

export default function AdminEditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isRemoveModuleModalOpen, setIsRemoveModuleModalOpen] =
    useState<boolean>(false);

  const [selectedModule, setSelectedModule] = useState<{
    module: Module | null;
    moduleIndex: number | null;
  }>({ module: null, moduleIndex: null });

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
    swap: swapModules,
  }: {
    fields: Module[];
    append: (module: Module) => void;
    remove: (moduleIndex: number) => void;
    swap: (fromIndex: number, toIndex: number) => void;
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
      reset(courseData);
      // Initialize all modules as expanded by default
      const initialExpandedState = courseData.course_modules?.reduce(
        (acc: any, _: any, index: number) => {
          acc[index] = false;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setExpandedModules(initialExpandedState || {});
    }
  }, [courseData, reset]);

  const updateCourseMutation = useMutation({
    mutationFn: (data: CourseForm) =>
      courseService.updateCourseModule({ courseId: courseId as string, data }),
    onSuccess: () => {
      toast.success("Course updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update course"
      );
    },
  });

  const onSubmit = (data: CourseForm) => updateCourseMutation.mutate(data);

  const moveModuleUp = (index: number) => {
    if (index > 0) {
      swapModules(index, index - 1);
      // Update expanded state to follow the moved module
      const newExpandedModules = { ...expandedModules };
      const temp = newExpandedModules[index];
      newExpandedModules[index] = newExpandedModules[index - 1];
      newExpandedModules[index - 1] = temp;
      setExpandedModules(newExpandedModules);
    }
  };

  const moveModuleDown = (index: number) => {
    if (index < moduleFields.length - 1) {
      swapModules(index, index + 1);
      // Update expanded state to follow the moved module
      const newExpandedModules = { ...expandedModules };
      const temp = newExpandedModules[index];
      newExpandedModules[index] = newExpandedModules[index + 1];
      newExpandedModules[index + 1] = temp;
      setExpandedModules(newExpandedModules);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to confirm deletion of a module
  const openRemoveModuleModal = () => {
    setIsRemoveModuleModalOpen(true);
  };

  const closeRemoveModuleModal = () => {
    setIsRemoveModuleModalOpen(false);
  };

  const handleRemoveModule = (module: Module, index: number) => {
    setSelectedModule({ module, moduleIndex: index });
    openRemoveModuleModal();
  };

  const confirmDeleteModule = () => {
    if (selectedModule) {
      removeModule(selectedModule.moduleIndex as number);
      toast.success(`Module "${selectedModule.module?.title}" deleted`);
      closeRemoveModuleModal();
      setSelectedModule({ module: null, moduleIndex: null });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Title */}
        <div className="space-y-1">
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
        <div className="space-y-1">
          <label className="block font-medium">Course Description</label>
          <Textarea
            className="min-h-40"
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
              key={module._id}
              className="border rounded-lg mt-2 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => moveModuleUp(moduleIndex)}
                      disabled={moduleIndex === 0}
                      className="h-6 w-6"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => moveModuleDown(moduleIndex)}
                      disabled={moduleIndex === moduleFields.length - 1}
                      className="h-6 w-6"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleModule(moduleIndex)}
                    className="h-8 w-8"
                    type="button"
                    aria-label="Toggle Module"
                    title="Toggle Module"
                  >
                    {expandedModules[moduleIndex] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="flex-1 flex gap-3">
                    <Input
                      {...register(`course_modules.${moduleIndex}.title`, {
                        required: "Module title is required",
                      })}
                      placeholder="Module Title"
                      className="flex-1"
                    />
                    <Input
                      {...register(`course_modules.${moduleIndex}.duration`, {
                        required: "Duration is required",
                      })}
                      placeholder="Duration (e.g., 4h 30m)"
                      className="w-32"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      handleRemoveModule(module, moduleIndex);
                      // setExpandedModules((prev) => ({ ...prev, [moduleIndex]: false }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Module Content (collapsible) */}
              {expandedModules[moduleIndex] && (
                <div className="p-4 space-y-4">
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
              )}
            </div>
          ))}
          <Button
            className="mt-4"
            type="button"
            onClick={() => {
              const newIndex = moduleFields.length;
              addModule({
                title: "",
                duration: "",
                lessons: [{ name: "", content: "", duration: "" }],
              });
              // New modules should be expanded by default
              setExpandedModules((prev) => ({ ...prev, [newIndex]: true }));
            }}
          >
            Add Module
          </Button>

          {/* Confirmation Dialog */}
          <Dialog
            open={isRemoveModuleModalOpen}
            onOpenChange={closeRemoveModuleModal}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Module</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the module{" "}
                  <strong>
                    {selectedModule ? selectedModule?.module?.title : ""}
                  </strong>
                  ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => closeRemoveModuleModal()}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteModule}>
                  Delete Module
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              setSelectedCourse(courseData as Course);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete Course
          </Button>
          <Button type="submit" disabled={updateCourseMutation.isPending}>
            {updateCourseMutation.isPending ? "Updating..." : "Update Course"}
          </Button>
        </div>
      </form>
      {selectedCourse && (
        <ConfirmCourseDeletion
          course={selectedCourse}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
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
  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: Lesson | null;
    lessonIndex: number | null;
  }>({ lesson: null, lessonIndex: null });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const {
    fields: lessonFields,
    append: addLesson,
    remove: removeLesson,
  }: {
    fields: Lesson[];
    append: (lesson: Lesson) => void;
    remove: (lessonIndex: number) => void;
  } = useFieldArray({
    control,
    name: `course_modules.${moduleIndex}.lessons`,
  });

  const handleRemoveClick = (lesson: Lesson, index: number) => {
    setSelectedLesson({ lesson, lessonIndex: index });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLesson) {
      removeLesson(selectedLesson.lessonIndex as number);
      toast.success(`Lesson "${selectedLesson.lesson?.name}" deleted`);
      setIsDeleteModalOpen(false);
      setSelectedLesson({ lesson: null, lessonIndex: null });
    }
  };

  return (
    <div className="space-y-4">
      {lessonFields.map((lesson, lessonIndex) => {
        return (
          <div key={lesson._id} className="flex items-center gap-3">
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
              onClick={() => handleRemoveClick(lesson, lessonIndex)}
            >
              Remove
            </Button>
          </div>
        );
      })}
      <Button
        type="button"
        onClick={() => addLesson({ name: "", content: "", duration: "" })}
      >
        Add Lesson
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the lesson{" "}
              <strong>
                {selectedLesson ? selectedLesson?.lesson?.name : ""}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
