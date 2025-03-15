import { Navbar } from "@/components/dashboard/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
};

export default HomeLayout;
