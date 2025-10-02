"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { getUserById, updateUserProfile } from "@/api/routes/user"
import { User } from "@/types/types"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const getKycStatusBadge = (status: string) => {
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

const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "status-badge status-verified"
      case "SUSPENDED":
        return "status-badge status-pending"
      case "CLOSED":
        return "status-badge status-rejected"
      default:
        return "status-badge status-unverified"
    }
  }

export default function UserDetailPage() {
  const { token } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token && id) {
      fetchUser()
    }
  }, [token, id])

  const fetchUser = async () => {
    if (!token || !id) return
    try {
      setLoading(true)
      const data = await getUserById(id as string, token)
      setUser(data)
    } catch (error) {
      addToast("Failed to fetch user details", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!token || !id) return;
    try {
        await updateUserProfile(id as string, { status }, token);
        fetchUser();
        addToast(`User status updated to ${status}`, "success");
    } catch (error) {
        addToast("Failed to update user status", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    )
  }

  if (!user) {
    return <div>User not found.</div>
  }

  return (
    <AdminProtectedRoute>
      <div className="space-y-8">
        <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Users</span>
        </button>

        <div className="card">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                    <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="flex space-x-4">
                    <span className={getAccountStatusBadge(user.status)}>{user.status}</span>
                    <span className={getKycStatusBadge(user.verificationStatus)}>{user.verificationStatus}</span>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-6 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Admin Actions</h3>
                <div className="flex space-x-4">
                    <button onClick={() => handleStatusChange('ACTIVE')} className="btn btn-success">Activate</button>
                    <button onClick={() => handleStatusChange('SUSPENDED')} className="btn btn-warning">Suspend</button>
                    <button onClick={() => handleStatusChange('CLOSED')} className="btn btn-danger">Close Account</button>
                </div>
            </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
