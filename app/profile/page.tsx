"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { changePassword, updateUserProfile } from "@/api/routes/user"

export default function ProfilePage() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [fullName, setFullName] = useState(`${user?.lastName} + ${user?.firstName}` || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setIsUpdatingProfile(true);

    try {
      await updateUserProfile(user.id, { fullName, email }, token);
      addToast("Profile updated successfully!", "success");
    } catch (error) {
      addToast("Failed to update profile", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }
    if (!user || !token) return;

    setIsChangingPassword(true);

    try {
      await changePassword(user.id, { currentPassword, newPassword }, token);
      addToast("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      addToast("Failed to change password", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Profile Information */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Update your account's profile information.</p>
                  </div>
                  <form className="mt-6 space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-input h-12"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input h-12"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn-primary h-12 px-8 disabled:opacity-50"
                      >
                        {isUpdatingProfile ? (
                          <div className="flex items-center">
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                            Updating...
                          </div>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Update your password to keep your account secure.</p>
                  </div>
                  <form className="mt-6 space-y-6" onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-input h-12"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input h-12"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input h-12"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-primary h-12 px-8 disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <div className="flex items-center">
                            <div className="loading-spinner h-4 w-4 mr-2"></div>
                            Changing...
                          </div>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
