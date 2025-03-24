export interface Lesson {
  name: string;
  content: string;
  duration: string;
  _id?: string;
}

export interface Module {
  title: string;
  duration: string;
  lessons: Lesson[];
  _id?: string;
}

export interface CourseModule {
  title: string;
  duration: string;
  lessons: Lesson[];
  _id: string;
}

export interface Course {
  _id: string;
  course_title: string;
  course_description: string;
  course_modules: CourseModule[];
  isCompleted: boolean;
  progress: number;
  users: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseForm {
  course_title: string;
  course_description: string;
  course_modules: Module[];
}
