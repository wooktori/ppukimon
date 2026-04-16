import Image from "next/image";
import Link from "next/link";
import { TYPE_KO, TYPE_COLORS } from "@/lib/pokemon-types";
import { getPokemonImageUrl } from "@/lib/pokemon";

interface PokemonCardProps {
  id: number;
  koreanName: string;
  englishName: string;
  description: string;
  types: string[];
  priority?: boolean;
}

export default function PokemonCard({
  id,
  koreanName,
  englishName,
  description,
  types,
  priority = false,
}: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${id}`} className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-yellow-100 block">
      <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">
        #{String(id).padStart(3, "0")}
      </div>
      <div className="bg-yellow-50 flex items-center justify-center pt-10 pb-4 px-4">
        <Image
          src={getPokemonImageUrl(id)}
          alt={koreanName}
          width={120}
          height={120}
          sizes="120px"
          priority={priority}
          className="drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="font-bold text-lg leading-tight">{koreanName}</p>
        <p className="text-gray-400 text-sm mb-2">{englishName}</p>
        <div className="flex gap-1 flex-wrap mb-2">
          {types.map((type) => (
            <span
              key={type}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[type] ?? "bg-gray-200 text-gray-600"}`}
            >
              {TYPE_KO[type] ?? type}
            </span>
          ))}
        </div>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}
