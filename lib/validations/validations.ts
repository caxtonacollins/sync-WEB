import { z } from "zod";

/**
 * Nigerian phone number validation
 * Supports formats like: +2348012345678, 08012345678, 2348012345678
 */
export const nigerianPhoneRegex = /^(\+?234|0)[789]\d{9}$/;

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character"
  );

/**
 * User registration form validation schema
 */
export const userRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters"),

  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || nigerianPhoneRegex.test(val), {
      message:
        "Phone number must be in Nigerian format (e.g., +2348012345678 or 08012345678)",
    }),

  password: passwordSchema,
});

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters"),

  password: z.string().min(1, "Password is required"),
});

/**
 * Password change form validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Type exports for form data
 */
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
