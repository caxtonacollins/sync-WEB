"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/contexts/ToastContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { createUser } from "@/api/routes/user"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bvn, setBvn] = useState("")
  const [nin, setNin] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic client-side validation
    if (!email || !password || !firstName || !lastName) {
      addToast("Please fill in all required fields.", "error")
      return
    }
    
    if (password.length < 8) {
      addToast("Password must be at least 8 characters long.", "error")
      return
    }
    
    setIsLoading(true)

    try {
      await createUser({ firstName, lastName, email, password, phoneNumber, bvn, nin });
      addToast("Registration successful! Please login with your credentials.", "success")
      router.push("/login")
    } catch (error: any) {
      // Extract error message from the error response if available
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      addToast(errorMessage, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">Join our sync platform</p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="form-input h-12"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="form-input h-12"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input h-12"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="form-input h-12"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bvn" className="form-label">
                BVN
              </label>
              <input
                id="bvn"
                name="bvn"
                type="text"
                required
                className="form-input h-12"
                placeholder="Enter your BVN"
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nin" className="form-label">
                NIN
              </label>
              <input
                id="nin"
                name="nin"
                type="text"
                required
                className="form-input h-12"
                placeholder="Enter your NIN"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input h-12 pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
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
  )
}