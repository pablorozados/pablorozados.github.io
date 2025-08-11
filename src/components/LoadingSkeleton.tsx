import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type?: 'timeline' | 'statistics' | 'hero';
}

const LoadingSkeleton = ({ type = 'timeline' }: LoadingSkeletonProps) => {
  if (type === 'hero') {
    return (
      <section className="text-center mb-16">
        <div className="mb-8">
          <Skeleton className="mx-auto max-w-md w-full h-80 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </section>
    );
  }

  if (type === 'statistics') {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="retro-card p-6 text-center rounded-lg">
            <Skeleton className="h-10 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </section>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="space-y-8">
        {/* Mobile Timeline Skeleton */}
        <div className="md:hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-6">
              <Skeleton className="h-6 w-16 mb-3" />
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex gap-3">
                    <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Timeline Skeleton */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            {/* Timeline points */}
            <div className="flex justify-between items-center relative">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="w-6 h-6 rounded-full mb-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;