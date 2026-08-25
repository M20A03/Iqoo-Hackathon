import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#203325] text-[#f6f2e9] p-6 sm:p-12 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center max-w-7xl mx-auto border-b border-[#f6f2e9]/20 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 bg-[#f3a027]/40 rounded-xl" />
          <Skeleton className="h-8 w-32 bg-[#f6f2e9]/30 rounded-lg" />
        </div>
        <div className="hidden sm:flex gap-3">
          <Skeleton className="h-10 w-28 bg-[#f3a027]/40 rounded-full" />
          <Skeleton className="h-10 w-28 bg-[#f6f2e9]/20 rounded-full" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-12 items-center py-12">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-8 w-48 bg-[#f3a027]/30 rounded-full" />
          <Skeleton className="h-16 w-full max-w-lg bg-[#f6f2e9]/30 rounded-2xl" />
          <Skeleton className="h-24 w-full max-w-md bg-[#f6f2e9]/20 rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-48 bg-[#f3a027]/50 rounded-full" />
            <Skeleton className="h-14 w-48 bg-[#f6f2e9]/30 rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <Skeleton className="h-96 w-full bg-[#1b2e22] border-4 border-[#121b14] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
