import { Navbar } from "@/components/dashboard/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 min-h-screen border border-yellow-400">
        {children}
      </main>
    </div>
  );
};

export default HomeLayout;
