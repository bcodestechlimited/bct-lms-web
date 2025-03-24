import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { courseService } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loading-spinner";
import { Module } from "@/interfaces/course.interface";

export default function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

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
      <h1 className="text-3xl font-bold mb-6">{course.course_title}</h1>
      <p className="text-gray-700 mb-6">{course.course_description}</p>

      <div className="space-y-6">
        {course.course_modules.map((module: Module, moduleIndex: number) => (
          <div key={moduleIndex} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
            <p className="text-gray-600 mb-4">Duration: {module.duration}</p>

            <div className="space-y-4">
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="border-l-4 border-black pl-4">
                  <h3 className="text-lg font-medium">{lesson.name}</h3>
                  <p className="text-gray-600">Content: {lesson.content}</p>
                  <p className="text-gray-600">Duration: {lesson.duration}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate("/admin-dashboard/course")}
        >
          Back to Courses
        </Button>
        <Button
          onClick={() => navigate(`/admin-dashboard/course/${courseId}/edit`)}
        >
          Edit Course
        </Button>
      </div>
    </div>
  );
}
