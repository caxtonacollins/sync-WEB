// This layout file is intentionally minimal to avoid conflicts with the main Layout component
// All admin pages should import and use the unified Layout from @/components/Layout

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
