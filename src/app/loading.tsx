export default function Loading({
  hideHeader = false,
  hideFirst = false,
}: {
  hideHeader?: boolean;
  hideFirst?: boolean;
} = {}) {
  const skeletonCount = hideFirst ? 19 : 20;

  return (
    <>
      {!hideHeader && (
        <section className="bg-gradient-to-b from-yellow-200 to-yellow-50 py-12 px-4 text-center">
          <div className="h-4 w-40 bg-yellow-300 rounded-full mx-auto mb-3 animate-pulse" />
          <div className="h-10 w-56 bg-yellow-300 rounded-full mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-yellow-200 rounded-full mx-auto animate-pulse" />
          <div className="h-10 max-w-sm mx-auto mt-6 bg-yellow-200 rounded-xl animate-pulse" />
        </section>
      )}

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-28 bg-yellow-200 rounded-full animate-pulse" />
          <div className="h-7 w-24 bg-yellow-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-yellow-100 overflow-hidden shadow-sm">
              <div className="bg-yellow-50 h-40 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-yellow-100 rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-5 w-1/3 bg-orange-100 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
