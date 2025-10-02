import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import '../config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
          <Providers>
            {children}
          </Providers>
        </main>
      </div>
    </div>
  );
}
