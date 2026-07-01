const Loading = ({ type = "grid", count = 6 }) => {
  // 1. Sleek Circular Spinner
  if (type === "spinner") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-stone-850">
        <div className="relative w-16 h-16">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-4 border-orange-600/10"></div>
          {/* Pulsing scanning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-655 animate-spin"></div>
        </div>
        <p className="text-orange-655 font-mono text-sm tracking-wider uppercase animate-pulse">
          Fetching System Core...
        </p>
      </div>
    );
  }

  // 2. Details Page Skeleton
  if (type === "details") {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="bg-stone-200/50 border border-stone-100 rounded-3xl aspect-square w-full"></div>
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-32 bg-stone-200/70 rounded"></div>
            <div className="h-10 w-3/4 bg-stone-200/70 rounded"></div>
            <div className="h-8 w-24 bg-stone-200/70 rounded"></div>
            <div className="h-20 w-full bg-stone-200/70 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-stone-200/70 rounded"></div>
              <div className="h-4 w-5/6 bg-stone-200/70 rounded"></div>
              <div className="h-4 w-4/5 bg-stone-200/70 rounded"></div>
            </div>
            <div className="h-12 w-48 bg-stone-200/70 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Grid of Card Skeletons (Default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-stone-100 rounded-[28px] p-5 space-y-4 shadow-sm"
        >
          {/* Image placeholder */}
          <div className="bg-stone-200/50 rounded-2xl aspect-video w-full"></div>
          
          {/* Content placeholders */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/4 bg-stone-200/70 rounded"></div>
              <div className="h-4 w-12 bg-stone-200/70 rounded-full"></div>
            </div>
            
            <div className="h-6 w-3/4 bg-stone-200/70 rounded"></div>
            
            <div className="h-4 w-full bg-stone-200/70 rounded"></div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-20 bg-slate-200/70 rounded"></div>
              <div className="h-10 w-28 bg-slate-200/70 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;