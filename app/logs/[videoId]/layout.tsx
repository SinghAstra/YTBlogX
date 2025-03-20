import { Navbar } from "@/components/dashboard/navbar";

interface VideoLogsLayoutProps {
  children: React.ReactNode;
}

export default async function RepositoryLogsLayout({
  children,
}: VideoLogsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">{children}</div>
    </div>
  );
}
