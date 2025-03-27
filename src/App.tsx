import "./App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import { Link } from "react-router";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">LMS Platform</h1>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="default">
            <Link to="/auth/register">Register</Link>
          </Button>
          {/* <Button variant="destructive">
            <Link to="/admin/login">Admin</Link>
          </Button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-4xl font-bold">
          Empowering Learning Anytime, Anywhere
        </h2>
        <p className="mt-4 text-lg">
          Join thousands of learners and educators on our platform.
        </p>
        <Button className="mt-6 bg-white text-blue-600 hover:bg-gray-200">
          Get Started
        </Button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <GraduationCap className="text-blue-600 text-4xl mx-auto" />
          <CardContent>
            <h3 className="text-xl font-semibold">Expert Instructors</h3>
            <p className="text-gray-600">Learn from industry professionals.</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6">
          <Users className="text-blue-600 text-4xl mx-auto" />
          <CardContent>
            <h3 className="text-xl font-semibold">Community Support</h3>
            <p className="text-gray-600">Engage with fellow learners.</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6">
          <BookOpen className="text-blue-600 text-4xl mx-auto" />
          <CardContent>
            <h3 className="text-xl font-semibold">Vast Course Library</h3>
            <p className="text-gray-600">Access a variety of courses.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default App;
