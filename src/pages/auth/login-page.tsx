import { LoginForm } from "@/components/login-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { HomeIcon } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 hidden md:block">
        <img
          src="/assets/login.webp"
          className="h-screen w-full object-cover"
        />
      </div>
      <div className=" w-full md:w-1/2 flex items-center justify-center relative">
        <div className="absolute top-6 right-6">
          <Link to="/" className="text-black flex items-center gap-1">
            <HomeIcon /> Back to home
          </Link>
        </div>

        <Card className="max-w-xl w-[550px] mx-auto border rounded-lg py-4">
          <CardHeader>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p>Sign in to continue learning</p>
          </CardHeader>
          <CardContent>
            <CardDescription className="space-y-4">
              <LoginForm />
              <div className="flex items-center justify-end">
                <Link to="/auth/forgot-password" className="text-black">
                  Forgot Password?
                </Link>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
