"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon, FingerPrintIcon } from "@heroicons/react/24/outline";
import { loginWithPasskey } from '@/lib/passkey';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, handlePasskeyLogin, lastEmail, token, clearAuthData, clearLastEmail, loadingStatus } = useAuth();
  const { addToast } = useToast();
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = lastEmail;
    if (!token && storedEmail) {
      setIsReturningUser(true);
      setEmail(storedEmail);
    }
  }, [lastEmail, token]);

  // No token auto-login here; AuthContext manages token-based flows securely in-memory
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

  const handlePasskeySignIn = async () => {
    const emailFromStorage = localStorage.getItem('lastEmail');
    const cleanEmail = emailFromStorage!.replace(/^"|"$/g, '');

    if (!emailFromStorage) {
      setError('Please enter your email first');
      return;
    }
    setIsLoading(true);
    try {
      const result = await loginWithPasskey(cleanEmail);
      if (result.success && result.data) {
        await handlePasskeyLogin(result.data);
        addToast('Logged in with passkey!', 'success');
      } else {
        addToast(result.error || 'Passkey login failed.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Passkey login error:', error);
      addToast('An unexpected error occurred during passkey login.', 'error');
      setIsLoading(false);
    }
  };

  const handleContinueWithLastEmail = () => {
    setIsReturningUser(true);
    setEmail(lastEmail!);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/full-logo-transparent.png"
              alt="Sync Logo"
              width={200}
              height={80}
              className="mb-4 h-auto w-auto"
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
            {isReturningUser && (
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                readOnly
                className="hidden"
              />
            )}
            {!isReturningUser && (
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                autoComplete="current-password"
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
                  ? loadingStatus || "Please wait..."
                  : isReturningUser
                  ? "Unlock"
                  : "Sign in"}
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-950 text-gray-400">
                  or
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePasskeySignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                <FingerPrintIcon className="h-5 w-5 mr-2" />
                Sign in with a passkey
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
                      clearAuthData();
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

            {isMounted &&lastEmail && !isLoading && !isReturningUser && (
              <div className="space-y-4 mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-sm font-medium text-gray-400 bg-gray-950">
                      or continue with
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleContinueWithLastEmail}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-200 bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="truncate max-w-[280px]" title={lastEmail}>
                    {lastEmail}
                  </span>
                  <svg 
                    className="ml-2 w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
