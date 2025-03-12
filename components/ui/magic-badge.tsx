import React from "react";

interface Props {
  title: string;
}

const MagicBadge = ({ title }: Props) => {
  return (
    <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none">
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--accent))_50%,hsl(var(--primary))_100%)]" />
      <span className="inline-flex h-full w-full  items-center justify-center rounded-full bg-background px-4 py-1 text-sm font-medium text-primary backdrop-blur-3xl">
        {title}
      </span>
    </div>
  );
};

export default MagicBadge;
