import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center gap-3 p-4 bg-[#1b2e22]/90 backdrop-blur-sm animate-pulse">
          <Skeleton className="h-6 w-3/4 bg-[#f3a027]/20 rounded-lg" />
          <Skeleton className="h-32 w-full bg-[#f6f2e9]/10 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-1/2 bg-[#f3a027]/30 rounded-full" />
            <Skeleton className="h-8 w-1/2 bg-[#f6f2e9]/20 rounded-full" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        {...props}
      />
    </div>
  );
}
