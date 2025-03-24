import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Loader from "@/components/loading-spinner";
import { courseService } from "@/services/course.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Lesson, Module } from "@/interfaces/course.interface";
import { cn } from "@/lib/utils";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  console.log(courseId);

  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);

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

  // Set default video when data loads
  useEffect(() => {
    if (
      course &&
      course.course_modules.length > 0 &&
      course.course_modules[0].lessons.length > 0
    ) {
      setSelectedVideo(course.course_modules[0].lessons[0]);
    }
  }, [course]);

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

  // console.log(course);

  return (
    <div className="flex gap-6 flex-col lg:flex-row w-full h-screen">
      {/* Video Section */}
      <div className="lg:w-2/3">
        <h2 className="text-xl font-bold mb-2">Title: {selectedVideo?.name}</h2>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={selectedVideo?.content}
            allowFullScreen
          ></iframe>
        </div>
        <p className="mt-2">
          <span className="font-bold">Duration:</span> {selectedVideo?.duration}
        </p>
      </div>

      {/* Modules Section */}
      <div className="lg:w-1/3 lg:pt-10">
        <h2 className="text-lg font-bold mb-2">Modules</h2>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={course.course_modules[0].title}
          onValueChange={(value) => {
            console.log(value);
          }}
        >
          {course.course_modules.map((module: Module) => {
            return (
              <AccordionItem value={module.title} key={module._id}>
                <AccordionTrigger className="capitalize">
                  {module.title}
                </AccordionTrigger>
                {module.lessons.map((lesson: Lesson) => {
                  return (
                    <AccordionContent
                      key={lesson._id}
                      className={cn(
                        `divide-y-2 w-full flex underline text-blue-500 cursor-pointer`,
                        selectedVideo?._id === lesson._id && "text-purple-500"
                      )}
                      onClick={() => setSelectedVideo(lesson)}
                    >
                      <span className="font-bold">{lesson.name}</span> :{" "}
                      {lesson.duration}
                    </AccordionContent>
                  );
                })}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
