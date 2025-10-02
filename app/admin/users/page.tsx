"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { getAllUsers } from "@/api/routes/user"
import { User } from "@/types/types" // Using our global User type
import { UsersIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

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
    // Assuming you have an 'status' field on your user model
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

export default function UserManagementPage() {
  const { token } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [token])

  const fetchUsers = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await getAllUsers(token)
      setUsers(data)
    } catch (error) {
      addToast("Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    )
  }

  return (
    <AdminProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-blue-400" />
            User Management
          </h1>
          <p className="mt-2 text-gray-400">Manage all users in the system.</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Account Status</th>
                  <th className="table-header">KYC Status</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getAccountStatusBadge(user.status)}>{user.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getKycStatusBadge(user.verificationStatus)}>{user.verificationStatus}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
