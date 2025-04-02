import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { courseService } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loading-spinner";
import { Course, Module } from "@/interfaces/course.interface";
import { ChevronDown, ChevronUp, MoveLeft } from "lucide-react";
import ConfirmCourseDeletion from "./confirm-course-deletion";

export default function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getCourseById(courseId as string),
    enabled: !!courseId,
  });

  // Handle successful data fetch with useEffect
  useEffect(() => {
    if (course?.course_modules) {
      const initialExpandedState = course.course_modules.reduce(
        (acc: any, _: any, index: number) => {
          acc[index] = false;
          return acc;
        },
        {} as Record<number, boolean>
      );
      setExpandedModules(initialExpandedState);
    }
  }, [course]);

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Error:{" "}
          {error instanceof Error
            ? error.message
            : "Failed to load course details"}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="my-6 flex gap-3 justify-between items-center">
        <Link to="/admin-dashboard/course">
          <Button variant="outline">
            <MoveLeft />
            Back to Courses
          </Button>
        </Link>
        <div className="flex gap-3">
          <Link to={`/admin-dashboard/course/${courseId}/edit`}>
            <Button>Edit Course</Button>
          </Link>
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              setSelectedCourse(course);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete Course
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">{course.course_title}</h1>
      <p className="text-gray-700 mb-6">{course.course_description}</p>

      <div className="space-y-4">
        {course.course_modules.map((module: Module, moduleIndex: number) => (
          <div key={moduleIndex} className="border rounded-lg overflow-hidden">
            <div
              className="p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => toggleModule(moduleIndex)}
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(moduleIndex);
                  }}
                >
                  {expandedModules[moduleIndex] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <div>
                  <h2 className="text-xl font-semibold">{module.title}</h2>
                  <p className="text-gray-600">Duration: {module.duration}</p>
                </div>
              </div>
            </div>

            {expandedModules[moduleIndex] && (
              <div className="p-4 space-y-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="border-l-4 border-black pl-4"
                  >
                    <h3 className="text-lg font-medium">{lesson.name}</h3>
                    <p className="text-gray-600">Content: {lesson.content}</p>
                    <p className="text-gray-600">Duration: {lesson.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

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
