"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithToken } = useAuth();
  const { addToast } = useToast();
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window === 'undefined') return;
    
    // Check for existing token and stored email
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("lastEmail");

    if (token) {
      // If there's a valid token, attempt to use it
      handleTokenLogin(token);
    } else if (storedEmail) {
      // If there's a stored email but no token, show returning user screen
      setIsReturningUser(true);
      setEmail(storedEmail);
    }
  }, []);

  const handleTokenLogin = async (token: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      const success = await loginWithToken(token, refreshToken);
      if (success) {
        addToast("Welcome back!", "success");
      }
    } catch (error) {
      // If token is invalid, show returning user screen
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      setIsReturningUser(true);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        addToast(result.error || "Invalid email or password", "error");
      } else {
        addToast("Login successful!", "success");
      }
    } catch (error) {
      console.error("Login error:", error);
      addToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/braavos-logo.svg"
              alt="Braavos"
              width={80}
              height={80}
              className="mb-4"
              priority
            />
          </div>
          {isReturningUser ? (
            <>
              <h2 className="mt-6 text-3xl font-bold text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-xl text-gray-300">Unlock your wallet</p>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-3xl font-bold text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Access your sync dashboard
              </p>
            </>
          )}
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isReturningUser && (
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading
                  ? "Please wait..."
                  : isReturningUser
                  ? "Unlock"
                  : "Sign in"}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              {isReturningUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReturningUser(false);
                      setEmail("");
                      localStorage.removeItem("lastEmail");
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Use different account
                  </button>
                  <Link
                    href="/forgot-password"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </>
              )}
            </div>

            {/* {!isReturningUser && (
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
}
