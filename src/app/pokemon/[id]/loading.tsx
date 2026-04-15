export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="h-5 w-20 bg-yellow-200 rounded-full animate-pulse mb-8" />
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-yellow-100">
        <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 flex flex-col items-center pt-10 pb-6 px-6">
          <div className="w-48 h-48 bg-yellow-200 rounded-full animate-pulse" />
          <div className="h-9 w-40 bg-yellow-200 rounded-full mt-4 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded-full mt-2 animate-pulse" />
          <div className="flex gap-2 mt-3">
            <div className="h-7 w-16 bg-orange-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-2xl h-20 animate-pulse" />
            <div className="bg-yellow-50 rounded-2xl h-20 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-4 w-8 bg-gray-100 rounded-full animate-pulse" />
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
