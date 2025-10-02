// This layout file is intentionally minimal to avoid conflicts with the main Layout component
// All dashboard pages should import and use the unified Layout from @/components/Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
