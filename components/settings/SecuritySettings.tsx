"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { changePassword } from "@/api/routes/user"

// Placeholder for 2FA component
const TwoFactorAuth = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication (2FA)</h4>
      <p className="text-gray-400 mb-4">2FA is currently disabled.</p>
      <button className="btn btn-primary">Enable 2FA</button>
    </div>
  )
}

export default function SecuritySettings() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("New passwords do not match", "error")
      return
    }

    setLoading(true)
    try {
      await changePassword(user.id, { 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      }, token)
      addToast("Password updated successfully", "success")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      addToast("Failed to update password", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-8">
      {/* Change Password Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-gray-800 pt-8">
        <TwoFactorAuth />
      </div>
    </div>
  )
}
