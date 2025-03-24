import { PublicCourseCard } from "@/components/course-card";
import Loader from "@/components/loading-spinner";
import { Course } from "@/interfaces/course.interface";
import { courseService } from "@/services/course.service";
import { useQuery } from "@tanstack/react-query";

export default function Courses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAllCourses(),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {/* <h1>View All Courses</h1> */}

      <div className="">
        <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: Course) => (
            <PublicCourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
