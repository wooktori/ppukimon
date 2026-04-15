"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `?query=${encodeURIComponent(trimmed)}` : "/");
  };

  const handleClear = () => {
    setValue("");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mt-6">
      <div className="relative flex-1">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="영문명 또는 번호 (예: pikachu, 25)"
          className="w-full px-4 py-2.5 pr-9 rounded-xl border-2 border-yellow-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl transition-colors text-sm"
      >
        검색
      </button>
    </form>
  );
}
