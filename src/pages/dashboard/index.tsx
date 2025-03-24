import {CourseCard} from "@/components/course-card";
import Loader from "@/components/loading-spinner";
import {Course} from "@/interfaces/course.interface";
import {courseService} from "@/services/course.service";
import {useAuthStore} from "@/store/auth.store";
import {useQuery} from "@tanstack/react-query";

export default function UserDashboardHome() {
  const {user} = useAuthStore();

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-courses"],
    queryFn: () => courseService.getUserCourses({userId: user?._id}),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-md text-center shadow-md">
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">
            There was an error while fetching your courses. Please try again
            later.
          </span>
        </div>
      </div>
    );
  }

  if (!courses) {
    <p>You haven't been assigned any courses yet</p>;
  }

  return (
    <div className=" min-h-screen">
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-8">
          Welcome Back, {user?.firstName ?? "Anon"} 👋!
        </h1>

        <div className="">
          {/* Enrolled Courses Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>

            {/* No Courses Message */}
            {courses.length < 1 && (
              <div className="text-center text-gray-500">
                <p className="text-lg">
                  You haven't been assigned any courses yet.
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: Course) => {
                return <CourseCard key={course._id} course={course} />;
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
