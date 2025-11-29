"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createUser } from "@/api/routes/user";
import {
  userRegistrationSchema,
  type UserRegistrationFormData,
} from "@/lib/validations/validations";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    setIsLoading(true);

    try {
      await createUser(data);
      addToast(
        "Registration successful! Please login with your credentials.",
        "success"
      );
      router.push("/login");
    } catch (error: any) {
      const responseData = error.response?.data;

      if (responseData?.field && responseData?.error) {
        setError(responseData.field as keyof UserRegistrationFormData, {
          message: responseData.error,
        });
      } else if (Array.isArray(responseData?.message)) {
        responseData.message.forEach((err: any) => {
          if (err.property) {
            setError(err.property as keyof UserRegistrationFormData, {
              message: Object.values(err.constraints)[0] as string,
            });
          }
        });
      } else {
        const errorMessage =
          responseData?.message ||
          error.message ||
          "Registration failed. Please try again.";
        addToast(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">Join our sync platform</p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    type="text"
                    className={`form-input h-12 transition-colors duration-200 ${
                      errors.firstName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Enter your first name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    type="text"
                    className={`form-input h-12 transition-colors duration-200 ${
                      errors.lastName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                    }`}
                    placeholder="Enter your last name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`form-input h-12 transition-colors duration-200 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  className={`form-input h-12 transition-colors duration-200 ${
                    errors.phoneNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="e.g., +2348012345678 or 08012345678"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>


            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input h-12 pr-12 transition-colors duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full btn-primary h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner h-5 w-5 mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
