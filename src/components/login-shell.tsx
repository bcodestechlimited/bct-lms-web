import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useLogin();

  function onSubmit(values: z.infer<typeof loginSchema>) {
    const payload = {
      email: values.email,
      password: values.password,
    };
    toast.promise(login.mutateAsync(payload), {
      loading: "Logging in...",
      success: (res) => {
        if (!res.success) return "Invalid credentials";

        const firstName = res.responseObject.user.firstName;
        navigate(`/dashboard`);
        return `Welcome back ${firstName}`;
      },
      error: () => {
        return "Login failed, invalid credentials.";
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={login.isPending}>
          {login.isPending ? (
            <Loader2 className="animate-spin text-white" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
