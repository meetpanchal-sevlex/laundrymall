import React from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-lg transition-all duration-300 p-6 sm:p-8 bg-white border border-gray-200/80 justify-between flex flex-col space-y-4 hover:-translate-y-0.5",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-0.5 transition duration-200">
        <div className="p-2.5 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4">
          {icon}
        </div>
        <div className="font-bold text-gray-900 text-lg sm:text-xl tracking-tight mb-2">
          {title}
        </div>
        <div className="text-gray-500 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
