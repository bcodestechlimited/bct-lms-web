import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import errorImage from "@/assets/images/404-image.jpg";

interface ErrorPageProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
  onReset?: () => void;
}

export default function ErrorPage({
  error,
  errorInfo,
  onReset,
}: ErrorPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Log error to error reporting service
    if (error) {
      // console.error("Error occurred:", error, errorInfo);
    }
  }, [error, errorInfo]);

  const handleReset = () => {
    onReset?.();
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="dark text-foreground bg-background min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-[600px] w-full p-6">
        <CardHeader className="flex flex-col items-center gap-4">
          <img
            src={errorImage}
            alt="Error illustration"
            className="w-32 h-32 object-cover rounded-md"
            width={130}
            height={130}
          />
          <h1 className="text-2xl font-bold text-center">
            Oops! Something went wrong
          </h1>
        </CardHeader>

        <CardDescription className="flex flex-col gap-6 items-center">
          <div className="text-center space-y-2">
            <p>
              We're working on fixing this issue. Please try one of these
              options:
            </p>

            {import.meta.env.DEV && error && (
              <details className="text-left text-sm text-danger-500">
                <summary className="cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {error.toString()}
                  {"\n"}
                  {errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[300px]">
            <Button color="primary" className="w-full" onClick={handleReset}>
              Reload Page
            </Button>

            <Button
              color="default"
              variant="outline"
              className="w-full"
              onClick={handleGoHome}
            >
              Go to Homepage
            </Button>
          </div>

          <p className="text-sm text-default-500">
            If the problem persists, contact our{" "}
            <a
              href="mailto:support@example.com"
              className="text-primary-500 hover:underline"
            >
              support team
            </a>
          </p>
        </CardDescription>
      </Card>
    </div>
  );
}
