"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description: string;
  href?: string;
  cta?: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col gap-1 transition-all duration-300">
      {Icon && <Icon className="h-10 w-10 origin-left text-blue-600 transition-all duration-300 ease-in-out group-hover:scale-110" />}
      <h3 className="text-xl font-bold text-gray-900 mt-2 tracking-tight">
        {name}
      </h3>
      <p className="max-w-lg text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>

    {href && cta && (
      <div className="z-10 mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
        <span>{cta}</span>
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </div>
    )}

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-blue-50/20" />
  </div>
);
