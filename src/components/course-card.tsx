import { Course } from "@/interfaces/course.interface";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Link } from "react-router";

export function CourseCard({ course }: { course: Course }) {

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{course.course_title}</CardTitle>
        <CardDescription>{course.course_description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link to={`/dashboard/${course._id}`}> Continue Learning</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PublicCourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{course.course_title}</CardTitle>
        <CardDescription>{course.course_description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} />
        </div> */}
      </CardContent>
      <CardFooter>
        {/* <Button className="w-full" asChild>
          <Link to={`/dashboard/${course._id}`}> Continue Learning</Link>
        </Button> */}
      </CardFooter>
    </Card>
  );
}
