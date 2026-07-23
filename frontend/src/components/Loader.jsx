import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="card space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
  </div>
);

const Loader = ({ fullScreen = false }) => (
  <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-12"}`}>
    <div className="h-10 w-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

export default Loader;
