import { Navbar } from "@/components/dashboard/navbar";

interface VideoLogsLayoutProps {
  children: React.ReactNode;
}

export default async function RepositoryLogsLayout({
  children,
}: VideoLogsLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16">
        {children}
      </div>
    </div>
  );
}
