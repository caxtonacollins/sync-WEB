"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { useState, useEffect } from "react"
import { updateUserProfile } from "@/api/routes/user"

export default function ProfileSettings() {
  const { user, token, fetchUser } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    setLoading(true)
    try {
      await updateUserProfile(user.id, formData, token)
      addToast("Profile updated successfully", "success")
      fetchUser() // Re-fetch user data to update the UI
    } catch (error) {
      addToast("Failed to update profile", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input bg-gray-800 cursor-not-allowed"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
