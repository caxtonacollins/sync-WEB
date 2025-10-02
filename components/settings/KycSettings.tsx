"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { useState, useEffect } from "react"
import { updateUserProfile } from "@/api/routes/user"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "status-badge status-verified"
    case "PENDING":
      return "status-badge status-pending"
    case "REJECTED":
      return "status-badge status-rejected"
    default:
      return "status-badge status-unverified"
  }
}

export default function KycSettings() {
  const { user, token, fetchUser } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    idType: "",
    idNumber: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postalCode: user.postalCode || "",
        idType: user.idType || "",
        idNumber: user.idNumber || "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    setLoading(true)
    try {
      await updateUserProfile(user.id, { ...formData, verificationStatus: 'PENDING' }, token)
      addToast("KYC information submitted successfully", "success")
      fetchUser() // Re-fetch user data to update the status
    } catch (error) {
      addToast("Failed to submit KYC information", "error")
    } finally {
      setLoading(false)
    }
  }

  const isReadOnly = user?.verificationStatus === 'PENDING' || user?.verificationStatus === 'VERIFIED';

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">KYC Verification</h3>
        {user && (
            <span className={getStatusBadge(user.verificationStatus)}>
                {user.verificationStatus}
            </span>
        )}
      </div>

      {isReadOnly ? (
        <div className="text-gray-300 space-y-4">
            <p>Your KYC information is currently under review or has been verified. You cannot make changes at this time.</p>
            {/* Display submitted data here */}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-400">Submit your personal information and identification for verification.</p>
            {/* Form fields */}
            <div>
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-input" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="form-input" />
                </div>
                <div>
                    <label htmlFor="state" className="form-label">State</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className="form-input" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="country" className="form-label">Country</label>
                    <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="form-input" />
                </div>
                <div>
                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                    <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} className="form-input" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="idType" className="form-label">ID Type</label>
                    <select id="idType" name="idType" value={formData.idType} onChange={handleChange} className="form-input">
                        <option value="">Select ID Type</option>
                        <option value="passport">Passport</option>
                        <option value="driver_license">Driver's License</option>
                        <option value="national_id">National ID</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="idNumber" className="form-label">ID Number</label>
                    <input type="text" id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleChange} className="form-input" />
                </div>
            </div>
            {/* Placeholder for file uploads */}
            <div className="border-t border-gray-800 pt-6">
                <p className="text-gray-400">Document upload will be implemented here.</p>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Submitting..." : "Submit for Verification"}
                </button>
            </div>
        </form>
      )}
    </div>
  )
}
