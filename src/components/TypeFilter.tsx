"use client";

import { useRouter } from "next/navigation";
import { TYPE_KO, TYPE_COLORS } from "@/lib/pokemon-types";

export default function TypeFilter({ activeType }: { activeType: string }) {
  const router = useRouter();

  const handleClick = (type: string) => {
    router.push(type === activeType ? "/" : `?type=${type}`);
  };

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-5">
      {Object.keys(TYPE_KO).map((type) => (
        <button
          key={type}
          onClick={() => handleClick(type)}
          className={`text-xs hover:cursor-pointer font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap
            ${TYPE_COLORS[type]}
            ${
              activeType === type
                ? "ring-2 ring-offset-1 ring-gray-500 scale-105"
                : "opacity-60 hover:opacity-100"
            }`}
        >
          {TYPE_KO[type]}
        </button>
      ))}
    </div>
  );
}
