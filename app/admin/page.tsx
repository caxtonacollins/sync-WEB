import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-400">Welcome to the admin dashboard.</p>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
