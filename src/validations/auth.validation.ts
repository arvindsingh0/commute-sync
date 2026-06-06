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
    
  phoneNumber: z
  .string()
  .regex(
    /^[6-9]\d{9}$/,
    "Invalid phone number"
  ),
  gender: z.enum([
  "MALE",
  "FEMALE",
  "OTHER",
]),
  password: z
  .string()
  .min(
    6,
    "Password must be at least 6 characters"
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "Password must contain an uppercase letter, lowercase letter, and number"
  ),

});

export type SignupInput = z.infer<typeof signupSchema>;