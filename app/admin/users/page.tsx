"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import AdminLayout from "@/components/admin/AdminLayout"
import { getAllUsers } from "@/api/routes/user"
import { User } from "@/types"
import { UsersIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterKYC, setFilterKYC] = useState<string>("all")

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [token])

  const fetchUsers = async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await getAllUsers(token)
      // Extract users array from paginated response
      const usersData = res.data || res
      setUsers(Array.isArray(usersData) ? usersData : usersData.data || [])
    } catch (error) {
      addToast("Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesKYC = filterKYC === "all" || user.verificationStatus === filterKYC
    
    return matchesSearch && matchesStatus && matchesKYC
  })

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner h-12 w-12"></div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    )
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <UsersIcon className="h-8 w-8 mr-3 text-blue-400" />
                User Management
              </h1>
              <p className="mt-2 text-gray-400">Manage all users in the system</p>
            </div>
            <Badge className="bg-blue-900 text-blue-400 border border-blue-700">
              {filteredUsers.length} Users
            </Badge>
          </div>

          {/* Filters & Search */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="CLOSED">Closed</option>
                  <option value="RESTRICTED">Restricted</option>
                </select>

                {/* KYC Filter */}
                <select
                  value={filterKYC}
                  onChange={(e) => setFilterKYC(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All KYC Status</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="UNVERIFIED">Unverified</option>
                </select>

                {/* Reset Filters */}
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                    setFilterKYC("all")
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-900">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        KYC
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                          No users found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-700 transition-colors cursor-pointer"
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getAccountStatusBadge(user.status)}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getKycStatusBadge(user.verificationStatus)}>
                              {user.verificationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={
                                user.role === "ADMIN"
                                  ? "border-orange-600 text-orange-400"
                                  : "border-gray-600 text-gray-400"
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
