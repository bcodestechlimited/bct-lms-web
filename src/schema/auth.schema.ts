import {z} from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty({message: "Email is required"}).email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .nonempty({message: "Password is required"})
    .min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
