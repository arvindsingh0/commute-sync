import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number"),

});

export type SignupInput = z.infer<typeof signupSchema>;